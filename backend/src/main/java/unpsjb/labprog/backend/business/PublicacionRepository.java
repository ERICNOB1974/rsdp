package unpsjb.labprog.backend.business;

import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Publicacion;

@Repository
public interface PublicacionRepository extends Neo4jRepository<Publicacion, Long> {

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(u) = $usuarioId AND id(p) = $publicacionId " +
                        "CREATE (u)-[:POSTEO]->(p)")
        void establecerCreador(@Param("usuarioId") Long usuarioId, @Param("publicacionId") Long publicacionId);

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(u) = $usuarioId AND id(p) = $publicacionId " +
                        "CREATE (u)-[:LIKE]->(p)")
        void likear(@Param("usuarioId") Long usuarioId, @Param("publicacionId") Long publicacionId);

        @Query("MATCH (u:Usuario)-[rel:LIKE]->(p:Publicacion) " +

                        "WHERE id(u) = $usuarioId AND id(p) = $publicacionId " +
                        "DELETE rel")
        void sacarLike(@Param("usuarioId") Long usuarioId, @Param("publicacionId") Long publicacionId);

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(u) = $usuarioId AND id(p) = $publicacionId " +
                        "MATCH (u)-[l:LIKE]->(p) " +
                        "RETURN COUNT (l)>0")
        boolean estaLikeada(@Param("usuarioId") Long usuarioId, @Param("publicacionId") Long publicacionId);

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(p) = $publicacionId " +
                        "MATCH (u)-[l:LIKE]->(p) " +
                        "RETURN COUNT (l)")
        Long cantidadLikes(@Param("publicacionId") Long publicacionId);

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(u) = $usuarioId AND id(p) = $publicacionId " +
                        "CREATE (u)-[:COMENTA {fechaComentario:$fechaComentario, comentario: $comentario }]->(p)")
        void comentar(@Param("usuarioId") Long usuarioId, @Param("publicacionId") Long publicacionId, String comentario,
                        ZonedDateTime fechaComentario);

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(p) = $publicacionId " +
                        "CREATE (u)-[:COMENTA {fechaComentario:$fechaComentario, comentario: $comentario }]->(p)")
        void comentarios(@Param("publicacionId") Long publicacionId);

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(u) = $usuarioId " +
                        "MATCH (u)-[:POSTEO]->(p) " +
                        "RETURN p ORDER BY p.fechaDeCreacion DESC")
        List<Publicacion> publicacionesUsuario(@Param("usuarioId") Long usuarioId);

}