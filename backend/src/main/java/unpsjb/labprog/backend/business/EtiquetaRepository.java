package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Etiqueta;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EtiquetaRepository extends Neo4jRepository<Etiqueta, Long> {
    
}
