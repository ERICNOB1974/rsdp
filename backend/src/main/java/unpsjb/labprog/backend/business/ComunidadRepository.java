package unpsjb.labprog.backend.business;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Evento;

@Repository
public interface ComunidadRepository extends Neo4jRepository<Comunidad, Long> {

        @Query("MATCH (comunidad:Comunidad) WHERE id(comunidad) = $idComunidad RETURN comunidad.genero")
        String generoDeUnaComunidad(Long idComunidad);

        @Query("MATCH (comunidad:Comunidad) WHERE id(comunidad) = $idComunidad AND comunidad.eliminada = false RETURN comunidad")
        Optional<Comunidad> findById(Long idComunidad);

        @Query("MATCH (comunidad:Comunidad) WHERE comunidad.nombre = $nombre AND comunidad.eliminada = false RETURN comunidad")
        List<Comunidad> findByNombre(String nombre);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), "
                        +
                        "(comunidadRecomendada:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
                        "WHERE NOT (u)-[:MIEMBRO|:CREADO_POR|:ADMINISTRADO_POR]->(comunidadRecomendada) " +
                        "OPTIONAL MATCH (comunidadRecomendada)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidadRecomendada, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidadRecomendada.cantidadMaximaMiembros " +
                        "WITH u, comunidadRecomendada, etiquetasEnComun, " +
                        "point({latitude: comunidadRecomendada.latitud, longitude: comunidadRecomendada.longitud}) AS ubicacionComunidad, "
                        +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidadRecomendada, etiquetasEnComun, " +
                        "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
                        "WITH comunidadRecomendada, etiquetasEnComun, distancia, " +
                        "(etiquetasEnComun/(distancia+1500000)) AS score " +
                        "WHERE comunidadRecomendada.eliminada = false " +
                        "RETURN comunidadRecomendada " +
                        "ORDER BY score DESC " +
                        "LIMIT 3")
        List<Comunidad> sugerenciasDeComunidadesBasadasEnComunidades(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta), "
                        +
                        "(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
                        "WHERE NOT (u)-[:MIEMBRO|:CREADO_POR|:ADMINISTRADO_POR]->(comunidad) " +
                        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "WITH u, comunidad, etiquetasEnComun, " +
                        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidad, etiquetasEnComun, " +
                        "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
                        "WITH comunidad, etiquetasEnComun, distancia, " +
                        "(etiquetasEnComun/(distancia+1500000)) AS score " +
                        "WHERE comunidad.eliminada = false " +
                        "RETURN comunidad " +
                        "ORDER BY score DESC " +
                        "LIMIT 3")
        List<Comunidad> sugerenciasDeComunidadesBasadasEnEventos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
                        "MATCH (amigo)-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT (u)<-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR]-(comunidad) " +
                        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "WITH u, comunidad, etiquetasEnComun, " +
                        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidad, etiquetasEnComun, " +
                        "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
                        "WITH comunidad, etiquetasEnComun, distancia, " +
                        "(etiquetasEnComun/(distancia+1500000)) AS score " +
                        "WHERE comunidad.eliminada = false " +
                        "RETURN comunidad " +
                        "ORDER BY score DESC " +
                        "LIMIT 3")
        List<Comunidad> sugerenciasDeComunidadesBasadasEnAmigos(String nombreUsuario);

        @Query("MATCH (c:Comunidad), (u:Usuario) WHERE id(c) = $idComunidad AND id(u) = $idUsuario " +
                        "CREATE (c)<-[:MIEMBRO {fechaIngreso: $fechaIngreso}]-(u)")
        void nuevoMiembro(Long idComunidad, Long idUsuario, LocalDateTime fechaIngreso);

        @Query("MATCH (c:Comunidad)<-[r:MIEMBRO]-(u:Usuario) " +
                        "WHERE id(c) = $idComunidad AND id(u) = $idUsuario " +
                        "DELETE r ")
        void eliminarUsuario(Long idUsuario, Long idComunidad);

        @Query("""
                        MATCH (c:Comunidad) WHERE id(c) = $idComunidad
                        SET c.eliminada = true
                        """)
        void eliminar(Long idComunidad);

        @Query("MATCH (c:Comunidad)-[:CREADA_POR]->(u:Usuario) " +
                        "WHERE id(u) = $idUsuario " +
                        "AND c.eliminada = false " +
                        "RETURN c " +
                        "ORDER BY c.fechaDeCreacion ASC " +
                        "SKIP $offset LIMIT $limit")
        List<Comunidad> comunidadesCreadasPorUsuario(@Param("idUsuario") Long idUsuario, @Param("offset") int offset,
                        @Param("limit") int limit);

        @Query("MATCH (c:Comunidad), (u:Usuario) WHERE id(c) = $idComunidad AND id(u) = $idUsuario " +
                        "MATCH (c)<-[r:MIEMBRO]-(u) DELETE r")
        void miembroSaliente(Long idComunidad, Long idUsuario);

        @Query("MATCH (u:Usuario) WHERE id(u) = $idMiembro " +
                        "MATCH (c:Comunidad) WHERE id(c) = $idComunidad " +
                        "OPTIONAL MATCH (u)-[r:MIEMBRO]->(c) " +
                        "OPTIONAL MATCH (u)<-[a:ADMINISTRADA_POR]-(c) " +
                        "OPTIONAL MATCH (u)<-[m:MODERADA_POR]-(c) " +
                        "RETURN COALESCE(r.fechaIngreso, a.fechaIngreso, m.fechaIngreso) AS fechaIngreso")
        LocalDateTime obtenerFechaIngreso(Long idMiembro, Long idComunidad);

        @Query("MATCH (c:Comunidad)<-[r:MIEMBRO]-(u:Usuario) " +
                        "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
                        "DELETE r " +
                        "CREATE (u)<-[:ADMINISTRADA_POR {fechaIngreso: $fechaIngreso, fechaOtorgacion: $fechaOtorgacion}]-(c)")
        void otorgarRolAdministrador(Long idMiembro, Long idComunidad, LocalDateTime fechaIngreso,
                        LocalDateTime fechaOtorgacion);

        @Query("MATCH (c:Comunidad)-[r:ADMINISTRADA_POR]->(u:Usuario) " +
                        "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
                        "DELETE r " +
                        "CREATE (u)-[:MIEMBRO {fechaIngreso: $fechaIngreso}]->(c)")
        void quitarRolAdministrador(Long idMiembro, Long idComunidad, LocalDateTime fechaIngreso,
                        LocalDateTime fechaOtorgacion);

        @Query("MATCH (c:Comunidad)<-[r:MIEMBRO|ADMINISTRADA_POR]-(u:Usuario) " +
                        "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
                        "DELETE r " +
                        "CREATE (u)<-[:MODERADA_POR {fechaIngreso: $fechaIngreso, fechaOtorgacion: $fechaOtorgacion}]-(c)")
        void otorgarRolModerador(Long idMiembro, Long idComunidad, LocalDateTime fechaIngreso,
                        LocalDateTime fechaOtorgacion);

        @Query("MATCH (c:Comunidad)-[r:MODERADA_POR]->(u:Usuario) " +
                        "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
                        "DELETE r " +
                        "CREATE (u)-[:MIEMBRO {fechaIngreso: $fechaIngreso}]->(c)")
        void quitarRolModerador(Long idMiembro, Long idComunidad, LocalDateTime fechaIngreso,
                        LocalDateTime fechaOtorgacion);

        @Query("MATCH (u:Usuario) WHERE id(u) = $idUsuario " +
                        "CREATE (c:Comunidad {nombre: $nombre, fechaDeCreacion: $fechaCreacion, latitud: $latitud, longitud: $longitud, genero: $genero, descripcion: $descripcion, cantidadMaximaMiembros: $participantes, esPrivada: $privada, eliminada: $eliminada, esModerada: $moderada, imagen: $imagen, ubicacion: $ubicacion})"
                        +
                        " CREATE (u)<-[:CREADA_POR {fechaCreacion: $fechaCreacion}]-(c) " +
                        "RETURN c")
        Comunidad guardarComunidadYCreador(String nombre, String genero, String descripcion, int participantes,
                        boolean privada, boolean eliminada, boolean moderada,
                        Long idUsuario, LocalDate fechaCreacion, double latitud, double longitud, String imagen,
                        String ubicacion);

        @Query("MATCH (u:Usuario)-[r:SOLICITUD_DE_INGRESO]->(c:Comunidad) " +
                        "Where id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "DETACH DELETE r")
        void eliminarSolicitudIngreso(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)-[r]-(c:Comunidad {id: $idComunidad}) " +
                        "WHERE type(r) <> 'SOLICITUD_DE_INGRESO '" +
                        " AND type(r) <> 'NOTIFICACION' " +
                        "RETURN count(DISTINCT u) AS totalUsuarios")
        int cantidadUsuarios(Long idComunidad);

        @Query("MATCH (e:Evento) " +
                        " WHERE (c:Comunidad)<-[:ORGANIZADA_POR]-(e)" +
                        " RETURN c")
        Comunidad comunidadOrganizadora(Evento e);

        @Query("MATCH (u:Usuario)-[:MIEMBRO|ADMINISTRADA_POR|MODERADA_POR|CREADA_POR]-(c:Comunidad)" +
                        "WHERE id(c) = $idComunidad " +
                        "RETURN COUNT(DISTINCT u) AS totalParticipaciones")
        int miembrosDeComunidad(Long idComunidad);

        @Query("MATCH (c:Comunidad), (e:Etiqueta) " +
                        "WHERE id(c) = $comunidadId AND id(e) = $etiquetaId " +
                        "MERGE (c)-[:ETIQUETADA_CON]->(e)")
        void etiquetarComunidad(Long comunidadId, Long etiquetaId);

        @Query("MATCH (c:Comunidad)-[r:ETIQUETADA_CON]->(e:Etiqueta) " +
                        "WHERE id(c) = $comunidadId AND id(e) = $etiquetaId " +
                        "DELETE r")
        void desetiquetarComunidad(Long comunidadId, Long etiquetaId);

        @Query("MATCH (c:Comunidad)-[r:ADMINISTRADA_POR]->(u:Usuario) " +
                        "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
                        "DELETE r " +
                        "CREATE (u)-[:MIEMBRO {fechaIngreso: $fechaIngreso}]->(c)")
        void quitarRolAdministrador(Long idMiembro, Long idComunidad, LocalDateTime fechaIngreso);

        @Query("MATCH (c:Comunidad),(u:Usuario {nombreUsuario:$nombreUsuario})" +
                        "WHERE NOT (c)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]-(u) " +
                        "MATCH (c)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]-(h) " + // Encontramos los demás
                                                                                               // miembros de
                        // la comunidad
                        "WITH c, COUNT(DISTINCT h) AS numParticipantes, u " +
                        "WHERE numParticipantes < c.cantidadMaximaMiembros " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(c) " +
                        "AND c.eliminada = false " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND c.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "RETURN c " +
                        "ORDER BY c.nombre ASC " +
                        "SKIP $skip " + // Paginación: omite el número de resultados especificado
                        "LIMIT $limit") // Paginación: limita la cantidad de resultados devueltos
        List<Comunidad> disponibles(@Param("nombreUsuario") String nombreUsuario, @Param("skip") int skip,
                        @Param("limit") int limit);

        @Query("MATCH (u:Usuario)-[r:MIEMBRO|ADMINISTRADA_POR|CREADA_POR|MODERADA_POR]-(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario " +
                        "AND (toLower(c.nombre) CONTAINS toLower($nombreComunidad) OR $nombreComunidad = '') " +
                        "AND c.eliminada = false " +
                        "RETURN c ORDER BY r.fechaIngreso ASC, c.nombre DESC " +
                        "SKIP $skip " +
                        "LIMIT $limit")
        List<Comunidad> miembroUsuario(@Param("idUsuario") Long idUsuario,
                        @Param("nombreComunidad") String nombreComunidad,
                        @Param("skip") int skip,
                        @Param("limit") int limit);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
                        "MATCH (amigo)-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT (u)-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR|:MODERADA_POR]-(comunidad) " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND comunidad.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND comunidad.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND comunidad.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "AND comunidad.eliminada = false " +
                        "WITH u, comunidad, etiquetasEnComun, " +
                        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidad, etiquetasEnComun, " +
                        "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
                        "RETURN comunidad, (etiquetasEnComun / (distancia + 1500000)) AS score, 'A tus amigos le gustan eventos de este tipo' AS motivo "
                        + // Cambiar aquí
                        "ORDER BY score DESC ")
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnAmigos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
                        "MATCH (amigo)-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR|:MODERADA_POR]-(comunidad:Comunidad) " +
                        "WHERE NOT (u)-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR|:MODERADA_POR]-(comunidad) " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND comunidad.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND comunidad.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND comunidad.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "OPTIONAL MATCH (comunidad)-[:MIEMBRO|:ADMINISTRADA_POR|:CREADA_POR|:MODERADA_POR]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT amigo) AS cantidadAmigosEnComunidad, COUNT(DISTINCT miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "AND comunidad.eliminada = false " +
                        "RETURN comunidad, (cantidadAmigosEnComunidad) AS score, 'Tienes amigos en esta comunidad' AS motivo "
                        +
                        "ORDER BY score DESC ")
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnAmigos2SinEtiquetas(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), "
                        +
                        "(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
                        "WHERE NOT (u)<-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR|:MODERADA_POR]-(comunidad) " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND comunidad.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND comunidad.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND comunidad.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "AND comunidad.eliminada = false " +
                        "WITH u, comunidad, etiquetasEnComun, " +
                        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidad, etiquetasEnComun, " +
                        "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
                        "WITH comunidad, etiquetasEnComun, distancia, " +
                        "(etiquetasEnComun/(distancia+1500000)) AS score " +
                        "RETURN comunidad, score, 'Es similar a los eventos en los que participas' AS motivo  "
                        +
                        "ORDER BY score DESC ")
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnEventos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(c1:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), "
                        +
                        "(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
                        "WHERE NOT (u)<-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR|:MODERADA_POR]->(comunidad) " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND comunidad.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND comunidad.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND comunidad.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "AND comunidad.eliminada = false " +
                        "WITH u, comunidad, etiquetasEnComun, " +
                        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidad, etiquetasEnComun, point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia "
                        +
                        "WITH comunidad, etiquetasEnComun, distancia, (etiquetasEnComun/(distancia+1500000)) AS score "
                        +
                        "RETURN comunidad, score, 'Es similar a las comunidades a las que perteneces' AS motivo   "
                        +
                        "ORDER BY score DESC ")
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnComunidades2(
                        @Param("nombreUsuario") String nombreUsuario);

        @Query("MATCH (c:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), (u:Usuario {id: $idUsuario}) " +
                        "WHERE NOT (u)-[:EXPULSADO_COMUNIDAD]-(c) " +
                        "WITH u, c, collect(etiqueta.nombre) AS etiquetasComunidad, c.eliminada AS eliminada, u " +
                        "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasComunidad) " +
                        "AND eliminada = false " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND c.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "RETURN c")
        List<Comunidad> comunidadesEtiquetas(@Param("idUsuario") Long idUsuario,
                        @Param("etiquetas") List<String> etiquetas);

        @Query("MATCH (u:Usuario) " +
                        "MATCH (c:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT EXISTS { " +
                        "    MATCH (u)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR|MODERADA_POR]-(c) " +
                        "} " +
                        "AND id(u) = $idUsuario " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(c) " +
                        "WITH c, collect(etiqueta.nombre) AS etiquetasComunidad, c.eliminada AS eliminada, u " +
                        "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasComunidad) " +
                        "AND eliminada = false " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND c.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "RETURN c")
        List<Comunidad> comunidadesEtiquetasDisponibles(@Param("idUsuario") Long idUsuario,
                        @Param("etiquetas") List<String> etiquetas);

        @Query("MATCH (u:Usuario)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR|MODERADA_POR]-(c:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) "
                        +
                        "WHERE id(u) = $idUsuario " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(c) " +
                        "WITH u, c, collect(etiqueta.nombre) AS etiquetasComunidad, c.eliminada AS eliminada " +
                        "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasComunidad) " +
                        "AND eliminada = false " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND c.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "RETURN c")
        List<Comunidad> comunidadesEtiquetasMiembro(@Param("idUsuario") Long idUsuario,
                        @Param("etiquetas") List<String> etiquetas);

        @Query("MATCH (c:Comunidad), (u:Usuario {id: $idUsuario}) " +
                        "WHERE toUpper(c.nombre) CONTAINS toUpper($nombre) " +
                        "AND c.eliminada = false " +
                        "AND ( " +
                        "    (u.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR " +
                        "    (u.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR " +
                        "    (u.genero = 'otros' AND c.genero IN ['otros', 'sinGenero']) " +
                        ") " +
                        "RETURN c")
        List<Comunidad> comunidadesNombre(@Param("nombre") String nombre,
                        @Param("idUsuario") Long idUsuario);

        @Query("""
                        MATCH (u:Usuario)
                        WHERE id(u) = $usuarioId
                        MATCH (c:Comunidad)
                        WHERE toUpper(c.nombre) CONTAINS toUpper($nombre)
                          AND NOT (c)<-[:MIEMBRO]-(u)
                          AND NOT (c)-[:CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(u)
                          AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(c)
                        WITH c, u
                        WHERE NOT c.eliminada
                        AND (
                            (u.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR
                            (u.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR
                            (u.genero = 'otros' AND c.genero IN ['otros', 'sinGenero'])
                        )
                        RETURN DISTINCT c
                        """)
        List<Comunidad> comunidadesNombreDisponibles(@Param("nombre") String nombre,
                        @Param("usuarioId") Long usuarioId);

        @Query("""
                        MATCH (c:Comunidad)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR|MODERADA_POR]-(u)
                        WHERE id(u) = $usuarioId
                        AND toUpper(c.nombre) CONTAINS toUpper($nombre)
                        AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(c)
                        WITH c, u
                        WHERE NOT c.eliminada
                        AND (
                            (u.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR
                            (u.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR
                            (u.genero = 'otros' AND c.genero IN ['otros', 'sinGenero'])
                        )
                        RETURN c
                        """)
        List<Comunidad> comunidadesNombreMiembro(@Param("nombre") String nombre,
                        @Param("usuarioId") Long usuarioId);

        @Query("""
                            MATCH (c:Comunidad)
                            MATCH (us:Usuario)
                            WHERE id(us) = $usuarioId
                            AND NOT (us)-[:EXPULSADO_COMUNIDAD]-(c)
                            AND (
                                    (us.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR
                                    (us.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR
                                    (us.genero = 'otros' AND c.genero IN ['otros', 'sinGenero'])
                            )
                            OPTIONAL MATCH (u:Usuario)-[r]-(c)
                            WHERE type(r) <> 'SOLICITUD_DE_INGRESO' AND type(r) <> 'NOTIFICACION' AND type(r) <> 'EXPULSADO_COMUNIDAD'
                            WITH c, count(DISTINCT u) AS totalUsuarios, us
                            WHERE totalUsuarios >= $min AND totalUsuarios <= $max
                            AND NOT EXISTS {
                                MATCH (c)-[:CREADA_POR|ADMINISTRADA_POR|MIEMBRO|MODERADA_POR]-(us)
                            }
                            AND NOT c.eliminada
                            RETURN DISTINCT c
                        """)
        List<Comunidad> comunidadesCantidadParticipantesDisponibles(@Param("usuarioId") Long usuarioId,
                        @Param("min") int min, @Param("max") int max);

        @Query("""
                            MATCH (c:Comunidad), (us:Usuario)
                            WHERE id(us) = $usuarioId
                            AND NOT (us)-[:EXPULSADO_COMUNIDAD]-(c)
                            AND (
                                    (us.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR
                                    (us.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR
                                    (us.genero = 'otros' AND c.genero IN ['otros', 'sinGenero'])
                            )
                            OPTIONAL MATCH (u:Usuario)-[r]-(c)
                            WHERE type(r) <> 'SOLICITUD_DE_INGRESO' AND type(r) <> 'NOTIFICACION' AND type(r) <> 'EXPULSADO_COMUNIDAD'
                            WITH c, count(DISTINCT u) AS totalUsuarios, us
                            WHERE totalUsuarios >= $min AND totalUsuarios <= $max
                            AND (c)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR|MODERADA_POR]-(us)
                            AND NOT c.eliminada
                            RETURN DISTINCT c
                        """)
        List<Comunidad> comunidadesCantidadParticipantesMiembro(@Param("usuarioId") Long usuarioId,
                        @Param("min") int min, @Param("max") int max);

        @Query("""
                            MATCH (c:Comunidad), (us:Usuario)
                            WHERE id(us) = $usuarioId
                            AND (
                                    (us.genero = 'masculino' AND c.genero IN ['masculino', 'sinGenero']) OR
                                    (us.genero = 'femenino' AND c.genero IN ['femenino', 'sinGenero']) OR
                                    (us.genero = 'otros' AND c.genero IN ['otros', 'sinGenero'])
                            )
                            OPTIONAL MATCH (u:Usuario)-[r]-(c)
                            WHERE type(r) <> 'SOLICITUD_DE_INGRESO' AND type(r) <> 'NOTIFICACION' AND type(r) <> 'EXPULSADO_COMUNIDAD'
                            WITH c, count(DISTINCT u) AS totalUsuarios
                            WHERE totalUsuarios >= $min AND totalUsuarios <= $max
                            AND NOT c.eliminada
                            RETURN c
                        """)
        List<Comunidad> comunidadesCantidadParticipantes(@Param("usuarioId") Long usuarioId,
                        @Param("min") int min, @Param("max") int max);

        @Query("MATCH (u:Usuario)-[:MIEMBRO]-(c:Comunidad) "
                        + "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "
                        + "RETURN COUNT(c) > 0")
        boolean esMiembro(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR|MODERADA_POR]-(c:Comunidad)" +
                        "WHERE id(c) = $idComunidad " +
                        "WITH c, COUNT(DISTINCT u) AS ocupados " +
                        "RETURN (c.cantidadMaximaMiembros - ocupados ) AS cantidad")
        int cuposDisponibles(Long idComunidad);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (c:Comunidad) WHERE id(c) = $idComunidad
                        CREATE (u)-[:COMUNIDAD_FAVORITA]->(c)
                        """)
        void marcarComoFavorita(Long idComunidad, Long idUsuario);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (c:Comunidad) WHERE id(c) = $idComunidad
                        MATCH (u)-[r:COMUNIDAD_FAVORITA]->(c)
                        DETACH DELETE r
                        """)
        void eliminarComoFavorita(Long idComunidad, Long idUsuario);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (c:Comunidad) WHERE id(c) = $idComunidad
                        MATCH (u)-[r:COMUNIDAD_FAVORITA]->(c)
                        return COUNT(r)>0
                        """)
        boolean esFavorita(Long idComunidad, Long idUsuario);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (c:Comunidad)
                        MATCH (u)-[:COMUNIDAD_FAVORITA]->(c)
                        WHERE (toLower(c.nombre) CONTAINS toLower($nombreComunidad) OR $nombreComunidad = '')
                        AND NOT c.eliminada
                        RETURN c ORDER BY c.nombre DESC
                        SKIP $skip
                        LIMIT $limit
                        """)
        List<Comunidad> listaFavoritas(Long idUsuario, @Param("nombreComunidad") String nombreComunidad,
                        @Param("skip") int skip,
                        @Param("limit") int limit);

        @Query("MATCH (e:Evento)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                        "WHERE id(e) = $idEvento " +
                        "AND NOT c.eliminada " +
                        "RETURN c")
        Comunidad buscarComunidadPorEventoInterno(@Param("idEvento") Long idEvento);

        @Query("""
                        MATCH (p:Publicacion)-[:PUBLICADO_DENTRO_DE]-(c:Comunidad)
                        WHERE id(p)=$idPublicacion
                        AND NOT c.eliminada
                        return c
                        """)
        Optional<Comunidad> comunidadDePublicacion(Long idPublicacion);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (c:Comunidad) WHERE id(c)=$idComunidad
                        MATCH (u)-[r:MIEMBRO|ADMINISTRADA_POR|MODERADA_POR]->(c) DELETE r
                        CREATE (u)-[:EXPULSADO_COMUNIDAD {motivoExpulsion: $motivoExpulsion, tipo: $tipo, fechaHoraExpulsion: $fechaHoraExpulsion, fechaExpulsado: $fechaExpulsado}]->(c)
                        """)
        void eliminarUsuario(Long idComunidad, Long idUsuario, String motivoExpulsion, String tipo,
                        LocalDateTime fechaHoraExpulsion, LocalDateTime fechaExpulsado);

        @Query("MATCH (u:Usuario)-[r:EXPULSADO_COMUNIDAD]->(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "SET r.motivoExpulsion = $motivoExpulsion, r.tipo = $tipo, r.fechaHoraExpulsion = $fechaHoraExpulsion "
                        +
                        "RETURN r")
        void actualizarExpulsion(@Param("idUsuario") Long idUsuario,
                        @Param("idComunidad") Long idComunidad,
                        @Param("motivoExpulsion") String motivoExpulsion,
                        @Param("tipo") String tipo,
                        @Param("fechaHoraExpulsion") LocalDateTime fechaHoraExpulsion);

        @Query("MATCH (u:Usuario)-[r:EXPULSADO_COMUNIDAD]->(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "RETURN r.motivoExpulsion AS motivoExpulsion " +
                        "ORDER BY r.fechaExpulsado DESC " +
                        "LIMIT 1")
        String findMotivoExpulsion(@Param("idUsuario") Long idUsuario,
                        @Param("idComunidad") Long idComunidad);

        @Query("MATCH (u:Usuario)-[r:EXPULSADO_COMUNIDAD]->(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "RETURN r.tipo AS tipo " +
                        "ORDER BY r.fechaExpulsado DESC " +
                        "LIMIT 1")
        String findTipoExpulsion(@Param("idUsuario") Long idUsuario,
                        @Param("idComunidad") Long idComunidad);

        @Query("MATCH (u:Usuario)-[r:EXPULSADO_COMUNIDAD]->(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario AND id(c) = $idComunidad " +
                        "RETURN r.fechaHoraExpulsion AS fechaHoraExpulsion " +
                        "ORDER BY r.fechaExpulsado DESC " +
                        "LIMIT 1")
        LocalDateTime findFechaHoraExpulsion(@Param("idUsuario") Long idUsuario,
                        @Param("idComunidad") Long idComunidad);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (e:Comunidad) WHERE id(e)=$idComunidad
                        MATCH (u)-[r:EXPULSADO_COMUNIDAD]-(e)
                        RETURN r.motivoExpulsion
                        """)
        String motivoExpulsion(Long idUsuario, Long idComunidad);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (c:Comunidad) WHERE id(c)=$idComunidad
                        MATCH (u)-[r:EXPULSADO_COMUNIDAD]->(c)
                        DELETE r
                        """)
        void eliminarBan(Long idComunidad, Long idUsuario);

}
