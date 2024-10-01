package unpsjb.labprog.backend.business;

import java.util.List;
import java.time.LocalDateTime;

import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

@Repository
public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {

        @Query("MATCH (u:Usuario {nombreUsuario: })-[:ES_AMIGO_DE]-(amigos)" +
                        "RETURN amigos")
        List<Usuario> amigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: })-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(amigosDeAmigos) "
                        +
                        "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
                        "RETURN DISTINCT amigosDeAmigos")
        List<Usuario> amigosDeAmigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: })-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(amigosDeAmigos) "
                        +
                        "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
                        "WITH amigosDeAmigos, COUNT(amigo) AS amigosEnComun " +
                        "RETURN amigosDeAmigos " +
                        "ORDER BY amigosEnComun DESC " +
                        "LIMIT 3")
        List<Usuario> sugerenciaDeAmigosBasadaEnAmigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: })-[:PARTICIPA_EN]->(evento:Evento) " +
                        "MATCH (participante:Usuario)-[:PARTICIPA_EN]->(evento) " +
                        "WHERE participante <> u " +
                        "WITH participante, COUNT(evento) AS eventosCompartidos " +
                        "WHERE eventosCompartidos >= 2 " +
                        "RETURN participante " +
                        "ORDER BY eventosCompartidos DESC " +
                        "LIMIT 3")
        List<Usuario> sugerenciasDeAmigosBasadosEnEventos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: })-[:MIEMBRO]->(comunidad:Comunidad)" +
                        " MATCH (participante:Usuario)-[:MIEMBRO]->(comunidad) " +
                        " WHERE participante <> u" +
                        " WITH u, participante, COUNT(comunidad) AS comunidadesEnComun " +
                        " WHERE  (NOT (u)-[:ES_AMIGO_DE]-(participante) )" +
                        " AND  (comunidadesEnComun >= 2)" +
                        " RETURN participante " +
                        " ORDER BY comunidadesEnComun DESC, participante.nombreUsuario ASC" +
                        " LIMIT 3")
        List<Usuario> sugerenciasDeAmigosBasadosEnComunidades(String nombreUsuario);

        @Query("MATCH (a:Usuario)-[:ES_AMIGO_DE]-(b:Usuario) " +
                "WHERE id(a) = $idEmisor AND id(b) = $idReceptor "+
                "RETURN COUNT(a) > 0")
        boolean sonAmigos(Long idEmisor, Long idReceptor);

        @Query("MATCH (a:Usuario)-[r:ENVIA_SOLICITUD]->(b:Usuario) "+
                "WHERE id(a) = $idEmisor AND id(b) = $idReceptor "+
                "RETURN COUNT(r) > 0")
        boolean solicitudAmistadExiste(Long idEmisor, Long idReceptor);

        @Query("MATCH (u:Usuario)-[:MIEMBRO]->(c:Comunidad) "+
                "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "+
                "RETURN COUNT(c) > 0")
        boolean esMiembro(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)-[:SOLICITUD_DE_INGRESO]->(c:Comunidad) "+
                "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "+
                "RETURN COUNT(c) > 0")
        boolean solicitudIngresoExiste(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)<-[r:CREADA_POR]-(c:Comunidad) "+
                "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "+
                "RETURN COUNT(c) > 0")
        boolean esCreador(Long idUsuario, Long idComunidad);

            @Query("MATCH (u:Usuario)<-[:ADMINISTRADA_POR]-(c:Comunidad) "+
                "WHERE id(u) = $idMiembro AND id(c) = $idComunidad "+
                "RETURN COUNT(c) > 0")
        boolean esAdministrador(Long idMiembro, Long idComunidad);

        @Query("MATCH (u:Usuario), (c:Comunidad) WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                "CREATE (u)-[:SOLICITUD_DE_INGRESO {estado: $estado, fechaEnvio: $fechaEnvio}]->(c)")
        void enviarSolicitudIngreso(Long idUsuario, Long idComunidad, String estado, LocalDateTime fechaEnvio);

        @Query("MATCH (u:Usuario), (u2:Usuario) WHERE id(u) = $idEmisor AND id(u2) = $idReceptor " +
        "CREATE (u)-[:SOLICITUD_DE_AMISTADO {estado: $estado, fechaEnvio: $fechaEnvio}]->(u2)")
        void enviarSolicitudAmistad(Long idEmisor, Long idReceptor, String estado, LocalDateTime now);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_INGRESO]->(c:Comunidad) " +
        "WHERE id(c) = $idComunidad " +
        "RETURN u "+     
        "ORDER BY r.fechaSolicitud ASC, u.nombreUsuario ASC") 
        List<Usuario> solicititudesPendientes(Long idComunidad);

        @Query("MATCH (u:Usuario), (u2:Usuario) WHERE id(u) = $idEmisor AND id(u2) = $idReceptor " +
        "CREATE (u)-[:ES_AMIGO_DE {fechaAmigos: $now}]->(u2) "+
        "CREATE (u)<-[:ES_AMIGO_DE {fechaAmigos: $now}]-(u2)")
        void aceptarSolicitudAmistad(Long idEmisor, Long idReceptor, LocalDateTime now);

        @Query("MATCH (u:Usuario)-[r:ENVIA_SOLICITUD]-(u2:Usuario) "+
                "Where id(u) = $idEmisor AND id(u2) = $idReceptor "+
                "DELETE r" )
        void rechazarSolicitudAmistad(Long idEmisor, Long idReceptor);
  
        @Query("MATCH (u:Usuario) WHERE u.nombreUsuario = $nombre RETURN u")
        Optional<Usuario> findByNombreUsuario(String nombre);

        @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]->(ev:Evento) " +
                        "WHERE id(ev) = $eventId " +
                        "RETURN u")
        List<Usuario> inscriptosEvento(Long eventId);
}
