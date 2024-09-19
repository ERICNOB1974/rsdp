package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Evento;

@Repository
public interface EventoRepository extends Neo4jRepository<Evento, Long> {

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(e:Evento)-[:ETIQUETADO_CON]->(et:Etiqueta) "
            +
            "MATCH (e2:Evento)-[:ETIQUETADO_CON]->(et) " +
            "WHERE NOT (u)-[:PARTICIPA_EN]->(e2) " +
            "WITH e2, count(et) AS etiquetasComunes " +
            "RETURN DISTINCT e2, etiquetasComunes " +
            "ORDER BY etiquetasComunes DESC " +
            "LIMIT 3")
    List<Evento> sugerenciasDeEventosBasadosEnEventos(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(:Rutina)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
            +
            "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
            "WITH ev, count(e) as etiquetasCompartidas " +
            "RETURN ev " +
            "ORDER BY etiquetasCompartidas DESC, ev.fechaHora ASC " +
            "LIMIT 3")
    List<Evento> sugerenciasDeEventosBasadosEnRutinas(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario)<-[:PARTICIPA_EN]-(evento:Evento)-[ETIQUETADO_CON]->(etiqueta:Etiqueta) "
            +
            "WHERE NOT (u)-[:PARTICIPA_EN]-(evento) " +
            "WITH evento, COUNT(amigo) AS amigosEnComun " +
            "RETURN evento " +
            "ORDER BY amigosEnComun DESC")
    List<Comunidad> sugerenciasDeEventosBasadosEnAmigos(String nombreUsuario);


}
