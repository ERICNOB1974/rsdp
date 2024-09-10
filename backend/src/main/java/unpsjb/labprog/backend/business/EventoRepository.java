package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Evento;

@Repository
public interface EventoRepository extends Neo4jRepository<Evento, Long> {

    // // Buscar eventos por nombre
    // List<Evento> findAll(String nombreReal);

    // List<Evento> findByNombreUsuario(String nombreUsuario);
    
}
