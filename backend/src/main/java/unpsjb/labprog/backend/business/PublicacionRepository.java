package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Publicacion;
import unpsjb.labprog.backend.model.Usuario;

@Repository
public interface PublicacionRepository extends Neo4jRepository<Publicacion, Long> {

    @Query("MATCH (u:Usuario{id:$usuario.id}), (p:Publicacion{id:$publicacion.id}) " +
            " CREATE (u)-[:POSTEO]->(p)")
    void establecerCreador(Publicacion publicacion, Usuario usuario);
}