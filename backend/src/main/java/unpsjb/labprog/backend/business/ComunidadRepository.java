package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;

import java.util.List;

@Repository
public interface ComunidadRepository extends Neo4jRepository<Comunidad, Long> {

    // Buscar comunidades por nombre
    List<Comunidad> findByNombre(String nombre);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo)-[:MIEMBRO]-(comunidad:Comunidad) " +
        "WHERE NOT (u)-[:MIEMBRO]-(comunidad) " +
       "WITH comunidad, COUNT(DISTINCT amigo) AS amigosEnComun " +
       "RETURN comunidad " +
       "ORDER BY amigosEnComun DESC")
    List<Comunidad> recomendarComunidadesPorAmigos(String nombreUsuario);

}
