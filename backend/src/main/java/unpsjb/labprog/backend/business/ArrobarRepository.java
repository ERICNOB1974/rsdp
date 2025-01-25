package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Usuario;
import unpsjb.labprog.backend.model.DTO.UsuarioEsAmigoDTO;

@Repository
public interface ArrobarRepository extends Neo4jRepository<Usuario, Long> {

        @Query("""
                        MATCH (emisor:Usuario) WHERE id(emisor)=$idUsuario
                        MATCH (etiquetado:Usuario) WHERE id(etiquetado)=$idEtiquetado
                        MATCH (p:Publicacion) WHERE id(p) = $idPublicacion
                        CREATE (emisor)-[r:ARROBA_PUBLICACION {
                        idPublicacion: $idPublicacion }]->(etiquetado)
                        """)
        void etiquetarEnPublicacion(Long idUsuario, Long idEtiquetado, Long idPublicacion);

        @Query("""
                        MATCH (emisor:Usuario) WHERE id(emisor)=$idUsuario
                        MATCH (etiquetado:Usuario) WHERE id(etiquetado)=$idEtiquetado
                        MATCH (c:Comentario) WHERE id(c) = $idComentario
                        CREATE (emisor)-[r:ARROBA_COMENTARIO {
                        idComentario: $idComentario }]->(etiquetado)
                        """)
        void etiquetarEnComentario(Long idUsuario, Long idEtiquetado, Long idComentario);

        @Query("""
                        MATCH (yo:Usuario) WHERE id(yo) = $idUsuario
                        MATCH (u:Usuario)
                        WHERE (u.nombreUsuario CONTAINS $termino OR u.nombreReal CONTAINS $termino)
                        AND id(u) <> $idUsuario
                        OPTIONAL MATCH (yo)-[:ES_AMIGO_DE]-(u)
                        OPTIONAL MATCH (yo)-[r:ARROBA_PUBLICACION|ARROBA_COMENTARIO]->(u)
                        WITH u,
                             EXISTS((yo)-[:ES_AMIGO_DE]-(u)) AS esAmigo,
                             COUNT(r) AS cantidadEtiquetas
                        RETURN u AS usuario, esAmigo

                        ORDER BY esAmigo DESC,
                                 cantidadEtiquetas DESC
                        """)
        List<UsuarioEsAmigoDTO> buscarUsuariosPorTerminoOrdenados(Long idUsuario, String termino);


        @Query("""
                MATCH ()-[r:ARROBA_PUBLICACION {idPublicacion:$idPublicacion}]-()
                DETACH DELETE r 
                """)
        void eliminarArrobaPublicacion(Long idPublicacion);

}
