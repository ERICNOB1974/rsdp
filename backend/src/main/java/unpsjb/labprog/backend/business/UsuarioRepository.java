package unpsjb.labprog.backend.business;

import java.util.List;
import java.time.LocalDateTime;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Usuario;

@Repository
public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigos)" +
                        "RETURN amigos")
        List<Usuario> amigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo)-[:ES_AMIGO_DE]->(amigosDeAmigos) "
                        +
                        "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
                        "RETURN DISTINCT amigosDeAmigos")
        List<Usuario> amigosDeAmigos(String nombreUsuario);

        @Query("""
                            MATCH (u:Usuario {nombreUsuario: $nombreUsuario})
                            OPTIONAL MATCH (solicitante:Usuario)-[r:SOLICITUD_DE_AMISTAD]->(u)
                            WHERE solicitante IS NOT NULL
                            RETURN solicitante AS usuario
                            UNION
                            MATCH (u:Usuario {nombreUsuario: $nombreUsuario})
                            OPTIONAL MATCH (u)-[r2:SOLICITUD_DE_AMISTAD]->(destinatario:Usuario)
                            WHERE destinatario IS NOT NULL
                            RETURN destinatario AS usuario
                            ORDER BY usuario.nombreUsuario ASC
                        """)
        List<Usuario> solicitudesDeAmistad(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo)-[:ES_AMIGO_DE]->(usuario) "
                        +
                        "WHERE usuario <> u AND NOT (u)-[:ES_AMIGO_DE]-(usuario) " +
                        "RETURN DISTINCT usuario")
        List<Usuario> usuario(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(usuario) "
                        +
                        "WHERE usuario <> u AND NOT (u)-[:ES_AMIGO_DE]-(usuario) " +
                        "WITH usuario, COUNT(amigo) AS amigosEnComun " +
                        "RETURN usuario " +
                        "ORDER BY amigosEnComun DESC " +
                        "LIMIT 3")
        List<Usuario> sugerenciaDeAmigosBasadaEnAmigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento) " +
                        "MATCH (usuario:Usuario)-[:PARTICIPA_EN]->(evento) " +
                        "WHERE usuario <> u " +
                        "WITH usuario, COUNT(evento) AS eventosCompartidos " +
                        "WHERE eventosCompartidos >= 2 " +
                        "RETURN usuario " +
                        "ORDER BY eventosCompartidos DESC " +
                        "LIMIT 3")
        List<Usuario> sugerenciasDeAmigosBasadosEnEventos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad)" +
                        " MATCH (usuario:Usuario)-[:MIEMBRO]->(comunidad) " +
                        " WHERE usuario <> u" +
                        " WITH u, usuario, COUNT(comunidad) AS comunidadesEnComun " +
                        " WHERE  (NOT (u)-[:ES_AMIGO_DE]-(usuario) )" +
                        " AND  (comunidadesEnComun >= 2)" +
                        " RETURN usuario " +
                        " ORDER BY comunidadesEnComun DESC, usuario.nombreUsuario ASC" +
                        " LIMIT 3")
        List<Usuario> sugerenciasDeAmigosBasadosEnComunidades(String nombreUsuario);

        @Query("MATCH (a:Usuario)-[:ES_AMIGO_DE]-(b:Usuario) " +
                        "WHERE id(a) = $idEmisor AND id(b) = $idReceptor " +
                        "RETURN COUNT(a) > 0")
        boolean sonAmigos(Long idEmisor, Long idReceptor);

        @Query("MATCH (a:Usuario)-[r:SOLICITUD_DE_AMISTAD]->(b:Usuario) " +
                        "WHERE id(a) = $idEmisor AND id(b) = $idReceptor " +
                        "RETURN COUNT(r) > 0")
        boolean solicitudAmistadExiste(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario)-[:MIEMBRO]->(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "RETURN COUNT(c) > 0")
        boolean esMiembro(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)-[:SOLICITUD_DE_INGRESO]->(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "RETURN COUNT(c) > 0")
        boolean solicitudIngresoExiste(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)<-[r:CREADA_POR]-(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "RETURN COUNT(c) > 0")
        boolean esCreador(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)<-[:ADMINISTRADA_POR]-(c:Comunidad) " +
                        "WHERE id(u) = $idMiembro AND id(c) = $idComunidad " +
                        "RETURN COUNT(c) > 0")
        boolean esAdministrador(Long idMiembro, Long idComunidad);

        @Query("MATCH (u:Usuario), (c:Comunidad) WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "CREATE (u)-[:SOLICITUD_DE_INGRESO {estado: $estado, fechaEnvio: $fechaEnvio}]->(c)")
        void enviarSolicitudIngreso(Long idUsuario, Long idComunidad, String estado, LocalDateTime fechaEnvio);

        @Query("MATCH (u:Usuario), (u2:Usuario) WHERE id(u) = $idEmisor AND id(u2) = $idReceptor " +
                        "CREATE (u)-[:SOLICITUD_DE_AMISTAD {estado: $estado, fechaEnvio: $fechaEnvio}]->(u2)")
        void enviarSolicitudAmistad(Long idEmisor, Long idReceptor, String estado, LocalDateTime fechaEnvio);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_INGRESO]->(c:Comunidad) " +
                        "WHERE id(c) = $idComunidad " +
                        "RETURN u " +
                        "ORDER BY r.fechaSolicitud ASC, u.nombreUsuario ASC")
        List<Usuario> solicititudesPendientes(Long idComunidad);

        @Query("MATCH (u:Usuario), (u2:Usuario) WHERE id(u) = $idEmisor AND id(u2) = $idReceptor " +
                        "CREATE (u)-[:ES_AMIGO_DE {fechaAmigos: $now}]->(u2) " +
                        "CREATE (u)<-[:ES_AMIGO_DE {fechaAmigos: $now}]-(u2)")
        void aceptarSolicitudAmistad(Long idEmisor, Long idReceptor, LocalDateTime now);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_AMISTAD]-(u2:Usuario) " +
                        "Where id(u) = $idEmisor AND id(u2) = $idReceptor " +
                        "DELETE r")
        void rechazarSolicitudAmistad(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario) WHERE u.nombreUsuario = $nombre RETURN u")
        Optional<Usuario> findByNombreUsuario(String nombre);

        @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]->(ev:Evento) " +
                        "WHERE id(ev) = $eventId " +
                        "RETURN u")
        List<Usuario> inscriptosEvento(Long eventId);

        @Query("MATCH (u:Usuario)-[:MIEMBRO]->(c:Comunidad) " +
                        "WHERE id(c) = $idComunidad " +
                        "RETURN u")
        List<Usuario> miembros(Long idComunidad);

        @Query("MATCH (u:Usuario)<-[:ADMINISTRADA_POR]-(c:Comunidad) " +
                        "WHERE id(c) = $idComunidad " +
                        "RETURN u")
        List<Usuario> administradores(Long idComunidad);

        @Query("MATCH (u:Usuario) WHERE id(u)=$idUsuario " +
                        "MATCH (e:Evento) WHERE id(e)=$idEvento " +
                        " CREATE (u)-[:PARTICIPA_EN]->(e)")
        void inscribirse(Long idEvento, Long idUsuario);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_AMISTAD]-(u2:Usuario) " +
                        "Where id(u) = $idEmisor AND id(u2) = $idReceptor " +
                        "AND r.estado='pendiente' " +
                        "return COUNT (r)>0")
        boolean haySolicitud(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario) WHERE id(u)=$idUsuario " +
                        "MATCH (e:Evento) WHERE id(e)=$idEvento " +
                        "CREATE (u)-[:NOTIFICACION {fechaInscripcion: $fechaInscripcion}]-(e)")
        void notificacionInscripcion(Long idUsuario, Long idEvento, LocalDateTime fechaIngreso);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo)-[:ES_AMIGO_DE]->(usuario) " +
                        "WHERE usuario <> u AND NOT (u)-[:ES_AMIGO_DE]-(usuario) " +
                        "WITH usuario, COUNT(amigo) AS amigosEnComun " +
                        "RETURN usuario, (amigosEnComun * 5) AS score " +
                        "ORDER BY score DESC")
        List<ScoreAmigo> sugerenciaDeAmigosBasadaEnAmigos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento) " +
                        "MATCH (usuario:Usuario)-[:PARTICIPA_EN]->(evento) " +
                        "WHERE usuario <> u " +
                        "AND NOT (u)-[:ES_AMIGO_DE]-(usuario) " + // Asegura que no sean amigos
                        "WITH usuario, COUNT(evento) AS eventosCompartidos " +
                        "WHERE eventosCompartidos >= 2 " +
                        "RETURN usuario, (eventosCompartidos * 4) AS score " +
                        "ORDER BY score DESC, usuario.nombreUsuario ASC")
        List<ScoreAmigo> sugerenciasDeAmigosBasadosEnEventos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad) " +
                        "MATCH (usuario:Usuario)-[:MIEMBRO]->(comunidad) " +
                        "WHERE usuario <> u " +
                        "WITH u, usuario, COUNT(comunidad) AS comunidadesEnComun " +
                        "WHERE NOT (u)-[:ES_AMIGO_DE]-(usuario) AND comunidadesEnComun >= 2 " +
                        "RETURN usuario, (comunidadesEnComun * 3) AS score " +
                        "ORDER BY score DESC, usuario.nombreUsuario ASC")
        List<ScoreAmigo> sugerenciasDeAmigosBasadosEnComunidades2(String nombreUsuario);
}
