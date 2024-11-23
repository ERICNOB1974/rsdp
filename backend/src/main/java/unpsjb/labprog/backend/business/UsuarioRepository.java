package unpsjb.labprog.backend.business;

import java.util.List;
import java.time.LocalDateTime;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Usuario;

@Repository
public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigos)"
                        + "RETURN amigos")
        List<Usuario> amigos(String nombreUsuario);

        @Query("""
                            MATCH (u:Usuario {nombreUsuario: $nombreUsuario})
                            OPTIONAL MATCH (solicitante:Usuario)-[r:SOLICITUD_DE_AMISTAD]->(u)
                            WHERE solicitante IS NOT NULL
                            RETURN solicitante AS usuario
                        """)
        List<Usuario> solicitudesDeAmistad(String nombreUsuario);

        @Query("""
                            MATCH (u:Usuario {nombreUsuario: $nombreUsuario})
                            OPTIONAL MATCH (u)-[r:SOLICITUD_DE_AMISTAD]->(solicitado:Usuario)
                            WHERE solicitado IS NOT NULL
                            RETURN solicitado AS usuario
                        """)
        List<Usuario> solicitudesDeAmistadEnviadas(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo)-[:ES_AMIGO_DE]->(amigosDeAmigos) "
                        + "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) "
                        + "RETURN DISTINCT amigosDeAmigos")
        List<Usuario> amigosDeAmigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(amigosDeAmigos) "
                        + "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) "
                        + "WITH amigosDeAmigos, COUNT(amigo) AS amigosEnComun "
                        + "RETURN amigosDeAmigos "
                        + "ORDER BY amigosEnComun DESC "
                        + "LIMIT 3")
        List<Usuario> sugerenciaDeAmigosBasadaEnAmigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento) "
                        + "MATCH (participante:Usuario)-[:PARTICIPA_EN]->(evento) "
                        + "WHERE participante <> u "
                        + "WITH participante, COUNT(evento) AS eventosCompartidos "
                        + "WHERE eventosCompartidos >= 2 "
                        + "RETURN participante "
                        + "ORDER BY eventosCompartidos DESC "
                        + "LIMIT 3")
        List<Usuario> sugerenciasDeAmigosBasadosEnEventos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad)"
                        + " MATCH (participante:Usuario)-[:MIEMBRO]->(comunidad) "
                        + " WHERE participante <> u"
                        + " WITH u, participante, COUNT(comunidad) AS comunidadesEnComun "
                        + " WHERE  (NOT (u)-[:ES_AMIGO_DE]-(participante) )"
                        + " AND  (comunidadesEnComun >= 2)"
                        + " RETURN participante "
                        + " ORDER BY comunidadesEnComun DESC, participante.nombreUsuario ASC"
                        + " LIMIT 3")
        List<Usuario> sugerenciasDeAmigosBasadosEnComunidades(String nombreUsuario);

        @Query("MATCH (a:Usuario)-[:ES_AMIGO_DE]-(b:Usuario) "
                        + "WHERE id(a) = $idEmisor AND id(b) = $idReceptor "
                        + "RETURN COUNT(a) > 0")
        boolean sonAmigos(Long idEmisor, Long idReceptor);

        @Query("MATCH (a:Usuario)-[r:SOLICITUD_DE_AMISTAD]->(b:Usuario) "
                        + "WHERE id(a) = $idEmisor AND id(b) = $idReceptor "
                        + "RETURN COUNT(r) > 0")
        boolean solicitudAmistadExiste(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario)-[:MIEMBRO]-(c:Comunidad) "
                        + "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "
                        + "RETURN COUNT(c) > 0")
        boolean esMiembro(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)-[:SOLICITUD_DE_INGRESO]->(c:Comunidad) "
                        + "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "
                        + "RETURN COUNT(c) > 0")
        boolean solicitudIngresoExiste(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)<-[r:CREADA_POR]-(c:Comunidad) "
                        + "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "
                        + "RETURN COUNT(c) > 0")
        boolean esCreador(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)<-[r:CREADA_POR]-(c:Comunidad) "
                        + "WHERE id(c) = $idComunidad "
                        + "RETURN u")
        Usuario creadorComunidad(Long idComunidad);

        @Query("MATCH (u:Usuario)<-[r:CREADO_POR]-(e:Evento) "
                        + "WHERE id(e) = $idEvento "
                        + "RETURN u")
        Usuario creadorEvento(Long idEvento);

        @Query("MATCH (u:Usuario)-[r:ADMINISTRADA_POR]-(c:Comunidad) "
                        + "WHERE id(u) = $idMiembro AND id(c) = $idComunidad "
                        + "RETURN COUNT(r) > 0")
        boolean esAdministrador(Long idMiembro, Long idComunidad);

        @Query("MATCH (u:Usuario), (c:Comunidad) WHERE id(u) = $idUsuario AND id(c) = $idComunidad "
                        + "CREATE (u)-[:SOLICITUD_DE_INGRESO {estado: $estado, fechaEnvio: $fechaEnvio}]->(c)")
        void enviarSolicitudIngreso(Long idUsuario, Long idComunidad, String estado, LocalDateTime fechaEnvio);

        @Query("MATCH (u:Usuario), (u2:Usuario) WHERE id(u) = $idEmisor AND id(u2) = $idReceptor "
                        + "CREATE (u)-[:SOLICITUD_DE_AMISTAD {estado: $estado, fechaEnvio: $fechaEnvio}]->(u2)")
        void enviarSolicitudAmistad(Long idEmisor, Long idReceptor, String estado, LocalDateTime fechaEnvio);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_INGRESO]->(c:Comunidad) "
                        + "WHERE id(c) = $idComunidad "
                        + "RETURN u "
                        + "ORDER BY r.fechaSolicitud DESC, u.nombreUsuario ASC")
        List<Usuario> solicititudesPendientes(Long idComunidad);

        @Query("MATCH (u:Usuario), (u2:Usuario) WHERE id(u) = $idEmisor AND id(u2) = $idReceptor "
                        + "CREATE (u)-[:ES_AMIGO_DE {fechaAmigos: $now}]->(u2) "
                        + "CREATE (u)<-[:ES_AMIGO_DE {fechaAmigos: $now}]-(u2)")
        void aceptarSolicitudAmistad(Long idEmisor, Long idReceptor, LocalDateTime now);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_AMISTAD]-(u2:Usuario) "
                        + "Where id(u) = $idEmisor AND id(u2) = $idReceptor "
                        + "DELETE r")
        void rechazarSolicitudAmistad(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario)-[r:ES_AMIGO_DE]-(u2:Usuario) "
                        + "Where id(u) = $idEmisor AND id(u2) = $idReceptor "
                        + "DELETE r")
        void eliminarAmigo(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario) WHERE u.nombreUsuario = $nombre RETURN u")
        Optional<Usuario> findByNombreUsuario(String nombre);

        @Query("MATCH (u:Usuario)-[r:PARTICIPA_EN]-(ev:Evento) "
                        + "WHERE id(ev) = $eventId "
                        + "RETURN DISTINCT u")
        List<Usuario> inscriptosEvento(Long eventId);

        @Query("MATCH (u:Usuario)-[r:MIEMBRO|CREADA_POR|ADMINISTRADA_POR]-(c:Comunidad) " +
                        "WHERE id(c) = $idComunidad " +
                        "RETURN u, r " +
                        "ORDER BY CASE " +
                        "    WHEN type(r) = 'CREADA_POR' THEN 1 " +
                        "    WHEN type(r) = 'ADMINISTRADA_POR' THEN 2 " +
                        "    WHEN type(r) = 'MIEMBRO' THEN 3 " +
                        "END")
        List<Usuario> miembros(Long idComunidad);

        @Query("MATCH (u:Usuario) WHERE id(u)=$idUsuario "
                        + "MATCH (e:Evento) WHERE id(e)=$idEvento "
                        + " CREATE (u)-[:PARTICIPA_EN]->(e)")
        void inscribirse(Long idEvento, Long idUsuario);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_AMISTAD]-(u2:Usuario) "
                        + "Where id(u) = $idEmisor AND id(u2) = $idReceptor "
                        + "AND r.estado='pendiente' "
                        + "return COUNT (r)>0")
        boolean haySolicitud(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario) WHERE u.correoElectronico = $correoElectronico RETURN u")
        Optional<Usuario> findByCorreoElectronico(String correoElectronico);

        @Query("MATCH (u:Usuario) WHERE u.correoElectronico = $correoElectronico RETURN COUNT(u) > 0")
        boolean existeMail(String correoElectronico);

        @Query("MATCH (u:Usuario) WHERE u.nombreUsuario = $nombreUsuario RETURN COUNT(u) > 0")
        boolean existeNombreUsuario(String nombreUsuario);

        @Query("MATCH (u:Usuario) WHERE u.nombreUsuario = $nombreUsuarioIngresado AND u.nombreUsuario <> $nombreUsuarioActual RETURN COUNT(u) > 0")
        boolean existeNombreUsuarioMenosElActual(String nombreUsuarioIngresado, String nombreUsuarioActual);

        @Query("MATCH (u:Usuario) WHERE id(u)=$idUsuario "
                        + "MATCH (e:Evento) WHERE id(e)=$idEvento "
                        + "CREATE (u)-[:NOTIFICACION {fechaInscripcion: $fechaInscripcion}]-(e)")
        void notificacionInscripcion(Long idUsuario, Long idEvento, LocalDateTime fechaIngreso);

        @Query("MATCH (u:Usuario)<-[:ADMINISTRADA_POR]-(c:Comunidad) "
                        + "WHERE id(c) = $idComunidad "
                        + "RETURN u")
        List<Usuario> administradores(Long idComunidad);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo)-[:ES_AMIGO_DE]->(usuario) "
                        + "WHERE usuario <> u AND NOT (u)-[:ES_AMIGO_DE]-(usuario) "
                        + "WITH usuario, COUNT(amigo) AS amigosEnComun "
                        + "RETURN usuario, (amigosEnComun * 5) AS score, 'tenes '+amigosEnComun+' amigo/s participando' AS motivo "
                        + "ORDER BY score DESC")
        List<ScoreAmigo> sugerenciaDeAmigosBasadaEnAmigos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento) "
                        + "MATCH (usuario:Usuario)-[:PARTICIPA_EN]->(evento) "
                        + "WHERE usuario <> u "
                        + "AND NOT (u)-[:ES_AMIGO_DE]-(usuario) "
                        + // Asegura que no sean amigos
                        "WITH usuario, COUNT(evento) AS eventosCompartidos "
                        + "WHERE eventosCompartidos >= 1 " // volver a poner 2
                        + "RETURN usuario, (eventosCompartidos * 4) AS score, 'tenes '+eventosCompartidos+' evento/s compartido/s' AS motivo "
                        + "ORDER BY score DESC, usuario.nombreUsuario ASC")
        List<ScoreAmigo> sugerenciasDeAmigosBasadosEnEventos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad) "
                        + "MATCH (usuario:Usuario)-[:MIEMBRO]->(comunidad) "
                        + "WHERE usuario <> u "
                        + "WITH u, usuario, COUNT(comunidad) AS comunidadesEnComun "
                        + "WHERE NOT (u)-[:ES_AMIGO_DE]-(usuario) AND comunidadesEnComun >= 1 " // volver a poner 2
                        + "RETURN usuario, (comunidadesEnComun * 3) AS score, 'participas en '+comunidadesEnComun+' comunidade/s en comun' AS motivo "
                        + "ORDER BY score DESC, usuario.nombreUsuario ASC")
        List<ScoreAmigo> sugerenciasDeAmigosBasadosEnComunidades2(String nombreUsuario);

        @Query("MATCH (u:Usuario)-[n:COMENTA]->() WHERE id(n) = $id RETURN u AS usuario")
        Usuario findUsuarioById(@Param("id") Long id);

        @Query("MATCH (u:Usuario)-[:POSTEO]->(p:Publicacion) WHERE id(p) = $idPublicacion RETURN u AS usuario")
        Usuario publicadoPor(@Param("idPublicacion") Long idPublicacion);

        @Query("MATCH (emisor:Usuario), (receptor:Usuario) " +
                        "WHERE id(emisor) = $idUsuarioEmisor AND id(receptor) = $idUsuarioReceptor " +
                        "MERGE (emisor)-[inv:INVITACION_EVENTO {idEvento: $idEvento}]->(receptor) ")
        void enviarInvitacionEvento(Long idUsuarioEmisor, Long idUsuarioReceptor, Long idEvento);

        @Query("MATCH (emisor:Usuario), (receptor:Usuario) " +
                        "WHERE id(emisor) = $idUsuarioEmisor AND id(receptor) = $idUsuarioReceptor " +
                        "MERGE (emisor)-[inv:INVITACION_COMUNIDAD {idComunidad: $idComunidad}]->(receptor) ")
        void enviarInvitacionComunidad(Long idUsuarioEmisor, Long idUsuarioReceptor, Long idComunidad);

        @Query("MATCH (u:Usuario)-[:ES_AMIGO_DE]->(amigo:Usuario)-[:PARTICIPA_EN]->(evento:Evento) " +
                        "WHERE id(u) = $idUsuario AND id(evento) = $idEvento " +
                        "RETURN amigo")
        List<Usuario> todosLosAmigosDeUnUsuarioPertenecientesAUnEvento(Long idUsuario, Long idEvento);

        @Query("MATCH (u:Usuario)-[:ES_AMIGO_DE]->(amigo:Usuario), " +
                        "(amigo)-[rel]->(comunidad:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(comunidad) = $idComunidad " +
                        "AND type(rel) IN ['MIEMBRO', 'ADMINISTRADA_POR', 'CREADA_POR'] " +
                        "RETURN amigo")
        List<Usuario> todosLosAmigosDeUnUsuarioPertenecientesAUnaComunidad(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario), (ev:Evento) " +
                        "WHERE id(u) = $idUsuario AND id(ev) = $idEvento " +
                        "WITH u, ev " +
                        "MATCH (u)-[:ES_AMIGO_DE]->(amigo:Usuario) " +
                        "WHERE NOT EXISTS { MATCH (amigo)-[:PARTICIPA_EN]->(ev) } " +
                        "AND NOT EXISTS { MATCH (ev)-[:CREADO_POR]->(amigo) } " +
                        "RETURN amigo")
        List<Usuario> todosLosAmigosDeUnUsuarioNoPertenecientesAUnEvento(Long idUsuario, Long idEvento);

        @Query("MATCH (u:Usuario), (com:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(com) = $idComunidad " +
                        "WITH u, com " +
                        "MATCH (u)-[:ES_AMIGO_DE]->(amigo:Usuario) " +
                        "WHERE NOT EXISTS { MATCH (amigo)-[:MIEMBRO]->(com) } " +
                        "AND NOT EXISTS { MATCH (com)-[:ADMINISTRADA_POR|CREADA_POR]->(amigo) } " +
                        "RETURN amigo")
        List<Usuario> todosLosAmigosDeUnUsuarioNoPertenecientesAUnaComunidad(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)-[:ES_AMIGO_DE]->(amigo:Usuario) " +
                        "MATCH (u)-[inv:INVITACION_EVENTO]->(amigo) " +
                        "WHERE id(u) = $idUsuario AND inv.idEvento = $idEvento " +
                        "RETURN amigo")
        List<Usuario> todosLosAmigosDeUnUsuarioYaInvitadosAUnEventoPorElUsuario(Long idUsuario, Long idEvento);

        @Query("MATCH (u:Usuario)-[:ES_AMIGO_DE]->(amigo:Usuario) " +
                        "MATCH (u)-[inv:INVITACION_COMUNIDAD]->(amigo) " +
                        "WHERE id(u) = $idUsuario AND inv.idComunidad = $idComunidad " +
                        "RETURN amigo")
        List<Usuario> todosLosAmigosDeUnUsuarioYaInvitadosAUnaComunidadPorElUsuario(Long idUsuario, Long idComunidad);

        @Query("""
                        MATCH (u:Usuario {nombreUsuario: $nombreUsuario}) // Usuario que hace la consulta
                        MATCH (otros:Usuario)
                        WHERE otros <> u // Evita incluir al usuario que hace la consulta
                        AND (toUpper(otros.nombreUsuario) CONTAINS toUpper($term)
                             OR toUpper(otros.nombreReal) CONTAINS toUpper($term)) // Filtra por término

                        // Cuenta amigos en común entre 'u' y 'otros'
                        OPTIONAL MATCH (u)-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(otros)

                        WITH otros, COUNT(amigo) AS amigosEnComun

                        // Devuelve solo aquellos usuarios que coinciden con el término
                        RETURN otros
                        ORDER BY amigosEnComun DESC
                        """)
        List<Usuario> buscarUsuarios(String nombreUsuario, String term);

        @Query("""
                         MATCH (evento:Evento)-[:EVENTO_INTERNO]->(comunidad:Comunidad)
                         WHERE id(comunidad) = $comunidadId AND id(evento) = $eventoId
                         MATCH (evento)-[:CREADO_POR]->(usuario:Usuario)
                         RETURN usuario
                        """)
        Usuario buscarCreadorDeUnEventoInterno(@Param("comunidadId") Long comunidadId,
                        @Param("eventoId") Long eventoId);

        @Query("""
                                               MATCH (p:Publicacion)
                        WHERE id(p) = 10908
                        MATCH (u:Usuario)-[:LIKE]-(p)
                        RETURN u
                        """)
        List<Usuario> likesPublicacion(@Param("publicacionId") Long publicacionId);

}
