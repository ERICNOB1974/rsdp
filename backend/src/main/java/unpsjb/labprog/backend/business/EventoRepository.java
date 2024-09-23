package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Evento;

@Repository
public interface EventoRepository extends Neo4jRepository<Evento, Long> {

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(e:Evento)-[:ETIQUETADO_CON]->(et:Etiqueta) "
                        +
                        "MATCH (e2:Evento)-[:ETIQUETADO_CON]->(et) " +
                        "WHERE NOT (u)-[:PARTICIPA_EN]->(e2) " +
                        "WITH e2, count(et) AS etiquetasComunes " +
                        "RETURN DISTINCT e2, etiquetasComunes " +
                        "ORDER BY etiquetasComunes DESC, e2.fechaHora ASC " +
                        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnEventos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(:Rutina)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
                        + "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) "
                        + "AND NOT (u)<-[:CREADO_POR]-(ev) " // Asegurarse de que el usuario no creó el evento
                        + "WITH ev, count(e) as etiquetasCompartidas "
                        + "RETURN ev "
                        + "ORDER BY etiquetasCompartidas DESC, ev.fechaHora ASC "
                        + "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnRutinas(String nombreUsuario);

        // no listo
        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario)<-[:PARTICIPA_EN]-(evento:Evento)-[ETIQUETADO_CON]->(etiqueta:Etiqueta) "
                        +
                        "WHERE NOT (u)-[:PARTICIPA_EN]-(evento) " +
                        "WITH evento, COUNT(etiqueta) AS etiquetasEnComun " +
                        "RETURN ev " +
                        "ORDER BY etiquetasEnComun DESC")
        List<Evento> sugerenciasDeEventosBasadosEnAmigosVersion1(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
                        "MATCH (amigo)-[:PARTICIPA_EN]->(eventoAmigo:Evento) " +
                        "MATCH (eventoAmigo)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT (u)-[:PARTICIPA_EN]->(eventoAmigo) " +
                        "WITH etiqueta, u, COLLECT(DISTINCT amigo) AS amigos " + // Recopilamos amigos únicos
                        "MATCH (evento:Evento)-[:ETIQUETADO_CON]->(etiqueta) " +
                        "WHERE NOT (u)-[:PARTICIPA_EN]->(evento) " +
                        "AND NOT (u)<-[:CREADO_POR]-(evento) " + // Excluimos eventos en los que participa o ha creado
                                                                 // el usuario
                        "WITH evento, COUNT(etiqueta) AS coincidencias, amigos " +
                        "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(amigo:Usuario) WHERE amigo IN amigos  " + // Verificamos
                                                                                                             // si algún
                                                                                                             // amigo
                                                                                                             // está
                                                                                                             // participando
                                                                                                             // en este
                                                                                                             // evento
                        "WITH evento, coincidencias, COUNT(DISTINCT amigo) AS amigosParticipando, evento.fechaHora AS fechaHora "
                        + // Contamos amigos únicos que participan
                        "RETURN evento " +
                        "ORDER BY amigosParticipando DESC, coincidencias DESC, fechaHora ASC " + // Orden final
                        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnAmigos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(:Comunidad)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
                        +
                        "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
                        "WITH ev, count(e) as etiquetasCompartidas " +
                        "RETURN ev " +
                        "ORDER BY etiquetasCompartidas DESC, ev.fechaHora ASC " +
                        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnComunidades(String nombreUsuario);

}
