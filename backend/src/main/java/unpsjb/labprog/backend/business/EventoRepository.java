package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Evento;

import java.util.List;

@Repository
public interface EventoRepository extends Neo4jRepository<Evento, Long> {

    // // Buscar eventos por nombre
    // List<Evento> findByNombreReal(String nombreReal);

    // List<Evento> findByNombreUsuario(String nombreUsuario);
    
}
