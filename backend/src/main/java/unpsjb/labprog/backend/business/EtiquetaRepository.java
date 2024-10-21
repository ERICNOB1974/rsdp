package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Etiqueta;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EtiquetaRepository extends Neo4jRepository<Etiqueta, Long> {
    @Query("MATCH (e:Etiqueta) WHERE toUpper(e.nombre) CONTAINS toUpper($nombre) RETURN e")
    List<Etiqueta> search(String nombre);

    @Query("MATCH (r:Rutina)-[:ETIQUETADA_CON]->(e:Etiqueta) " +
            "WHERE id(r) = $idRutina " +
            "RETURN COLLECT(DISTINCT e) AS etiquetas")
    List<Etiqueta> obtenerEtiquetasEnRutina(Long idRutina);
}
