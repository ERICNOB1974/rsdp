package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificacionRepository extends Neo4jRepository<Notificacion, Long> {

    @Query("""
                MATCH (u:Usuario)-[n:NOTIFICACION]->(entidad)
                WHERE id(u) = $idUsuario
                RETURN n.tipo AS tipo,
                       n.mensaje AS mensaje,
                       n.fecha AS fecha,
                       n.extra AS extra
                ORDER BY n.fecha DESC
            """)
    List<Notificacion> findNotificacionesByUsuario(Long idUsuario);

    @Query("""
                MATCH (u:Usuario) WHERE id(u)=$idUsuario
                MATCH (entidad) WHERE id(entidad)=$idEntidad
                WITH u, entidad,
                CASE
                    WHEN entidad:Evento THEN 'Inscripción al evento: ' + entidad.nombre
                    WHEN entidad:Usuario THEN
                        CASE
                            WHEN $tipo = 'SOLICITUD_ENTRANTE' THEN entidad.nombreUsuario + ' te ha enviado una solicitud de amistad'
                            WHEN $tipo = 'SOLICITUD_ACEPTADA' THEN entidad.nombreUsuario + ' ha aceptado tu solicitud de amistad'
                            ELSE 'Notificación de usuario'
                        END
                    WHEN entidad:Comunidad THEN 'Te has unido a la comunidad: ' + entidad.nombre
                    ELSE 'Notificación'
                END AS mensaje
                CREATE (u)<-[:NOTIFICACION {tipo: $tipo, mensaje: mensaje, fecha: $fecha, entidadId: id(entidad)}]-(entidad)
            """)
    void crearNotificacion(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha);

    @Query("""
                MATCH (u:Usuario)-[n:NOTIFICACION]-(e:Usuario)
                WHERE id(u) = $idReceptor AND id(e) = $idEmisor AND n.tipo = 'SOLICITUD_ENTRANTE'
                DELETE n
            """)
    void eliminarNotificacion(Long idReceptor, Long idEmisor, String tipo);
}
