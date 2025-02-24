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
            MATCH (u:Usuario) WHERE id(u) = $idUsuario
            MATCH (entidad) WHERE id(entidad) = $idEntidad
            CREATE (entidad)-[:NOTIFICACION {tipo: $tipo, mensaje: $mensaje, fecha: $fecha, leida: false, entidadId: id(entidad)}]->(u)
            """)
    void crearNotificacionCambioEvento(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha,
            String mensaje);

    @Query("""
            MATCH (u:Usuario) WHERE id(u) = $idUsuario
            MATCH (entidad) WHERE id(entidad) = $idEntidad
            CREATE (entidad)-[:NOTIFICACION {tipo: $tipo, mensaje: $mensaje, fecha: $fecha, leida: false, entidadId: id(entidad)}]->(u)
            """)
    void crearNotificacionMotivoExpulsion(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha,
            String mensaje);

        @Query("""
            MATCH (u:Usuario) WHERE id(u) = $idUsuario
            MATCH (entidad) WHERE id(entidad) = $idEntidad
            CREATE (entidad)-[:NOTIFICACION {tipo: $tipo, mensaje: $mensaje, fecha: $fecha, leida: false, entidadId: id(entidad)}]->(u)
            """)
    void crearNotificacionEliminacion(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha,
            String mensaje);


    @Query("""
                MATCH (u:Usuario) WHERE id(u)=$idUsuarioReceptor
                MATCH (u2:Usuario) WHERE id(u2)=$idUsuarioEmisor
                MATCH (entidad) WHERE id(entidad)=$idEntidad
                WITH u, u2, entidad
                WITH u, u2, entidad,
                CASE
                    WHEN $tipo = 'LIKE' THEN u2.nombreUsuario + ' le ha dado like a tu publicación'
                    WHEN $tipo = 'LIKE_COMENTARIO' THEN u2.nombreUsuario + ' le ha dado like a tu comentario'
                    WHEN $tipo = 'COMENTARIO' THEN u2.nombreUsuario + ' ha hecho un comentario en tu publicación'
                    WHEN $tipo = 'RESPUESTA' THEN u2.nombreUsuario + ' ha respondido tu comentario'
                    WHEN $tipo = 'ARROBA_PUBLICACION' THEN u2.nombreUsuario + ' te ha etiquetado en una publicación'
                    WHEN $tipo = 'ARROBA_COMENTARIO' THEN u2.nombreUsuario + ' te ha etiquetado en un comentario'
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
    void crearNotificacionPublicacion(Long idUsuarioReceptor, Long idUsuarioEmisor, Long idEntidad, String tipo,
            LocalDateTime fecha);

    @Query("""
            MATCH (u:Usuario) WHERE id(u) = $idUsuarioReceptor
            MATCH (uEmisor:Usuario) WHERE id(uEmisor) = $idUsuarioEmisor
            MATCH (evento:Evento) WHERE id(evento) = $idEvento
            WITH u, uEmisor, evento
            CREATE (u)<-[:NOTIFICACION {
                tipo: 'INVITACION_EVENTO',
                mensaje: uEmisor.nombreUsuario + ' te ha invitado al evento: ' + evento.nombre,
                fecha: $fecha,
                leida: false,
                entidadId: id(evento)
            }]-(evento)
            """)
    void crearNotificacionInvitacionEvento(Long idUsuarioReceptor, Long idUsuarioEmisor, Long idEvento,
            LocalDateTime fecha);

    @Query("""
            MATCH (u:Usuario) WHERE id(u) = $idUsuarioReceptor
            MATCH (uEmisor:Usuario) WHERE id(uEmisor) = $idUsuarioEmisor
            MATCH (comunidad:Comunidad) WHERE id(comunidad) = $idComunidad
            WITH u, uEmisor, comunidad
            CREATE (u)<-[:NOTIFICACION {
                tipo: 'INVITACION_COMUNIDAD',
                mensaje: uEmisor.nombreUsuario + ' te ha invitado a la comunidad: ' + comunidad.nombre,
                fecha: $fecha,
                leida: false,
                entidadId: id(comunidad)
            }]-(comunidad)
            """)
    void crearNotificacionInvitacionComunidad(Long idUsuarioReceptor, Long idUsuarioEmisor, Long idComunidad,
            LocalDateTime fecha);

    @Query("""
                MATCH (u:Usuario)-[n:NOTIFICACION]-(e:Usuario)
                WHERE id(u) = $idReceptor AND id(e) = $idEmisor AND n.tipo = 'SOLICITUD_ENTRANTE'
                DELETE n
            """)
    void eliminarNotificacion(Long idReceptor, Long idEmisor, String tipo);

    @Query("MATCH ()-[n:NOTIFICACION]->() " +
            "WHERE id(n) = $idNotificacion " +
            "SET n.leida = true")
    void setearNotifacionLeida(Long idNotificacion);

    @Query("MATCH ()-[n:NOTIFICACION]->() " +
            "WHERE id(n) = $idNotificacion " +
            "DELETE n")
    void deleteById(Long idNotificacion);

    @Query("MATCH (u:Usuario)-[n:NOTIFICACION]-() "+
            "WHERE id(u) = $idUsuario "+
            "AND n.leida = false "+
            "SET n.leida = true")
    void marcarLeidasTodasLasNotificaciones(Long idUsuario);

        @Query("MATCH (u:Usuario)-[n:NOTIFICACION]-() "+
            "WHERE id(u) = $idUsuario "+
            "DELETE n")
    void eliminarTodasLasNotificaciones(Long idUsuario);

@Query("MATCH (e:Evento) "+ 
       "WHERE e.fechaHora < datetime() "+
    
    // Eliminar notificaciones de eventos pasados
    "MATCH (u:Usuario)-[n:NOTIFICACION]-(e) "+ 
    "WHERE u.borrarNotificacionesEventosPasados = true "+
    "DELETE n "+
    
    // Eliminar invitaciones a eventos pasados
    "WITH e "+
    "MATCH (u1:Usuario)-[inv:INVITACION_EVENTO]-(u2:Usuario) "+
    "WHERE inv.idEvento = id(e) "+
    "DELETE inv")
void eliminarNotificacionesEventosPasados();

}
