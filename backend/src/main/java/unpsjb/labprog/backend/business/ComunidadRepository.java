package unpsjb.labprog.backend.business;

import java.time.ZonedDateTime;

import org.neo4j.driver.internal.value.DateTimeValue;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface ComunidadRepository extends Neo4jRepository<Comunidad, Long> {

    // Buscar comunidades por nombre
    List<Comunidad> findByNombre(String nombre);

    @Query("MATCH (u:Usuario {nombreUsuario: })-[:ES_AMIGO_DE]-(amigo)-[:MIEMBRO]-(comunidad:Comunidad) " +
            "WHERE NOT (u)-[:MIEMBRO]-(comunidad) " +
            "WITH comunidad, COUNT(DISTINCT amigo) AS amigosEnComun " +
            "RETURN comunidad " +
            "ORDER BY amigosEnComun DESC " +
            "LIMIT 3")
    List<Comunidad> recomendarComunidadesPorAmigos(String nombreUsuario);

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
    void quitarRolAdministrador(Long idMiembro, Long idComunidad, ZonedDateTime fechaIngreso,
            LocalDateTime fechaOtorgacion);

    @Query("MATCH (u:Usuario) WHERE id(u) = $idUsuario " +
            "CREATE (c:Comunidad {nombre: $nombre, fechaDeCreacion: $fechaCreacion, descripcion: $descripcion, cantidadMaximaMiembros: $participantes, ubicacion: $ubicacion,  esPrivada: $privada})"
            +
            " CREATE (u)<-[:CREADA_POR {fechaCreacion: $fechaCreacion}]-(c) " +
            "RETURN c")
    Comunidad guardarComunidadYCreador(String nombre, String descripcion, int participantes, String ubicacion,
            boolean privada, Long idUsuario, LocalDateTime fechaCreacion);

    @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_INGRESO]->(c:Comunidad) " +
            "Where id(u) = $idUsuario AND id(c) = $idComunidad " +
            "DELETE r")
    void eliminarSolicitudIngreso(Long idUsuario, Long idComunidad);

    @Query("MATCH (u:Usuario)-[r]-(c:Comunidad {id: $idComunidad}) " +
            "WHERE type(r) <> 'SOLICITUD_DE_INGRESO '" +
            "RETURN count(DISTINCT u) AS totalUsuarios")
    int cantidadUsuarios(Long idComunidad);

    @Query("MATCH (e:Evento) " +
            " WHERE (u)-[:MIEMBRO]->(c:Comunidad)<-[ORGANIZADO_POR]-(e)" +
            " RETURN c")
    Comunidad comunidadOrganizadora(Evento e);

}
