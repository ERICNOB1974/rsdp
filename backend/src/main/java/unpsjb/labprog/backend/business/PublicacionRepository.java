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
                        "CREATE (u)-[:COMENTA {fechaComentario:$fechaComentario, comentario: $comentario}]->(p)")
        void comentar(@Param("usuarioId") Long usuarioId, @Param("publicacionId") Long publicacionId, String comentario,
                        ZonedDateTime fechaComentario);

        @Query("MATCH (u:Usuario)-[:POSTEO]->(p:Publicacion) " +
                        "WHERE id(p) = $publicacionId " +
                        "RETURN id(u)")
        Long obtenerCreadorPublicacion(@Param("publicacionId") Long publicacionId);

        @Query("MATCH (p:Publicacion)<-[c:COMENTA]-(Comentario) WHERE id(p) = $publicacionId RETURN id(c) AS comentarioId")
        List<Long> idComentarios(@Param("publicacionId") Long publicacionId);

        @Query("MATCH ()-[n:COMENTA]->() WHERE id(n) = $id RETURN n.comentario AS texto")
        String findTextoById(@Param("id") Long id);

        @Query("MATCH ()-[n:COMENTA]->() WHERE id(n) = $id RETURN n.fechaComentario AS fecha")
        ZonedDateTime findFechaById(@Param("id") Long id);

        @Query("MATCH (u:Usuario), (p:Publicacion) " +
                        "WHERE id(u) = $usuarioId " +
                        "MATCH (u)-[:POSTEO]->(p) " +
                        "WHERE NOT (p)-[:PUBLICADO_DENTRO_DE]->() " +
                        "RETURN p ORDER BY p.fechaDeCreacion DESC " +
                        "SKIP $offset LIMIT $limit")
        List<Publicacion> publicacionesUsuario(@Param("usuarioId") Long usuarioId, @Param("offset") int offset,
        @Param("limit") int limit);

        @Query("""
                        MATCH (u:Usuario)-[:ES_AMIGO_DE]->(us:Usuario)-[:POSTEO]->(p:Publicacion)
                               WHERE id(u) = $usuarioId
                               AND us.privacidadPerfil <> 'Privada'
                               AND NOT (p)-[:PUBLICADO_DENTRO_DE]->()
                               RETURN p
                               ORDER BY p.fechaDeCreacion DESC
                               """)

        List<Publicacion> publicacionesAmigosUsuario(@Param("usuarioId") Long usuarioId);

        @Query("""
                        MATCH (u:Usuario)-[:POSTEO]->(p:Publicacion)
                        WHERE id(u) = $usuarioId
                        AND NOT (p)-[:PUBLICADO_DENTRO_DE]->()
                        RETURN p
                        UNION
                        MATCH (u:Usuario)-[:ES_AMIGO_DE]->(us:Usuario)-[:POSTEO]->(p:Publicacion)
                        WHERE id(u) = $usuarioId AND us.privacidadPerfil <> 'Privada'
                        AND NOT (p)-[:PUBLICADO_DENTRO_DE]->()
                        RETURN p
                        ORDER BY p.fechaDeCreacion DESC
                        """)
        List<Publicacion> publicacionesUsuarioYAmigos(@Param("usuarioId") Long usuarioId);

        @Query("""
                        MATCH (p:Publicacion) WHERE  id(p) = $publicacionId
                        MATCH (c:Comunidad) WHERE  id(c) = $comunidadId
                        CREATE (p)-[:PUBLICADO_DENTRO_DE]->(c)

                                """)
        void publicarEnComunidad(Long publicacionId, Long comunidadId);

        @Query("MATCH (c:Comunidad), (p:Publicacion) " +
                        "WHERE id(c) = $comunidadId " +
                        "MATCH (p)-[:PUBLICADO_DENTRO_DE]->(c) " +
                        "RETURN p ORDER BY p.fechaDeCreacion DESC")
        List<Publicacion> publicacionesComunidad(@Param("comunidadId") Long comunidadId);

}