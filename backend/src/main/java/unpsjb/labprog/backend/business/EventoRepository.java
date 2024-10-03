package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

@Repository
public interface EventoRepository extends Neo4jRepository<Evento, Long> {

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(e:Evento)-[:ETIQUETADO_CON]->(et:Etiqueta) " +
        "MATCH (e2:Evento)-[:ETIQUETADO_CON]->(et) " +
        "WHERE NOT (u)-[:PARTICIPA_EN]->(e2) " +
        "AND NOT (u)<-[:CREADO_POR]-(e2) " +
        "AND NOT e2.esPrivadoParaLaComunidad " +
        "WITH e2, COUNT(DISTINCT et) AS etiquetasComunes, " +
        "point({latitude: e2.latitud, longitude: e2.longitud}) AS eventoUbicacion, " +
        "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion " +
        "WITH e2, etiquetasComunes, point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " +
 
        // Aplicar la fórmula ajustada con las variables correctamente pasadas
        "WITH e2, etiquetasComunes, distancia, " +
        "(0.85 * etiquetasComunes + 0.15 * (250 / sqrt(distancia + 1000))) AS score " +
 
        // Ordenar por el score calculado
        "RETURN e2 " +
        "ORDER BY score DESC, e2.fechaHora ASC " +
        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnEventos(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(:Rutina)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
                        + "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) "
                        + "AND NOT (u)<-[:CREADO_POR]-(ev) "
                        + "AND NOT ev.esPrivadoParaLaComunidad "
                        + "WITH ev, count(e) as etiquetasCompartidas " +
                        "WHERE ev.fechaHora > datetime() + duration({hours: 1}) "
                        + "RETURN ev "
                        + "ORDER BY etiquetasCompartidas DESC, ev.fechaHora ASC "
                        + "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnRutinas(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
                        "MATCH (amigo)-[:PARTICIPA_EN]->(eventoAmigo:Evento) " +
                        "MATCH (eventoAmigo)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta) " +
                        "WHERE NOT eventoAmigo.esPrivadoParaLaComunidad " +
                        "WITH etiqueta, u, COLLECT(DISTINCT amigo) AS amigos " + // Recopilamos amigos únicos
                        "MATCH (evento:Evento)-[:ETIQUETADO_CON]->(etiqueta) " +
                        "WHERE NOT evento.esPrivadoParaLaComunidad " +
                        "WITH u, evento, COUNT(etiqueta) AS coincidencias, amigos " +
                        "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(amigo:Usuario) WHERE amigo IN amigos  " +
                        "WITH u, evento, coincidencias, COUNT(DISTINCT amigo) AS amigosParticipando, evento.fechaHora AS fechaHora "
                        +
                        "WHERE NOT (u)-[:PARTICIPA_EN]->(evento) " +
                        "AND NOT (u)<-[:CREADO_POR]-(evento) " +
                        "AND evento.fechaHora > datetime() + duration({hours: 1}) " +
                        "RETURN evento " +
                        "ORDER BY amigosParticipando DESC, coincidencias DESC,  fechaHora ASC " + // Orden final
                        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnAmigos(String nombreUsuario);

        /*
         * @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(com:Comunidad)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
         * +
         * "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
         * "AND NOT (u)<-[:CREADO_POR]-(ev) " +
         * "AND NOT ev.esPrivadoParaLaComunidad " +
         * "WITH ev, count(DISTINCT e) as etiquetasCompartidas, " +
         * "(toLower(com.ubicacion) = toLower(ev.ubicacion) OR toLower(com.ubicacion) CONTAINS toLower(ev.ubicacion) OR toLower(ev.ubicacion) CONTAINS toLower(com.ubicacion)) AS ubicacionCoincide "
         * +
         * "RETURN ev " +
         * "ORDER BY ubicacionCoincide DESC, etiquetasCompartidas DESC, ev.fechaHora ASC "
         * +
         * "LIMIT 3")
         * List<Evento> sugerenciasDeEventosBasadosEnComunidades(String nombreUsuario);
         */

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(com:Comunidad)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
                        +
                        "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
                        "AND NOT (u)<-[:CREADO_POR]-(ev) " +
                        "AND NOT ev.esPrivadoParaLaComunidad " +
                        "WITH ev, " +
                        "     COUNT(DISTINCT e) AS etiquetasCompartidas, " +
                        "     (toLower(com.ubicacion) = toLower(ev.ubicacion) OR " +
                        "      toLower(com.ubicacion) CONTAINS toLower(ev.ubicacion) OR " +
                        "      toLower(ev.ubicacion) CONTAINS toLower(com.ubicacion)) AS ubicacionCoincide " +
                        " WHERE ev.fechaHora > datetime() + duration({hours: 1}) " +
                        "RETURN ev AS evento,  etiquetasCompartidas, " + //
                        "       MAX(ubicacionCoincide) AS ubicacionCoincide  " +
                        "ORDER BY ubicacionCoincide DESC, etiquetasCompartidas DESC, evento.fechaHora ASC " +
                        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnComunidades(String nombreUsuario);

        @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]->(e:Evento)" +
                        "WHERE id(e) = $idEvento " +
                        "RETURN COUNT(DISTINCT u) AS totalParticipaciones")
        int participantesDeEvento(Long idEvento);

        @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]->(e:Evento)" +
                        "WHERE id(e) = $idEvento " +
                        "RETURN u")
        List<Usuario> inscriptosEvento(Long idEvento);

        @Query("MATCH (e:Evento) " +
                        "WHERE date(e.fechaHora) = date(datetime()) + duration({days: 1}) " +
                        " RETURN e ORDER BY e.fechaHora ASC")
        List<Evento> eventosProximos();

        @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]->(e:Evento) " +
                        "WHERE id(u) = $idUsuario AND id(e) = $idEvento " +
                        "RETURN COUNT(e) > 0")
        boolean participa(Long idUsuario, Long idEvento);

        @Query("MATCH (e:Evento) " +
                        " WHERE (u)-[:MIEMBRO]->(c:Comunidad)<-[ORGANIZADO_POR]-(e)" +
                        " RETURN COUNT(c)>0")
        boolean esOrganizadoPorComunidad(Evento e);

}
