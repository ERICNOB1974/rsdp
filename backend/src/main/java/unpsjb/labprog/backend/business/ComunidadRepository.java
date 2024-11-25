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

        // Buscar comunidades por nombre
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

        @Query("MATCH (c:Comunidad)-[:CREADA_POR]->(u:Usuario) " +
                        "WHERE id(u) = $idUsuario " +
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
                        "RETURN COALESCE(r.fechaIngreso, a.fechaIngreso) AS fechaIngreso")
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

        @Query("MATCH (u:Usuario) WHERE id(u) = $idUsuario " +
                        "CREATE (c:Comunidad {nombre: $nombre, fechaDeCreacion: $fechaCreacion, latitud: $latitud, longitud: $longitud, descripcion: $descripcion, cantidadMaximaMiembros: $participantes, esPrivada: $privada, imagen: $imagen, ubicacion: $ubicacion})"
                        +
                        " CREATE (u)<-[:CREADA_POR {fechaCreacion: $fechaCreacion}]-(c) " +
                        "RETURN c")
        Comunidad guardarComunidadYCreador(String nombre, String descripcion, int participantes, boolean privada,
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

        @Query("MATCH (u:Usuario)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR]-(c:Comunidad)" +
                        "WHERE id(c) = $idComunidad " +
                        "RETURN COUNT(DISTINCT u) AS totalParticipaciones")
        int miembrosDeComunidad(Long idComunidad);

        @Query("MATCH (c:Comunidad), (e:Etiqueta) " +
                        "WHERE id(c) = $comunidadId AND id(e) = $etiquetaId " +
                        "MERGE (c)-[:ETIQUETADA_CON]->(e)")
        void etiquetarComunidad(Long comunidadId, Long etiquetaId);

        @Query("MATCH (c:Comunidad)-[r:ADMINISTRADA_POR]->(u:Usuario) " +
                        "WHERE id(c) = $idComunidad AND id(u) = $idMiembro " +
                        "DELETE r " +
                        "CREATE (u)-[:MIEMBRO {fechaIngreso: $fechaIngreso}]->(c)")
        void quitarRolAdministrador(Long idMiembro, Long idComunidad, LocalDateTime fechaIngreso);

        @Query("MATCH (c:Comunidad),(u:Usuario {nombreUsuario:$nombreUsuario})" +
                        "WHERE NOT (c)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR]-(u) " +
                        "MATCH (c)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR]-(h) " + // Encontramos los demás miembros de
                                                                                  // la comunidad
                        "WITH c, COUNT(DISTINCT h) AS numParticipantes " +
                        "WHERE numParticipantes < c.cantidadMaximaMiembros " +
                        "AND NOT (u)-[r:EXPULSADO_COMUNIDAD]-(c) " +

                        "RETURN c " +
                        "ORDER BY c.nombre ASC " +
                        "SKIP $skip " + // Paginación: omite el número de resultados especificado
                        "LIMIT $limit") // Paginación: limita la cantidad de resultados devueltos
        List<Comunidad> disponibles(@Param("nombreUsuario") String nombreUsuario, @Param("skip") int skip,
                        @Param("limit") int limit);

        @Query("MATCH (u:Usuario)-[r:MIEMBRO|ADMINISTRADA_POR]-(c:Comunidad) " +
                        "WHERE id(u) = $idUsuario " +
                        "AND (toLower(c.nombre) CONTAINS toLower($nombreComunidad) OR $nombreComunidad = '') " +
                        "RETURN c ORDER BY r.fechaIngreso ASC " +
                        "SKIP $skip " +
                        "LIMIT $limit")
        List<Comunidad> miembroUsuario(@Param("idUsuario") Long idUsuario,
                        @Param("nombreComunidad") String nombreComunidad,
                        @Param("skip") int skip,
                        @Param("limit") int limit);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
                        "MATCH (amigo)-[:MIEMBRO]->(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT (u)-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR]-(comunidad) " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +

                        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "WITH u, comunidad, etiquetasEnComun, " +
                        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidad, etiquetasEnComun, " +
                        "point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia " +
                        "RETURN comunidad, (etiquetasEnComun / (distancia + 1500000)) AS score, 'a tus amigos le gustan eventos de este tipo, porque tienen '+etiquetasEnComun+' etiqueta/s en comun con las comunidades en las que participas' AS motivo "
                        + // Cambiar aquí
                        "ORDER BY score DESC ")
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnAmigos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), "
                        +
                        "(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
                        "WHERE NOT (u)<-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR]-(comunidad) " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
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
                        "RETURN comunidad, score, 'tienen '+etiquetasEnComun+' etiqueta/s en comun con eventos en los que participas' AS motivo  "
                        +
                        "ORDER BY score DESC ")
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnEventos2(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(c1:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta), "
                        +
                        "(comunidad:Comunidad)-[:ETIQUETADA_CON]->(etiqueta) " +
                        "WHERE NOT (u)<-[:MIEMBRO|:CREADA_POR|:ADMINISTRADA_POR]->(comunidad) " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
                        "OPTIONAL MATCH (comunidad)<-[:MIEMBRO]-(miembro) " +
                        "WITH u, comunidad, COUNT(DISTINCT etiqueta) AS etiquetasEnComun, COUNT(miembro) AS cantidadMiembros "
                        +
                        "WHERE cantidadMiembros < comunidad.cantidadMaximaMiembros " +
                        "WITH u, comunidad, etiquetasEnComun, " +
                        "point({latitude: comunidad.latitud, longitude: comunidad.longitud}) AS ubicacionComunidad, " +
                        "point({latitude: u.latitud, longitude: u.longitud}) AS ubicacionUsuario " +
                        "WITH comunidad, etiquetasEnComun, point.distance(ubicacionComunidad, ubicacionUsuario) AS distancia "
                        +
                        "WITH comunidad, etiquetasEnComun, distancia, (etiquetasEnComun/(distancia+1500000)) AS score "
                        +
                        "RETURN comunidad, score, 'tienen '+etiquetasEnComun+' etiqueta/s en comun con comunidades en las que perteneces' AS motivo   "
                        +
                        "ORDER BY score DESC ")
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnComunidades2(
                        @Param("nombreUsuario") String nombreUsuario);

        @Query("MATCH (c:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
                        "WITH c, collect(etiqueta.nombre) AS etiquetasComunidad " +
                        "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasComunidad) " +
                        "RETURN c")
        List<Comunidad> comunidadesEtiquetas(@Param("etiquetas") List<String> etiquetas);

        @Query("MATCH (c:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT EXISTS { " +
                        "  MATCH (u:Usuario)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR]-(c) " +
                        "  WHERE id(u) = $idUsuario " +
                        "} " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +

                        "WITH c, collect(etiqueta.nombre) AS etiquetasComunidad " +
                        "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasComunidad) " +
                        "RETURN c")
        List<Comunidad> comunidadesEtiquetasDisponibles(@Param("idUsuario") Long idUsuario,
                        @Param("etiquetas") List<String> etiquetas);

        @Query("MATCH (u:Usuario)-[:MIEMBRO|ADMINISTRADA_POR]-(c:Comunidad)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WHERE id(u) = $idUsuario " +
                        "AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad) " +
                        "WITH c, collect(etiqueta.nombre) AS etiquetasComunidad " +
                        "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasComunidad) " +
                        "RETURN c")
        List<Comunidad> comunidadesEtiquetasMiembro(@Param("idUsuario") Long idUsuario,
                        @Param("etiquetas") List<String> etiquetas);

        @Query("MATCH (c:Comunidad) WHERE toUpper(c.nombre) CONTAINS toUpper($nombre) RETURN c")
        List<Comunidad> comunidadesNombre(String nombre);

        @Query("""
                            MATCH (u:Usuario)
                            WHERE id(u) = $usuarioId
                            MATCH (c:Comunidad)
                            WHERE toUpper(c.nombre) CONTAINS toUpper($nombre)
                              AND NOT (c)<-[:MIEMBRO]-(u)
                              AND NOT (c)-[:CREADA_POR|ADMINISTRADA_POR]->(u)
                              AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad)

                            RETURN DISTINCT c
                        """)
        List<Comunidad> comunidadesNombreDisponibles(String nombre, @Param("usuarioId") Long usuarioId);

        @Query("""
                        MATCH (c:Comunidad)<-[:MIEMBRO]-(u)
                        WHERE toUpper(c.nombre) CONTAINS toUpper($nombre)
                        AND NOT (u)-[:EXPULSADO_COMUNIDAD]-(comunidad)
                        AND id(u) = $usuarioId
                        RETURN c
                        """)
        List<Comunidad> comunidadesNombreMiembro(String nombre, @Param("usuarioId") Long usuarioId);

        @Query("""
                            MATCH (c:Comunidad)
                            MATCH (us:Usuario)
                            WHERE id(us) = $usuarioId
                            OPTIONAL MATCH (u:Usuario)-[r]-(c)
                            WHERE type(r) <> 'SOLICITUD_DE_INGRESO' AND type(r) <> 'NOTIFICACION' AND type(r) <> 'EXPULSADO_COMUNIDAD'
                            WITH c, count(DISTINCT u) AS totalUsuarios, us
                            WHERE totalUsuarios >= $min AND totalUsuarios <= $max
                            AND NOT EXISTS {
                                MATCH (c)-[:CREADA_POR|ADMINISTRADA_POR|MIEMBRO]-(us)
                            }
                            RETURN DISTINCT c
                        """)
        List<Comunidad> comunidadesCantidadParticipantesDisponibles(@Param("usuarioId") Long usuarioId,
                        @Param("min") int min, @Param("max") int max);

        @Query("""
                            MATCH (c:Comunidad)
                            MATCH (us:Usuario)
                            WHERE id(us) = $usuarioId
                            OPTIONAL MATCH (u:Usuario)-[r]-(c)
                            WHERE type(r) <> 'SOLICITUD_DE_INGRESO' AND type(r) <> 'NOTIFICACION' AND type(r) <> 'EXPULSADO_COMUNIDAD'
                            WITH c, count(DISTINCT u) AS totalUsuarios, us
                            WHERE totalUsuarios >= $min AND totalUsuarios <= $max
                            AND (c)-[:MIEMBRO|ADMINISTRADA_POR]-(us) // Verifica si el usuario es miembro de la comunidad
                            RETURN DISTINCT c
                        """)
        List<Comunidad> comunidadesCantidadParticipantesMiembro(@Param("usuarioId") Long usuarioId,
                        @Param("min") int min,
                        @Param("max") int max);

        @Query("MATCH (c:Comunidad) " +
                        "OPTIONAL MATCH (u:Usuario)-[r]-(c) " +
                        "WHERE type(r) <> 'SOLICITUD_DE_INGRESO' AND type(r) <> 'NOTIFICACION' AND type(r) <> 'EXPULSADO_COMUNIDAD'" +
                        "WITH c, count(DISTINCT u) AS totalUsuarios " +
                        "WHERE totalUsuarios >= $min AND totalUsuarios <= $max " +
                        "RETURN c")
        List<Comunidad> comunidadesCantidadParticipantes(int min, int max);

        @Query("MATCH (u:Usuario)-[:MIEMBRO]-(c:Comunidad) "
                        + "WHERE id(u) = $idUsuario AND id(c) = $idComunidad "
                        + "RETURN COUNT(c) > 0")
        boolean esMiembro(Long idUsuario, Long idComunidad);

        @Query("MATCH (u:Usuario)-[:MIEMBRO|ADMINISTRADA_POR|CREADA_POR]-(c:Comunidad)" +
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
                        RETURN c ORDER BY c.nombre DESC
                        SKIP $skip
                        LIMIT $limit
                        """)
        List<Comunidad> listaFavoritas(Long idUsuario, @Param("nombreComunidad") String nombreComunidad,
                        @Param("skip") int skip,
                        @Param("limit") int limit);

        @Query("MATCH (e:Evento)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                        "WHERE id(e) = $idEvento " +
                        "RETURN c")
        Comunidad buscarComunidadPorEventoInterno(@Param("idEvento") Long idEvento);

        @Query("""
                        MATCH (p:Publicacion)-[:PUBLICADO_DENTRO_DE]-(c:Comunidad)
                        WHERE id(p)=$idPublicacion
                        return c
                        """)
        Optional<Comunidad> comunidadDePublicacion(Long idPublicacion);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (c:Comunidad) WHERE id(c)=$idComunidad
                        MATCH (u)-[r:PARTICIPA_EN]->(c) DELETE r
                        CREATE (u)-[:EXPULSADO_COMUNIDAD{motivoExpulsion: $motivoExpulsion}]->(e)
                                   """)
        void eliminarUsuario(Long idComunidad, Long idUsuario, String motivoExpulsion);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (e:Comunidad) WHERE id(e)=$idComunidad
                        MATCH (u)-[r:EXPULSADO_COMUNIDAD]-(e)
                        RETURN COUNT(r)>0
                        """)
        boolean estaExpulsado(Long idUsuario, Long idComunidad);

        @Query("""
                        MATCH (u:Usuario) WHERE id(u)=$idUsuario
                        MATCH (e:Comunidad) WHERE id(e)=$idComunidad
                        MATCH (u)-[r:EXPULSADO_COMUNIDAD]-(e)
                        RETURN r.motivoExpulsion
                        """)
        String motivoExpulsion(Long idUsuario, Long idComunidad);

}
