package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificacionRepository extends Neo4jRepository<Notificacion, Long> {

    @Query("MATCH ()-[n:NOTIFICACION]->() WHERE id(n) = $id RETURN n")
    Optional<Notificacion> findById(@Param("id") Long id);

    @Query("MATCH (u:Usuario)<-[n:NOTIFICACION]-(notificacion) WHERE id(u) = $usuarioId RETURN id(n) AS notificacionId")
    List<Long> findNotificacionIdsByUsuario(@Param("usuarioId") Long usuarioId);

    @Query("MATCH ()-[n:NOTIFICACION]->() WHERE id(n) = $id RETURN n.tipo AS tipo")
    String findTipoById(@Param("id") Long id);

    @Query("MATCH ()-[n:NOTIFICACION]->() WHERE id(n) = $id RETURN n.mensaje AS mensaje")
    String findMensajeById(@Param("id") Long id);

    @Query("MATCH ()-[n:NOTIFICACION]->() WHERE id(n) = $id RETURN n.fecha AS fecha")
    LocalDateTime findFechaById(@Param("id") Long id);

    @Query("MATCH ()-[n:NOTIFICACION]->() WHERE id(n) = $id RETURN n.entidadId AS entidadId")
    Long findEntidadIdById(@Param("id") Long id);

    @Query("MATCH ()-[n:NOTIFICACION]->() WHERE id(n) = $id RETURN n.leida AS leida")
    boolean findLeidaById(@Param("id") Long id);

    @Query("""
                MATCH (u:Usuario) WHERE id(u)=$idUsuario
                MATCH (entidad) WHERE id(entidad)=$idEntidad
                WITH u, entidad,
                CASE
                    WHEN entidad:Evento THEN
                        CASE
                            WHEN $tipo = 'RECORDATORIO_EVENTO_PROXIMO' THEN 'Evento proximo: '+ entidad.nombre + entidad.fechaHora
                            WHEN $tipo = 'INSCRIPCION_A_EVENTO' THEN 'Inscripción al evento: ' + entidad.nombre
                            ELSE 'Notificacion de evento'
                        END
                    WHEN entidad:Usuario THEN
                        CASE
                            WHEN $tipo = 'SOLICITUD_ENTRANTE' THEN entidad.nombreUsuario + ' te ha enviado una solicitud de amistad'
                            WHEN $tipo = 'SOLICITUD_ACEPTADA' THEN entidad.nombreUsuario + ' ha aceptado tu solicitud de amistad'
                            ELSE 'Notificación de usuario'
                        END
                    WHEN entidad:Comunidad THEN
                        CASE
                            WHEN $tipo = 'ACEPTACION_PRIVADA' THEN 'Has sido aceptado en la comunidad: '+ entidad.nombre
                            WHEN $tipo = 'UNION_PUBLICA' THEN 'Te has unido a la comunidad: ' + entidad.nombre
                            ELSE 'Notificacion de comunidad'
                        END
                    ELSE 'Notificación'
                END AS mensaje
                CREATE (u)<-[:NOTIFICACION {tipo: $tipo, mensaje: mensaje, fecha: $fecha, leida: false, entidadId: id(entidad)}]-(entidad)
            """)
    void crearNotificacion(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha);

    @Query("""
        MATCH (u:Usuario) WHERE id(u)=$idUsuarioReceptor
        MATCH (u2:Usuario) WHERE id(u2)=$idUsuarioEmisor
        MATCH (entidad) WHERE id(entidad)=$idEntidad
        WITH u, u2, entidad
        WITH u, u2, entidad,
        CASE
            WHEN $tipo = 'LIKE' THEN u2.nombreUsuario + ' le ha dado like a tu publicación: ' + id(entidad)
            WHEN $tipo = 'COMENTARIO' THEN u2.nombreUsuario + 'ha hecho un comentario en tu publicación: '+ id(entidad) 
            ELSE 'Notificación de publicación'
        END AS mensaje
        CREATE (u)<-[:NOTIFICACION {
            tipo: $tipo,
            mensaje: mensaje,
            fecha: $fecha,
            leida: false,
            entidadId: id(entidad)
        }]-(entidad)
    """)
    void crearNotificacionPublicacion(Long idUsuarioReceptor, Long idUsuarioEmisor, Long idEntidad, String tipo, LocalDateTime fecha);
    
    

    @Query("""
                MATCH (u:Usuario)-[n:NOTIFICACION]-(e:Usuario)
                WHERE id(u) = $idReceptor AND id(e) = $idEmisor AND n.tipo = 'SOLICITUD_ENTRANTE'
                DELETE n
            """)
    void eliminarNotificacion(Long idReceptor, Long idEmisor, String tipo);

    @Query("""
                MATCH (u:Usuario) WHERE id(u)=$idUsuarioReceptor
                MATCH (entidad) WHERE id(entidad)=$idEntidad
                CREATE (u)<-[:NOTIFICACION {tipo: $tipo, mensaje: 'Mensaje de prueba', fecha: $fecha, entidadId: id(entidad)}]-(entidad)
            """)
    void crearNotificacionPrueba(Long idUsuarioReceptor, Long usuarioEmisor, Long idEntidad, String tipo,
            LocalDateTime fecha);

            @Query("MATCH ()-[n:NOTIFICACION]->() " +
            "WHERE id(n) = $idNotificacion " +
            "SET n.leida = true")
     void setearNotifacionLeida(Long idNotificacion);
}
