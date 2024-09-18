package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Evento;
import java.util.List;

@Repository
public interface EventoRepository extends Neo4jRepository<Evento, Long> {

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(e:Evento)-[:ETIQUETADO_CON]->(et:Etiqueta) "+
        "MATCH (e2:Evento)-[:ETIQUETADO_CON]->(et) "+
        "WHERE NOT (u)-[:PARTICIPA_EN]->(e2) "+
        "WITH e2, count(et) AS etiquetasComunes " +
        "RETURN DISTINCT e2, etiquetasComunes " +
        "ORDER BY etiquetasComunes DESC "+
        "LIMIT 3")
    List<Evento> sugerenciasDeEventosBasadosEnEventos(String nombreUsuario);
}
