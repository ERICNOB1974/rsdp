package unpsjb.labprog.backend.business;


import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Ejercicio;

@Repository
public interface EjercicioRepository extends Neo4jRepository<Ejercicio, Long> {

      
    @Query("MATCH (r:Rutina)-[:TIENE]->(e:Ejercicio) WHERE id(r) = $idRutina RETURN e")
    List<Ejercicio> findEjerciciosByRutinaId(Long idRutina);
}