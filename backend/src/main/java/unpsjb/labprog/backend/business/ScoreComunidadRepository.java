package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface ScoreComunidadRepository extends Neo4jRepository<ScoreComunidad, Long> {

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
        "MATCH (amigo)-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
        "WHERE NOT (u)-[:MIEMBRO | CREADO_POR | ADMINISTRADO_POR]->(comunidad) " +
        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros " +
        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
        "WITH u, comunidad, etiquetasEnComun, " +
        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
        "WITH comunidad, etiquetasEnComun, point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
        "WITH comunidad, etiquetasEnComun, distancia, " +
        "(etiquetasEnComun / (distancia + 1500000)) AS score " +
        "RETURN comunidad.id AS id, comunidad.nombre AS nombre, comunidad.fechaDeCreacion AS fechaDeCreacion, " +
        "comunidad.descripcion AS descripcion, comunidad.cantidadMaximaMiembros AS cantidadMaximaMiembros, " +
        "comunidad.esPrivada AS esPrivada, comunidad.latitud AS latitud, comunidad.longitud AS longitud, score AS score " +
        "ORDER BY score DESC " +
        "LIMIT 3")
 List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnAmigos(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), " +
            "(comunidadRecomendada:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
            "WHERE NOT (u)-[:MIEMBRO|:CREADO_POR|:ADMINISTRADO_POR]->(comunidadRecomendada) " +
            "OPTIONAL MATCH (comunidadRecomendada)<-[:MIEMBRO]-(miembro) " +
            "WITH u, comunidadRecomendada, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros " +
            "WHERE cantidadMiembros < comunidadRecomendada.cantidadMaximaMiembros " +
            "WITH u, comunidadRecomendada, etiquetasEnComun, " +
            "point({latitude: comunidadRecomendada.latitud, longitude: comunidadRecomendada.longitud}) AS ubicacionComunidad, " +
            "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
            "WITH comunidadRecomendada, etiquetasEnComun, point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
            "WITH comunidadRecomendada, etiquetasEnComun, distancia, " +
            "(etiquetasEnComun/(distancia+1500000)) AS score " +
            "RETURN comunidadRecomendada.id AS id, comunidadRecomendada.nombre AS nombre, comunidadRecomendada.fechaDeCreacion AS fechaDeCreacion, " +
            "comunidadRecomendada.descripcion AS descripcion, comunidadRecomendada.cantidadMaximaMiembros AS cantidadMaximaMiembros, " +
            "comunidadRecomendada.esPrivada AS esPrivada, comunidadRecomendada.latitud AS latitud, comunidadRecomendada.longitud AS longitud, score AS score " +
            "ORDER BY score DESC " +
            "LIMIT 3")
    List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnComunidades(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), " +
            "(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
            "WHERE NOT (u)-[:MIEMBRO | CREADO_POR | ADMINISTRADO_POR]->(comunidad) " +
            "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
            "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros " +
            "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
            "WITH u, comunidad, etiquetasEnComun, " +
            "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
            "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
            "WITH comunidad, etiquetasEnComun, point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
            "WITH comunidad, etiquetasEnComun, distancia, " +
            "(etiquetasEnComun/(distancia+1500000)) AS score " +
            "RETURN comunidad.id AS id, comunidad.nombre AS nombre, comunidad.fechaDeCreacion AS fechaDeCreacion, " +
            "comunidad.descripcion AS descripcion, comunidad.cantidadMaximaMiembros AS cantidadMaximaMiembros, " +
            "comunidad.esPrivada AS esPrivada, comunidad.latitud AS latitud, comunidad.longitud AS longitud, score AS score " +
            "ORDER BY score DESC " +
            "LIMIT 3")
    List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnEventos(String nombreUsuario);
}
