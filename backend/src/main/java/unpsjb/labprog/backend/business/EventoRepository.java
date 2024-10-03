package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

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
        "WITH e2, etiquetasComunes, point.distance(eventoUbicacion, usuarioUbicacion) AS distancia, " +
        "(0.85 * etiquetasComunes + 0.15 * (250 / sqrt(distancia + 85))) AS score " +
        "OPTIONAL MATCH (e2)<-[:PARTICIPA_EN]-(participante:Usuario) " +  // Contamos la cantidad de participantes
        "WITH e2, score, COUNT(DISTINCT participante) AS cantidadParticipantes " +
        "WHERE cantidadParticipantes < e2.cantidadMaximaParticipantes " +  // Verificamos que haya cupos disponibles
        "RETURN e2 " +
        "ORDER BY score DESC, e2.fechaHora ASC " +
        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnEventos(String nombreUsuario);
 
        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(:Rutina)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) " +
        "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
        "AND NOT (u)<-[:CREADO_POR]-(ev) " +
        "AND NOT ev.esPrivadoParaLaComunidad " +
        "WITH ev, COUNT(DISTINCT e) AS etiquetasCompartidas, " +
        "point({latitude: ev.latitud, longitude: ev.longitud}) AS eventoUbicacion, " +
        "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion, " +
        "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " +
        "WITH ev, etiquetasCompartidas, distancia, " +
        "(0.85 * etiquetasCompartidas + 0.15 * (377 / sqrt(distancia + 85))) AS score " +
        "OPTIONAL MATCH (ev)<-[:PARTICIPA_EN]-(participante:Usuario) " +  // Contamos la cantidad de participantes
        "WITH ev, score, COUNT(DISTINCT participante) AS cantidadParticipantes " +
        "WHERE cantidadParticipantes < ev.cantidadMaximaParticipantes " +  // Verificamos que haya cupos disponibles
        "AND ev.fechaHora > datetime() + duration({hours: 1}) " +
        "RETURN ev " +
        "ORDER BY score DESC, ev.fechaHora ASC " +
        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnRutinas(String nombreUsuario);

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
        "MATCH (amigo)-[:PARTICIPA_EN]->(eventoAmigo:Evento) " +
        "MATCH (eventoAmigo)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta) " +
        "WHERE NOT eventoAmigo.esPrivadoParaLaComunidad " +
        "WITH etiqueta, u, COLLECT(DISTINCT amigo) AS amigos " +
        "MATCH (evento:Evento)-[:ETIQUETADO_CON]->(etiqueta) " +
        "WHERE NOT evento.esPrivadoParaLaComunidad " +
        "WITH u, evento, COUNT(etiqueta) AS coincidencias, amigos, " +
        "point({latitude: evento.latitud, longitude: evento.longitud}) AS eventoUbicacion, " +
        "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion, " +
        "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " +
        "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(amigo:Usuario) WHERE amigo IN amigos " +
        "WITH u, evento, coincidencias, COUNT(DISTINCT amigo) AS amigosParticipando, distancia, " +
        "(0.85 * coincidencias + 0.15 * (377 / sqrt(distancia + 85))) AS score " +
        "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(participante:Usuario) " +  // Contamos la cantidad de participantes
        "WITH evento, score, amigosParticipando, coincidencias, COUNT(DISTINCT participante) AS cantidadParticipantes " +
        "WHERE cantidadParticipantes < evento.cantidadMaximaParticipantes " +  // Verificamos que haya cupos disponibles
        "AND NOT (u)-[:PARTICIPA_EN]->(evento) " +
        "AND NOT (u)<-[:CREADO_POR]-(evento) " +
        "AND evento.fechaHora > datetime() + duration({hours: 1}) " +
        "RETURN evento " +
        "ORDER BY score DESC, amigosParticipando DESC, coincidencias DESC, evento.fechaHora ASC " +
        "LIMIT 3")
        List<Evento> sugerenciasDeEventosBasadosEnAmigos(String nombreUsuario);
    

        @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(com:Comunidad)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) " +
        "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
        "AND NOT (u)<-[:CREADO_POR]-(ev) " +
        "AND NOT ev.esPrivadoParaLaComunidad " +
        "WITH ev, COUNT(DISTINCT e) AS etiquetasCompartidas, " +
        "point({latitude: ev.latitud, longitude: ev.longitud}) AS eventoUbicacion, " +
        "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion, " +
        "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " +
        "WITH ev, etiquetasCompartidas, distancia, " +
        "(0.85 * etiquetasCompartidas + 0.15 * (377 / sqrt(distancia + 85))) AS score " +
        "OPTIONAL MATCH (ev)<-[:PARTICIPA_EN]-(participante:Usuario) " +  // Contamos la cantidad de participantes
        "WITH ev, score, COUNT(DISTINCT participante) AS cantidadParticipantes " +
        "WHERE cantidadParticipantes < ev.cantidadMaximaParticipantes " +  // Verificamos que haya cupos disponibles
        "AND ev.fechaHora > datetime() + duration({hours: 1}) " +
        "RETURN ev " +
        "ORDER BY score DESC, etiquetasCompartidas DESC, ev.fechaHora ASC " +
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
