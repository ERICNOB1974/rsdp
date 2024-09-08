package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;

import java.util.List;

@Repository
public interface ComunidadRepository extends Neo4jRepository<Comunidad, Long> {

    // Buscar comunidades por nombre
    List<Comunidad> findByNombre(String nombre);

}
