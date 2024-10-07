package unpsjb.labprog.backend.business;

import java.time.ZonedDateTime;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Evento;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ComunidadRepository extends Neo4jRepository<Comunidad, Long> {

    // Buscar comunidades por nombre
    List<Comunidad> findByNombre(String nombre);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), " +
    "(comunidadRecomendada:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
    "WHERE NOT exists((u)-[:MIEMBRO|:CREADO_POR|:ADMINISTRADO_POR]->(comunidadRecomendada)) " +
    "OPTIONAL MATCH (comunidadRecomendada)<-[:MIEMBRO]-(miembro) " +
    "WITH u, comunidadRecomendada, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros " +
    "WHERE cantidadMiembros < comunidadRecomendada.cantidadMaximaMiembros " +
    "WITH u, comunidadRecomendada, etiquetasEnComun, " +
    "point({latitude: comunidadRecomendada.latitud, longitude: comunidadRecomendada.longitud}) AS ubicacionComunidad, " +
    "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
    "WITH comunidadRecomendada, etiquetasEnComun, " +
    "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
    "WITH comunidadRecomendada, etiquetasEnComun, distancia, " +
    "(etiquetasEnComun/(distancia+1500000)) AS score " +
    "RETURN comunidadRecomendada " +
    "ORDER BY score DESC " +
    "LIMIT 3")
    List<Comunidad> sugerenciasDeComunidadesBasadasEnComunidades(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta), " +
    "(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
    "WHERE NOT (u)-[:MIEMBRO|:CREADO_POR|:ADMINISTRADO_POR]->(comunidad) " +
    "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
    "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros " +
    "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
    "WITH u, comunidad, etiquetasEnComun, " +
    "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
    "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
    "WITH comunidad, etiquetasEnComun, " +
    "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
    "WITH comunidad, etiquetasEnComun, distancia, " +
    "(etiquetasEnComun/(distancia+1500000)) AS score " +
    "RETURN comunidad " +
    "ORDER BY score DESC " +
    "LIMIT 3")
    List<Comunidad> sugerenciasDeComunidadesBasadasEnEventos(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
    "MATCH (amigo)-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
    "WHERE NOT (u)-[:MIEMBRO|:CREADO_POR|:ADMINISTRADO_POR]->(comunidad) " +
    "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
    "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros " +
    "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
    "WITH u, comunidad, etiquetasEnComun, " +
    "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
    "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
    "WITH comunidad, etiquetasEnComun, " +
    "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
    "WITH comunidad, etiquetasEnComun, distancia, " +
    "(etiquetasEnComun/(distancia+1500000)) AS score " +
    "RETURN comunidad " +
    "ORDER BY score DESC " +
    "LIMIT 3")
    List<Comunidad> sugerenciasDeComunidadesBasadasEnAmigos(String nombreUsuario);

    @Query("MATCH (c:Comunidad), (u:Usuario) WHERE id(c) = $idComunidad AND id(u) = $idUsuario " +
            "CREATE (c)<-[:MIEMBRO {fechaIngreso: $fechaIngreso}]-(u)")
    void nuevoMiembro(Long idComunidad, Long idUsuario, LocalDateTime fechaIngreso);

    @Query("MATCH (u:Usuario)-[r]-(c:Comunidad) " +
            "WHERE id(u) = $idMiembro AND id(c) = $idComunidad " +
            "RETURN r.fechaIngreso")
    ZonedDateTime obtenerFechaIngreso(Long idMiembro, Long idComunidad);

    @Query("MATCH (c:Comunidad)<-[r:MIEMBRO]-(u:Usuario) " +
            "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
            "DELETE r " +
            "CREATE (u)<-[:ADMINISTRADA_POR {fechaIngreso: $fechaIngreso, fechaOtorgacion: $fechaOtorgacion}]-(c)")
    void otorgarRolAdministrador(Long idMiembro, Long idComunidad, ZonedDateTime fechaIngreso,
            LocalDateTime fechaOtorgacion);

    @Query("MATCH (c:Comunidad)-[r:ADMINISTRADA_POR]->(u:Usuario) " +
    "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
    "DELETE r " +
    "CREATE (u)-[:MIEMBRO {fechaIngreso: $fechaIngreso}]->(c)")
    void quitarRolAdministrador(Long idMiembro, Long idComunidad, ZonedDateTime fechaIngreso,LocalDateTime fechaOtorgacion);

    @Query("MATCH (u:Usuario) WHERE id(u) = $idUsuario "+
        "CREATE (c:Comunidad {nombre: $nombre, fechaDeCreacion: $fechaCreacion, latitud: $latitud, longitud: $longitud, descripcion: $descripcion, cantidadMaximaMiembros: $participantes, esPrivada: $privada})"+
        " CREATE (u)<-[:CREADA_POR {fechaCreacion: $fechaCreacion}]-(c) "+
        "RETURN c")
    Comunidad guardarComunidadYCreador(String nombre, String descripcion, int participantes, boolean privada, Long idUsuario, LocalDate fechaCreacion,double latitud, double longitud);
 
    @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_INGRESO]->(c:Comunidad) "+
            "Where id(u) = $idUsuario AND id(c) = $idComunidad "+
            "DELETE r" )
    void eliminarSolicitudIngreso(Long idUsuario, Long idComunidad);

    @Query("MATCH (u:Usuario)-[r]-(c:Comunidad {id: $idComunidad}) " +
            "WHERE type(r) <> 'SOLICITUD_DE_INGRESO '" +
            "RETURN count(DISTINCT u) AS totalUsuarios")
    int cantidadUsuarios(Long idComunidad);

    @Query("MATCH (e:Evento) " +
            " WHERE (u)-[:MIEMBRO]->(c:Comunidad)<-[ORGANIZADO_POR]-(e)" +
            " RETURN c")
    Comunidad comunidadOrganizadora(Evento e);

    @Query("MATCH (u:Usuario)-[:MIEMBRO]->(c:Comunidad)" +
    "WHERE id(c) = $idComunidad " +
    "RETURN COUNT(DISTINCT u) AS totalParticipaciones")
    int miembrosDeComunidad(Long idComunidad);

}
