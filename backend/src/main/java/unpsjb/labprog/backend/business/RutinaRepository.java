package unpsjb.labprog.backend.business;

import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Dia;
import unpsjb.labprog.backend.model.Rutina;

@Repository
public interface RutinaRepository extends Neo4jRepository<Rutina, Long> {

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)<-[:PARTICIPA_EN]-(participantes:Usuario)-[:REALIZA_RUTINA]->(r:Rutina) "
                     +
                     "WHERE NOT (u)-[:REALIZA_RUTINA]->(r) " +
                     "WITH r, count(participantes) as cantidad " +
                     "RETURN r " +
                     "ORDER BY cantidad DESC, r.nombre ASC " +
                     "LIMIT 3")
       List<Rutina> sugerenciasDeRutinasBasadosEnEventos(String nombreUsuario);


    
     
       @Query("MATCH (r:Rutina) WHERE ID(r) = $rutinaId " +
                     "MATCH (d:Dia) WHERE ID(d) = $diaId " +
                     "CREATE (r)-[:TIENE_DIA {orden: $orden}]->(d)")
       void relacionarRutinaDia(Long rutinaId, Long diaId, int orden);

   

       @Query("MATCH (d:Dia) WHERE ID(d) = $diaId " +
                     "MATCH (e:Ejercicio) WHERE ID(e) = $ejercicioId " +
                     "CREATE (d)-[:TIENE_EJERCICIO {orden: $orden, series: $series, repeticiones: $repeticiones}]->(e)")
       void relacionarDiaEjercicioSeries(Long diaId, Long ejercicioId, int orden, int series, int repeticiones);

       @Query("CREATE (r:Rutina {nombre: $nombre, descripcion: $descripcion}) " +
                     "MATCH (u:Usuario {id: $usuarioId}) " +
                     "CREATE (r)-[:CREADA_POR]->(u) " +
                     "RETURN r")
       Rutina saveConCreador(String nombre, String descripcion, Long usuarioId);


       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)<-[:PARTICIPA_EN]-(participantes:Usuario)-[:REALIZA_RUTINA]->(rutina:Rutina) "
                     +
                     "WHERE NOT (u)-[:REALIZA_RUTINA]->(rutina) " +
                     "WITH rutina, count(participantes) as score " +
                     "RETURN rutina, score " +
                     "ORDER BY score DESC, rutina.nombre ASC " +
                     "LIMIT 3")
       List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventos2(String nombreUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo:Usuario) " +
                     "MATCH (amigo)-[:REALIZA_RUTINA]->(rutina:Rutina) " +
                     "WHERE NOT (u)-[:REALIZA_RUTINA]->(rutina) " +
                     "WITH rutina, COUNT(amigo) AS score " + // Contamos cuántos amigos realizan la rutina
                     "RETURN rutina, score " +
                     "ORDER BY score DESC " + // Ordenamos por popularidad, de mayor a menor
                     "LIMIT 3")
       List<ScoreRutina> sugerenciasDeRutinasBasadosEnAmigos2(String nombreUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[PARTICIPA_EN]->(eventos:Evento) " +
                     " MATCH (eventos)-[:ETIQUETADO_CON]->(etiquetas:Etiqueta)" +
                     " MATCH (rutina:Rutina)-[:ETIQUETADA_CON]->(etiquetas) " +
                     " WHERE NOT (u)-[:REALIZA_RUTINA]->(rutina) " +
                     " WITH rutina, COUNT(DISTINCT etiquetas) AS score " +
                     " RETURN rutina, score " +
                     " ORDER BY score DESC" +
                     " LIMIT 3")
       List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(String nombreUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(rc:Rutina)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) "
                     +
                     "WITH u, collect(DISTINCT etiqueta) AS etiquetasUsuario " +
                     "MATCH (rutina:Rutina)-[:ETIQUETADA_CON]->(etiqueta) " +
                     "WHERE etiqueta IN etiquetasUsuario AND NOT EXISTS { " +
                     " MATCH (u)-[:REALIZA_RUTINA]->(rutina) " +
                     "} " +
                     "WITH rutina, COUNT(DISTINCT etiqueta) AS score " +
                     "RETURN rutina, score " +
                     "ORDER BY score DESC " +
                     "LIMIT 3")
       List<ScoreRutina> sugerenciasDeRutinasBasadasEnRutinas2(String nombreUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad) " +
                     "MATCH (comunidad)<-[:MIEMBRO]-(miembro:Usuario)-[:REALIZA_RUTINA]->(rutina:Rutina) " +
                     "WHERE NOT EXISTS { " +
                     "    MATCH (u)-[:REALIZA_RUTINA]->(r) " +
                     "} " +
                     "WITH rutina, COUNT(DISTINCT miembro) AS score " +
                     "RETURN rutina, score " +
                     "ORDER BY score DESC " +
                     "LIMIT 3")
       List<ScoreRutina> sugerenciasDeRutinasBasadasEnComunidades2(String nombreUsuario);

       @Query("MATCH (r:Rutina)-[:TIENE_DIA]->(d:Dia) " +
                     "WHERE id(r) = $idRutina " +
                     "RETURN COUNT(DISTINCT d) AS totalDias")
       int obtenerDiasEnRutina(Long idRutina);

       // Consulta para obtener los días de una rutina
       @Query("MATCH (r:Rutina)-[:TIENE_DIA]->(d:Dia) WHERE id(r) = $rutinaId RETURN id(d) AS diaId")
       List<Long> findDiasByRutina(Long rutinaId);

       @Query("MATCH (d:Dia)-[te:TIENE_EJERCICIO]->(e:Ejercicio) " +
                     "WHERE id(d) = $diaId AND te.repeticiones IS NOT NULL " +
                     "RETURN id(e) AS ejercicioId, e.nombre AS ejercicioNombre, e.descripcion AS ejercicioDescripcion, "
                     +
                     "te.orden AS ejercicioOrden, te.repeticiones AS repeticiones, te.series AS series")
       List<EjercicioRepeticionesDTO> findEjerciciosRepeticionesByDia(Long diaId);

       @Query("MATCH (d:Dia)-[te:TIENE_EJERCICIO]->(e:Ejercicio) " +
                     "WHERE id(d) = $diaId AND te.tiempo IS NOT NULL " +
                     "RETURN te.tiempo AS tiempo")
       List<Integer> findEjercicioTiempoByDia(Long diaId);

       @Query("MATCH (d:Dia)-[te:TIENE_EJERCICIO]->(e:Ejercicio) " +
                     "WHERE id(d) = $diaId " +
                     "RETURN id(te) AS relacionId")
       List<Long> findRelacionEjercicioIdsByDia(Long diaId);

       @Query("MATCH (d:Dia) WHERE id(d) = $diaId RETURN d.nombre AS nombre")
       String findNombreById(Long diaId);

       @Query("MATCH (d:Dia) WHERE id(d) = $diaId RETURN d.descripcion AS descripcion")
       String findDescripcionById(Long diaId);

       @Query("MATCH (d:Dia)<-[te:TIENE_DIA]-() WHERE id(d) = $diaId RETURN te.orden AS orden")
       Integer findOrdenById(Long diaId);

       @Query("MATCH (d:Dia)-[te:TIENE_EJERCICIO]->(e:Ejercicio) " +
                     "WHERE id(d) = $diaId " +
                     "RETURN id(te) AS relacionId")
       List<Long> findEjercicioIdsByDiaId(Long diaId);

       @Query("MATCH ()-[te:TIENE_EJERCICIO]->(e:Ejercicio) " +
                     "WHERE id(te) = $relacionId " +
                     "RETURN e.nombre AS ejercicioNombre")
       String findEjercicioNombreByRelacionId(Long relacionId);

       @Query("MATCH ()-[te:TIENE_EJERCICIO]->(e:Ejercicio) " +
                     "WHERE id(te) = $relacionId " +
                     "RETURN e.descripcion AS ejercicioDescripcion")
       String findEjercicioDescripcionByRelacionId(Long relacionId);

       @Query("MATCH ()-[te:TIENE_EJERCICIO]->() " +
                     "WHERE id(te) = $relacionId " +
                     "RETURN te.orden AS orden")
       Integer findEjercicioOrdenByRelacionId(Long relacionId);

       @Query("MATCH ()-[te:TIENE_EJERCICIO]->() " +
                     "WHERE id(te) = $relacionId " +
                     "RETURN te.repeticiones AS repeticiones")
       Integer findEjercicioRepeticionesByRelacionId(Long relacionId);

       @Query("MATCH ()-[te:TIENE_EJERCICIO]->() " +
                     "WHERE id(te) = $relacionId " +
                     "RETURN te.series AS series")
       Integer findEjercicioSeriesByRelacionId(Long relacionId);

       @Query("MATCH ()-[te:TIENE_EJERCICIO]->() " +
                     "WHERE id(te) = $relacionId " +
                     "RETURN te.tiempo AS tiempo")
       String findEjercicioTiempoByRelacionId(Long relacionId);

       @Query("MATCH ()-[te:TIENE_EJERCICIO]->(e:Ejercicio) " +
                     "WHERE id(te) = $relacionId " +
                     "RETURN e.imagen AS ejercicioImagen")
       String findImagenByRelacionId(Long relacionId);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo:Usuario) " +
                        "MATCH (amigo)-[:REALIZA_RUTINA]->(rutina:Rutina) " +
                        "WHERE NOT (u)-[:REALIZA_RUTINA]->(rutina) " +
                        "WITH rutina, COUNT(amigo) AS popularidad " + // Contamos cuántos amigos realizan la rutina
                        "RETURN rutina " +
                        "ORDER BY popularidad DESC " + // Ordenamos por popularidad, de mayor a menor
                        "LIMIT 3")
        List<Rutina> sugerenciasDeRutinasBasadosEnAmigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[PARTICIPA_EN]->(eventos:Evento) " +
                        " MATCH (eventos)-[:ETIQUETADO_CON]->(etiquetas:Etiqueta)" +
                        " MATCH (rutinas:Rutina)-[:ETIQUETADA_CON]->(etiquetas) " +
                        " WHERE NOT (u)-[:REALIZA_RUTINA]->(rutinas) " +
                        " WITH rutinas, COUNT(DISTINCT etiquetas) AS etiquetasEnComun " +
                        " RETURN rutinas" +
                        " ORDER BY etiquetasEnComun DESC" +
                        " LIMIT 3")
        List<Rutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(rc:Rutina)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) "
                        +
                        "WITH u, collect(DISTINCT etiqueta) AS etiquetasUsuario " +
                        "MATCH (r:Rutina)-[:ETIQUETADA_CON]->(etiqueta) " +
                        "WHERE etiqueta IN etiquetasUsuario AND NOT EXISTS { " +
                        " MATCH (u)-[:REALIZA_RUTINA]->(r) " +
                        "} " +
                        "WITH r, COUNT(DISTINCT etiqueta) AS etiquetasEnComun " +
                        "RETURN r " +
                        "ORDER BY etiquetasEnComun DESC " +
                        "LIMIT 3")
        List<Rutina> sugerenciasDeRutinasBasadasEnRutinas(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad) " +
                        "MATCH (comunidad)<-[:MIEMBRO]-(miembro:Usuario)-[:REALIZA_RUTINA]->(r:Rutina) " +
                        "WHERE NOT EXISTS { " +
                        "    MATCH (u)-[:REALIZA_RUTINA]->(r) " +
                        "} " +
                        "WITH r, COUNT(DISTINCT miembro) AS popularidad " +
                        "RETURN r " +
                        "ORDER BY popularidad DESC " +
                        "LIMIT 3")
        List<Rutina> sugerenciasDeRutinasBasadasEnComunidades(String nombreUsuario);

        Optional<Dia> findDiaById(String id);

      

        @Query("MATCH (d:Dia) WHERE ID(d) = $diaId " +
                        "MATCH (e:Ejercicio) WHERE ID(e) = $ejercicioId " +
                        "CREATE (d)-[:TIENE_EJERCICIO {orden: $orden, tiempo: $tiempo}]->(e)")

        void relacionarDiaEjercicioResistencia(Long diaId, Long ejercicioId, int orden, String tiempo);

        @Query("MATCH (r:Rutina), (u:Usuario) " +
                        "WHERE id(u) = $usuarioId AND id(r) = $rutinaId " +
                        "MERGE (r)-[:CREADA_POR]->(u)")
        void crearRelacionCreador(Long rutinaId, Long usuarioId);

        @Query("MATCH (r:Rutina), (e:Etiqueta) " +
                        "WHERE id(r) = $rutinaId AND id(e) = $etiquetaId " +
                        "MERGE (r)-[:ETIQUETADA_CON]->(e)")
        void etiquetarRutina(Long rutinaId, Long etiquetaId);

        @Query("MATCH (c:Rutina)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
                        "WITH c, collect(etiqueta.nombre) AS etiquetasRutina " +
                        "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasRutina) " +
                        "RETURN c")
        List<Rutina> rutinasEtiquetas(@Param("etiquetas") List<String> etiquetas);

        @Query("MATCH (c:Rutina) WHERE toUpper(c.nombre) CONTAINS toUpper($nombre) RETURN c")
        List<Rutina> rutinasNombre(String nombre);

     

        @Query("MATCH (r:Rutina), (u:Usuario) " +
        "WHERE id(u) = $usuarioId AND id(r) = $rutinaId " +
        "MERGE (u)-[rel:REALIZA_RUTINA]->(r) " +
        "ON CREATE SET rel.fechaComienzo = date()")
        void crearRelacionRealizaRutina(Long rutinaId, Long usuarioId);


        @Query("MATCH (r:Rutina)-[:CREADA_POR]->(u:Usuario) " +
        "WHERE id(u) = $idUsuario " +
        "RETURN r " +
        "ORDER BY r.nombre ASC " +
        "SKIP $offset LIMIT $limit")
        List<Rutina> rutinasCreadasPorUsuario(@Param("idUsuario") Long idUsuario, @Param("offset") int offset, @Param("limit") int limit);



}
