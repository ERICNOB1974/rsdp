package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Etiqueta;
import unpsjb.labprog.backend.model.DTO.EtiquetaPopularidadDTO;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EtiquetaRepository extends Neo4jRepository<Etiqueta, Long> {

    @Query("MATCH (e:Etiqueta) " +
    "WHERE toUpper(e.nombre) CONTAINS toUpper($nombre) " +
    "OPTIONAL MATCH (e)<-[:ETIQUETADA_CON]-(r:Rutina) " +
    "WITH e, COUNT(r) AS countRutinas " +
    "OPTIONAL MATCH (e)<-[:ETIQUETADA_CON]-(c:Comunidad) " +
    "WITH e, countRutinas, COUNT(c) AS countComunidades " +
    "OPTIONAL MATCH (e)<-[:ETIQUETADO_CON]-(ev:Evento) " +
    "WITH e, countRutinas, countComunidades, COUNT(ev) AS countEventos " +
    "RETURN e, (countRutinas + countComunidades + countEventos) AS popularidad " +
    "ORDER BY popularidad DESC")
    List<EtiquetaPopularidadDTO> search(String nombre);

    boolean existsByNombre(String nombre);

}   
