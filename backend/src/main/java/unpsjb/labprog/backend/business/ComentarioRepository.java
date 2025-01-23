package unpsjb.labprog.backend.business;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comentario;
import unpsjb.labprog.backend.model.Evento;

@Repository
public interface ComentarioRepository extends Neo4jRepository<Comentario, Long> {

       @Query("MATCH (u:Usuario), (p:Publicacion) " +
                     "WHERE id(u) = $usuarioId AND id(p) = $publicacionId " +
                     "CREATE (c:Comentario {texto: $texto, fecha: $fecha}) " +
                     "CREATE (u)-[:HIZO]->(c)-[:PERTENECE_A]->(p)")
       void comentar(Long usuarioId, Long publicacionId, String texto, ZonedDateTime fecha);

       @Query("MATCH (c:Comentario)-[:PERTENECE_A]->(p:Publicacion), " +
                     "(u:Usuario)-[:HIZO]->(c) " +
                     "WHERE id(p) = $idPublicacion " +
                     "RETURN c, u")
       List<Comentario> findComentariosByPublicacionId(Long idPublicacion);

       @Query("MATCH (p:Publicacion)<-[:PERTENECE_A]-(c:Comentario), (u:Usuario) " +
                     "WHERE id(c) = $comentarioPadreId AND id(u) = $usuarioId " +
                     "WITH u, c, p, $texto AS texto, $fecha AS fecha " +
                     "CREATE (r:Comentario {texto: texto, fecha: fecha})-[:RESPONDE_A]->(c) " +
                     "CREATE (u)-[:HIZO]->(r) " +
                     "RETURN r")
       Comentario responderComentario(@Param("comentarioPadreId") Long comentarioPadreId,
                     @Param("texto") String texto,
                     @Param("fecha") ZonedDateTime fecha,
                     @Param("usuarioId") Long usuarioId);

       @Query("MATCH (c:Comentario)-[:RESPONDE_A]->(p:Comentario) " +
                     "WHERE id(p) = $comentarioPadreId " +
                     "RETURN c " +
                     "ORDER BY c.fecha DESC SKIP $skip LIMIT $limit")
       List<Comentario> findRespuestasByComentarioPadreId(
                     @Param("comentarioPadreId") Long comentarioPadreId,
                     @Param("skip") int skip,
                     @Param("limit") int limit);

       @Query("MATCH (c:Comentario)-[:RESPONDE_A]->(p:Comentario) " +
                     "WHERE id(p) = $comentarioPadreId " +
                     "RETURN count(c)")
       long contarRespuestasPorComentarioPadreId(@Param("comentarioPadreId") Long comentarioPadreId);

       @Query("MATCH (u:Usuario), (c:Comentario) " +
                     "WHERE id(u) = $usuarioId AND id(c) = $comentarioId " +
                     "CREATE (u)-[:LIKE_COMENTARIO]->(c)")
       void likearComentario(@Param("usuarioId") Long usuarioId, @Param("comentarioId") Long comentarioId);

       @Query("MATCH (u:Usuario)-[rel:LIKE_COMENTARIO]->(c:Comentario) " +
                     "WHERE id(u) = $usuarioId AND id(c) = $comentarioId " +
                     "DELETE rel")
       void sacarLike(@Param("usuarioId") Long usuarioId, @Param("comentarioId") Long comentarioId);

       @Query("MATCH (u:Usuario), (c:Comentario) " +
                     "WHERE id(u) = $usuarioId AND id(c) = $comentarioId " +
                     "MATCH (u)-[l:LIKE_COMENTARIO]->(c) " +
                     "RETURN COUNT (l)>0")
       boolean estaLikeada(@Param("usuarioId") Long usuarioId, @Param("comentarioId") Long comentarioId);

       @Query("MATCH (u:Usuario), (c:Comentario) " +
                     "WHERE id(c) = $comentarioId " +
                     "MATCH (u)-[l:LIKE_COMENTARIO]->(c) " +
                     "RETURN COUNT (l)")
       Long cantidadLikes(@Param("comentarioId") Long comentarioId);

}