package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;

public interface ScoreAmigoRepository extends Neo4jRepository<ScoreAmigo, Long> {

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
    "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
    "WITH amigosDeAmigos, COUNT(amigo) AS amigosEnComun " +
    "RETURN amigosDeAmigos.id AS usuarioId, amigosDeAmigos.nombreUsuario AS nombreUsuario, amigosDeAmigos.nombreReal AS nombreReal, " +
    "amigosDeAmigos.fechaNacimiento AS fechaNacimiento, amigosDeAmigos.fechaDeCreacion AS fechaDeCreacion, " +
    "amigosDeAmigos.correoElectronico AS correoElectronico, amigosDeAmigos.contrasena AS contrasena, " +
    "amigosDeAmigos.descripcion AS descripcion, amigosDeAmigos.latitud AS latitud, amigosDeAmigos.longitud AS longitud, " +
    "(amigosEnComun * 5) AS score " +
    "ORDER BY score DESC")
List<ScoreAmigo> sugerenciaDeAmigosBasadaEnAmigos(String nombreUsuario);

@Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento) " +
       "MATCH (participante:Usuario)-[:PARTICIPA_EN]->(evento) " +
       "WHERE participante <> u " +
       "WITH participante, COUNT(evento) AS eventosCompartidos " +
       "WHERE eventosCompartidos >= 2 " +
       "RETURN participante.id AS usuarioId, participante.nombreUsuario AS nombreUsuario, participante.nombreReal AS nombreReal, " +
       "participante.fechaNacimiento AS fechaNacimiento, participante.fechaDeCreacion AS fechaDeCreacion, " +
       "participante.correoElectronico AS correoElectronico, participante.contrasena AS contrasena, " +
       "participante.descripcion AS descripcion, participante.latitud AS latitud, participante.longitud AS longitud, " +
       "(eventosCompartidos * 3) AS score " +
       "ORDER BY score DESC")
List<ScoreAmigo> sugerenciasDeAmigosBasadosEnEventos(String nombreUsuario);

@Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad) " +
       "MATCH (participante:Usuario)-[:MIEMBRO]->(comunidad) " +
       "WHERE participante <> u " +
       "WITH u, participante, COUNT(comunidad) AS comunidadesEnComun " +
       "WHERE NOT (u)-[:ES_AMIGO_DE]-(participante) AND comunidadesEnComun >= 2 " +
       "RETURN participante.id AS usuarioId, participante.nombreUsuario AS nombreUsuario, participante.nombreReal AS nombreReal, " +
       "participante.fechaNacimiento AS fechaNacimiento, participante.fechaDeCreacion AS fechaDeCreacion, " +
       "participante.correoElectronico AS correoElectronico, participante.contrasena AS contrasena, " +
       "participante.descripcion AS descripcion, participante.latitud AS latitud, participante.longitud AS longitud, " +
       "(comunidadesEnComun * 2) AS score " +
       "ORDER BY score DESC, participante.nombreUsuario ASC")
List<ScoreAmigo> sugerenciasDeAmigosBasadosEnComunidades(String nombreUsuario);

}