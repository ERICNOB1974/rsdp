package unpsjb.labprog.backend.business;


import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Usuario;


@Repository
public interface ArrobarRepository extends Neo4jRepository<Usuario, Long> {


    @Query("""
            MATCH (emisor:Usuario) WHERE id(emisor)=$idUsuario
            MATCH (etiquetado:Usuario) WHERE id(etiquetado)=$idEtiquetado
            MATCH (p:Publicacion) WHERE id(p) = $idPublicacion
            CREATE (emisor)-[r:ETIQUETA_PUBLICACION {
            idPublicacion: $idPublicacion }]->(etiquetado)
            """)
    void etiquetarEnPublicacion(Long idUsuario, Long idEtiquetado, Long idPublicacion);

    @Query("""
            MATCH (emisor:Usuario) WHERE id(emisor)=$idUsuario
            MATCH (etiquetado:Usuario) WHERE id(etiquetado)=$idEtiquetado
            MATCH (c:Comentario) WHERE id(c) = $idComentario
            CREATE (emisor)-[r:ETIQUETA_COMENTARIO {
            idComentario: $idComentario }]->(etiquetado)
            """)
    void etiquetarEnComentario(Long idUsuario, Long idEtiquetado, Long idComentario);

}
