package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Publicacion;

@Repository
public interface PublicacionRepository extends Neo4jRepository<Publicacion, Long> {

    @Query("MATCH (u:Usuario) WHERE id(u)=$ usuarioId " +
            "WITH u " +
            "MATCH (p:Publicacion) WHERE id(p)=$publicacionId " +
            "CREATE (u)-[:POSTEO]->(p)")
    void establecerCreador2(Long usuarioId, Long publicacionId);

    @Query("MATCH (u:Usuario), (p:Publicacion) " +
            "WHERE id(u) = $usuarioId AND id(p) = $publicacionId " +
            "CREATE (u)-[:POSTEO]->(p)")
    void establecerCreador(@Param("usuarioId") Long usuarioId, @Param("publicacionId") Long publicacionId);

}