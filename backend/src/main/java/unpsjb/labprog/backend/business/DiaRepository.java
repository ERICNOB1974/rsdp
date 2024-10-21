package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Dia;

@Repository
public interface DiaRepository extends Neo4jRepository<Dia, Long> {

    @Query("CREATE (d:Dia {nombre: $nombre, descripcion: $descripcion}) RETURN ID(d)")
    Long crearDia(String nombre, String descripcion);

}