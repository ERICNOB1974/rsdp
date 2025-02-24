package unpsjb.labprog.backend.business;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

@Repository
public interface EventoRepository extends Neo4jRepository<Evento, Long> {

       @Query("MATCH (evento:Evento) WHERE id(evento) = $idEvento RETURN evento.genero")
       String generoDeUnEvento(Long idEvento);

       @Query("MATCH (evento:Evento) WHERE id(evento) = $id AND evento.eliminado = false RETURN evento")
       Optional<Evento> findById(Long id);  

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(e:Evento)-[:ETIQUETADO_CON]->(et:Etiqueta) "
                     +
                     "MATCH (e2:Evento)-[:ETIQUETADO_CON]->(et) " +
                     "WHERE NOT (u)-[:PARTICIPA_EN]->(e2) " +
                     "AND NOT (u)<-[:CREADO_POR]-(e2) " +
                     "AND NOT e2.esPrivadoParaLaComunidad " +
                     "AND (e2.eliminado = false OR e2.eliminado = true) " +
                     "WITH e2, COUNT(DISTINCT et) AS etiquetasComunes, " +
                     "point({latitude: e2.latitud, longitude: e2.longitud}) AS eventoUbicacion, " +
                     "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion " +
                     "WITH e2, etiquetasComunes, eventoUbicacion, usuarioUbicacion, " +
                     "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " + // Definir distancia
                     "WITH e2, etiquetasComunes, distancia, " +
                     "(etiquetasComunes/(distancia+1500000)) AS score " +
                     "OPTIONAL MATCH (e2)<-[:PARTICIPA_EN]-(participante:Usuario) " +
                     "WITH e2, score, COUNT(DISTINCT participante) AS cantidadParticipantes " +
                     "WHERE cantidadParticipantes < e2.cantidadMaximaParticipantes " +
                     "AND e2.fechaHora > datetime() + duration({hours: 1}) " +
                     "AND e2.eliminado = false" +
                     "RETURN e2 " +
                     "ORDER BY score DESC, e2.fechaHora ASC " +
                     "LIMIT 3")
       List<Evento> sugerenciasDeEventosBasadosEnEventos(String nombreUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(:Rutina)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
                     +
                     "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
                     "AND NOT (u)<-[:CREADO_POR]-(ev) " +
                     "AND NOT ev.esPrivadoParaLaComunidad " +
                     "AND (ev.eliminado = false OR ev.eliminado = true) " +
                     "WITH ev, COUNT(DISTINCT e) AS etiquetasCompartidas, " +
                     "point({latitude: ev.latitud, longitude: ev.longitud}) AS eventoUbicacion, " +
                     "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion " +
                     "WITH ev, etiquetasCompartidas, eventoUbicacion, usuarioUbicacion, " +
                     "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " + // Definir distancia
                     "WITH ev, etiquetasCompartidas, distancia, " +
                     "(etiquetasCompartidas/(distancia+1500000)) AS score " +
                     "OPTIONAL MATCH (ev)<-[:PARTICIPA_EN]-(participante:Usuario) " +
                     "WITH ev, score, COUNT(DISTINCT participante) AS cantidadParticipantes " +
                     "WHERE cantidadParticipantes < ev.cantidadMaximaParticipantes " +
                     "AND ev.fechaHora > datetime() + duration({hours: 1}) " +
                     "AND ev.eliminado = false " +
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
                     "AND (evento.eliminado = false OR evento.eliminado = true) " +
                     "WITH evento, COUNT(etiqueta) AS coincidencias, amigos, " +
                     "point({latitude: evento.latitud, longitude: evento.longitud}) AS eventoUbicacion, " +
                     "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion, u " + // Pasamos 'u'
                                                                                                     // aquí
                     "WITH evento, coincidencias, amigos, eventoUbicacion, usuarioUbicacion, " +
                     "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia, u " + // No reintroducimos 'u'
                     "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(amigo:Usuario) WHERE amigo IN amigos " +
                     "WITH evento, coincidencias, COUNT(DISTINCT amigo) AS amigosParticipando, distancia, u, " +
                     "(coincidencias/(distancia+1500000)) AS score " +
                     "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(participante:Usuario) " +
                     "WITH evento, score, amigosParticipando, coincidencias, COUNT(DISTINCT participante) AS cantidadParticipantes, u "
                     +
                     "WHERE cantidadParticipantes < evento.cantidadMaximaParticipantes " +
                     "AND NOT (u)-[:PARTICIPA_EN]->(evento) " +
                     "AND NOT (u)<-[:CREADO_POR]-(evento) " +
                     "AND evento.fechaHora > datetime() + duration({hours: 1}) " +
                     "AND evento.eliminado = false " +
                     "RETURN evento " +
                     "ORDER BY score DESC, amigosParticipando DESC, evento.fechaHora ASC " +
                     "LIMIT 3")
       List<Evento> sugerenciasDeEventosBasadosEnAmigos(String nombreUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(com:Comunidad)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(ev:Evento) "
                     +
                     "WHERE NOT (u)-[:PARTICIPA_EN]->(ev) " +
                     "AND NOT (u)<-[:CREADO_POR]-(ev) " +
                     "AND NOT ev.esPrivadoParaLaComunidad " +
                     "AND (ev.eliminado = false OR ev.eliminado = true) " +
                     "WITH ev, COUNT(DISTINCT e) AS etiquetasCompartidas, " +
                     "point({latitude: ev.latitud, longitude: ev.longitud}) AS eventoUbicacion, " +
                     "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion " +
                     "WITH ev, etiquetasCompartidas, eventoUbicacion, usuarioUbicacion, " +
                     "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " +
                     "WITH ev, etiquetasCompartidas, distancia, " +
                     "(etiquetasCompartidas/(distancia+1500000)) AS score " +
                     "OPTIONAL MATCH (ev)<-[:PARTICIPA_EN]-(participante:Usuario) " + // Contamos la cantidad de
                                                                                      // participantes
                     "WITH ev, score, etiquetasCompartidas, COUNT(DISTINCT participante) AS cantidadParticipantes " +
                     "WHERE cantidadParticipantes < ev.cantidadMaximaParticipantes " + // Verificamos que haya cupos
                                                                                       // disponibles
                     "AND ev.fechaHora > datetime() + duration({hours: 1}) " +
                     "AND ev.eliminado = false " +
                     "RETURN ev " +
                     "ORDER BY score DESC, ev.fechaHora ASC " +
                     "LIMIT 3")
       List<Evento> sugerenciasDeEventosBasadosEnComunidades(String nombreUsuario);

       @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]-(e:Evento)" +
                     "WHERE id(e) = $idEvento " +
                     "RETURN COUNT(DISTINCT u) AS totalParticipaciones")
       int participantesDeEvento(Long idEvento);

       @Query("MATCH (e:Evento)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "WHERE id(c) = $comunidadId AND NOT e.eliminado " +
                     "RETURN e")
       List<Evento> eventosDeUnaComunidad(Long comunidadId);

       @Query("MATCH (e:Evento) " +
                     "WHERE date(e.fechaHora) = date(datetime()) + duration({days: 1}) " +
                     "AND NOT e.eliminado " +
                     "RETURN e ORDER BY e.fechaHora ASC")
       List<Evento> eventosProximos();

       @Query("MATCH (e:Evento)-[:CREADO_POR]->(u:Usuario) " +
                     "WHERE id(u) = $idUsuario AND NOT e.eliminado " +
                     "RETURN e " +
                     "ORDER BY abs(duration.between(date(), e.fechaHora).days) ASC " +
                     "SKIP $offset LIMIT $limit")
       List<Evento> eventosCreadosPorUsuario(@Param("idUsuario") Long idUsuario,
                     @Param("offset") int offset,
                     @Param("limit") int limit);

       @Query("MATCH (u:Usuario)-[r:CREADO_POR]-(e:Evento) " +
                     "WHERE id(u) = $idUsuario " +
                     "AND (toLower(e.nombre) CONTAINS toLower($nombreEvento) OR $nombreEvento = '') " +
                     "AND e.eliminado = false " +
                     "RETURN e ORDER BY abs(duration.between(date(), e.fechaHora).days) ASC, e.nombre DESC " +
                     "SKIP $skip " +
                     "LIMIT $limit")
       List<Evento> eventosCreadosPorUsuarioFiltrados(@Param("idUsuario") Long idUsuario,
                     @Param("nombreEvento") String nombreEvento,
                     @Param("skip") int skip,
                     @Param("limit") int limit);

       @Query("""
                     MATCH (e:Evento) WHERE id(e)=$idEvento
                     MATCH (u:Usuario) WHERE id(u) = $idUsuario
                     MATCH (e)-[r:CREADO_POR]->(u)
                     RETURN (COUNT(r)>0)
                             """)
       boolean eventoCreadoPor(@Param("idUsuario") Long idUsuario,
                     @Param("idEvento") Long idEvento);

       @Query("MATCH (u:Usuario)-[r:PARTICIPA_EN]->(e:Evento) " +
                     "WHERE id(u) = $idUsuario AND id(e) = $idEvento " +
                     "RETURN COUNT(r) > 0")
       boolean participa(Long idUsuario, Long idEvento);

       @Query("MATCH (e:Evento), (c:Comunidad) " +
                     " WHERE (c)<-[:ORGANIZADO_POR]-(e)" +
                     " AND id($ev)=e.id" +
                     " RETURN COUNT(c)>0")
       boolean esOrganizadoPorComunidad(Evento ev);

       @Query("MATCH (e:Evento) " +
                     "WHERE (u)-[:MIEMBRO]->(c:Comunidad)<-[ORGANIZADO_POR]-(e) " +
                     "WHERE date(e.fechaHora) = date(datetime()) - duration({days: 1}) AND NOT e.eliminado " +
                     "RETURN e ORDER BY e.fechaHora ASC")
       List<Evento> eventosNuevosComunidad(Usuario u);

       @Query("MATCH (e:Evento), (u:Usuario) " +
                     "WHERE id(u) = $idUsuario AND id(e) = $idEvento " +
                     "MERGE (e)-[:CREADO_POR]->(u)")
       void establecerCreador(Long idEvento, Long idUsuario);

       @Query("MATCH (e:Evento), (c:Comunidad) " +
                     "WHERE id(e) = $idEvento AND id(c) = $comunidadId " +
                     "MERGE (e)-[:EVENTO_INTERNO]->(c)")
       void establecerEventoInterno(Long idEvento, Long comunidadId);

       @Query("MATCH (e:Evento) WHERE id(e) = $ide AND NOT e.eliminado RETURN e")
       Optional<Evento> encontrarEventoPorId(Long ide);

       @Query("MATCH (e:Evento), (t:Etiqueta) " +
                     "WHERE id(e) = $eventoId AND id(t) = $etiquetaId " +
                     "MERGE (e)-[:ETIQUETADO_CON]->(t)")
       void etiquetarEvento(Long eventoId, Long etiquetaId);

       @Query("MATCH (u:Usuario) WHERE id(u)=$idUsuario " +
                     "MATCH (e:Evento) WHERE id(e)=$idEvento " +
                     " MATCH (u)-[r:PARTICIPA_EN]->(e) DELETE r")
       void desinscribirse(Long idEvento, Long idUsuario);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta) " +
                     "WITH u, e, collect(etiqueta.nombre) AS etiquetasEvento " +

                     "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasEvento) " +
                     "AND NOT EXISTS { MATCH (u)-[:PARTICIPA_EN|CREADO_POR]-(e) } " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "AND (" +
                     "    NOT e.esPrivadoParaLaComunidad OR " + // Si no es privado, se muestra siempre
                     "    EXISTS { " +
                     "        MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "        MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c) " +
                     "    } " + // Si es privado, solo se muestra si el usuario es parte de la comunidad
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC ")
       List<Evento> eventosEtiquetasDisponibles(@Param("usuarioId") Long usuarioId,
                     @Param("etiquetas") List<String> etiquetas);

       @Query("MATCH (e:Evento)<-[:PARTICIPA_EN]-(u:Usuario), (e)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta) " +
                     "WHERE id(u) = $usuarioId " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "WITH u, e, collect(etiqueta.nombre) AS etiquetasEvento " +
                     "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasEvento) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC ")
       List<Evento> eventosEtiquetasParticipante(Long usuarioId, @Param("etiquetas") List<String> etiquetas);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta) " +
                     "WITH u, e, collect(etiqueta.nombre) AS etiquetasEvento, u " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "WHERE ALL(etiquetaBuscada IN $etiquetas WHERE etiquetaBuscada IN etiquetasEvento) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC ")
       List<Evento> eventosEtiquetas(@Param("etiquetas") List<String> etiquetas, @Param("usuarioId") Long usuarioId);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento) " +
                     "WHERE toUpper(e.nombre) CONTAINS toUpper($nombre) " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND NOT EXISTS { " +
                     "  MATCH (u)-[:PARTICIPA_EN|CREADO_POR]-(e) " +
                     "  WHERE NOT (u)-[:EXPULSADO_EVENTO]-(e) " +
                     "} " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "AND (" +
                     "    NOT e.esPrivadoParaLaComunidad OR " + // Si no es privado, se muestra siempre
                     "    EXISTS { " +
                     "        MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "        MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c) " +
                     "    } " + // Si es privado, solo se muestra si el usuario es parte de la comunidad
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC, e.nombre ASC ")
       List<Evento> eventosNombreDisponibles(String nombre, Long usuarioId);

       @Query("MATCH (e:Evento)<-[:PARTICIPA_EN]-(u:Usuario) " +
                     "WHERE id(u) = $usuarioId AND toUpper(e.nombre) CONTAINS toUpper($nombre) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC ")
       List<Evento> eventosNombreParticipante(String nombre, Long usuarioId);

       @Query("MATCH (u:Usuario) WHERE id(u) = $idUsuario " +
                     "MATCH (e:Evento) " +
                     "WHERE toUpper(e.nombre) CONTAINS toUpper($nombre) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC")
       List<Evento> eventosNombre(@Param("nombre") String nombre, @Param("idUsuario") Long idUsuario);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento) " +
                     "WHERE e.fechaHora >= $fechaInicio AND e.fechaHora <= $fechaFin " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND NOT EXISTS { " +
                     "  MATCH (u)-[:PARTICIPA_EN]-(e) " +
                     "} " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "AND (" +
                     "    NOT e.esPrivadoParaLaComunidad OR " + // Si no es privado, se muestra siempre
                     "    EXISTS { " +
                     "        MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "        MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c) " +
                     "    } " + // Si es privado, solo se muestra si el usuario es parte de la comunidad
                     ") " +
                     "ORDER BY e.fechaHora ASC")
       List<Evento> eventosFechaDisponible(Long usuarioId, @Param("fechaInicio") ZonedDateTime fechaInicio,
                     @Param("fechaFin") ZonedDateTime fechaFin);

       @Query("MATCH (e:Evento)<-[:PARTICIPA_EN]-(u:Usuario) " +
                     "WHERE id(u) = $usuarioId AND e.fechaHora >= $fechaInicio AND e.fechaHora <= $fechaFin " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC")
       List<Evento> eventosFechaParticipante(Long usuarioId, @Param("fechaInicio") ZonedDateTime fechaInicio,
                     @Param("fechaFin") ZonedDateTime fechaFin);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento) " +
                     "WHERE e.fechaHora >= $fechaInicio " +
                     "AND e.fechaHora <= $fechaFin " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC ")
       List<Evento> eventosFecha(@Param("fechaInicio") ZonedDateTime fechaInicio,
                     @Param("fechaFin") ZonedDateTime fechaFin, @Param("usuarioId") Long usuarioId);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento) " +
                     "WHERE e.fechaHora >= $fechaInicio " +
                     "AND NOT EXISTS { " +
                     "  MATCH (u)-[:PARTICIPA_EN]-(e) " +
                     "} " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "AND (" +
                     "    NOT e.esPrivadoParaLaComunidad OR " + // Si no es privado, se muestra siempre
                     "    EXISTS { " +
                     "        MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "        MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c) " +
                     "    } " + // Si es privado, solo se muestra si el usuario es parte de la comunidad
                     ") " +
                     "RETURN e")
       List<Evento> eventosDesdeFechaDisponible(@Param("usuarioId") Long usuarioId,
                     @Param("fechaInicio") ZonedDateTime fechaInicio);

       @Query("MATCH (e:Evento)<-[:PARTICIPA_EN]-(u:Usuario) " +
                     "WHERE id(u) = $usuarioId AND e.fechaHora >= $fechaInicio " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e")
       List<Evento> eventosDesdeFechaParticipante(@Param("usuarioId") Long usuarioId,
                     @Param("fechaInicio") ZonedDateTime fechaInicio);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento) " +
                     "WHERE e.fechaHora >= $fechaInicio " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "AND (" +
                     "    NOT e.esPrivadoParaLaComunidad OR " + // Si no es privado, se muestra siempre
                     "    EXISTS { " +
                     "        MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "        MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c) " +
                     "    } " + // Si es privado, solo se muestra si el usuario es parte de la comunidad
                     ") " +
                     "RETURN e")
       List<Evento> eventosDesdeFecha(@Param("fechaInicio") ZonedDateTime fechaInicio,
                     @Param("usuarioId") Long usuarioId);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento) " +
                     "OPTIONAL MATCH (e)<-[r:PARTICIPA_EN]-(:Usuario) " +
                     "WITH u, e, count(r) AS inscriptos " +
                     "WHERE inscriptos >= $min AND inscriptos <= $max " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC ")
       List<Evento> eventosCantidadParticipantes(int min, int max, Long usuarioId);

       @Query("MATCH (u:Usuario) WHERE id(u) = $usuarioId " +
                     "MATCH (e:Evento) " +
                     "OPTIONAL MATCH (e)<-[r:PARTICIPA_EN]-(:Usuario) " +
                     "WITH u, e, count(r) AS inscriptos " +
                     "WHERE inscriptos >= $min AND inscriptos <= $max " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND NOT EXISTS { " +
                     "  MATCH (u)-[:PARTICIPA_EN]-(e) " +
                     "} " +
                     "AND COALESCE(e.eliminado, false) = false " +

                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "AND (" +
                     "    NOT e.esPrivadoParaLaComunidad OR " + // Si no es privado, se muestra siempre
                     "    EXISTS { " +
                     "        MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "        MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c) " +
                     "    } " + // Si es privado, solo se muestra si el usuario es parte de la comunidad
                     ") " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC "

       )
       List<Evento> eventosCantidadParticipantesDisponible(Long usuarioId, int min, int max);

       @Query("MATCH (e:Evento)<-[:PARTICIPA_EN]-(u:Usuario) " +
                     "WHERE id(u) = $usuarioId " +
                     "MATCH (e) " +
                     "OPTIONAL MATCH (e)<-[r:PARTICIPA_EN]-(:Usuario) " +
                     "WITH u, e, count(r) AS inscriptos " +
                     "WHERE inscriptos >= $min AND inscriptos <= $max " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +

                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC ")
       List<Evento> eventosCantidadParticipantesParticipante(Long usuarioId, int min, int max);

       @Query("MATCH (e:Evento), (u:Usuario {nombreUsuario: $nombreUsuario}) " +
                     "WHERE NOT (e)-[:PARTICIPA_EN]-(u) " +
                     "AND NOT (u)-[:EXPULSADO_EVENTO]-(e) " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND ( " +
                     "    (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR " +
                     "    (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR " +
                     "    (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "AND (" +
                     "    NOT e.esPrivadoParaLaComunidad OR " + // Si no es privado, se muestra siempre
                     "    EXISTS { " +
                     "        MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad) " +
                     "        MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c) " +
                     "    } " + // Si es privado, solo se muestra si el usuario es parte de la comunidad
                     ") " +
                     "WITH e, COUNT { (e)<-[:PARTICIPA_EN]-() } AS numParticipantes " +
                     "WHERE numParticipantes < e.cantidadMaximaParticipantes " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora ASC " +
                     "SKIP $skip " +
                     "LIMIT $limit")
       List<Evento> disponibles(@Param("nombreUsuario") String nombreUsuario,
                     @Param("skip") int skip,
                     @Param("limit") int limit);

       @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]->(e:Evento) " +
                     "WHERE id(u) = $idUsuario " +
                     "AND (toLower(e.nombre) CONTAINS toLower($nombreEvento) OR $nombreEvento = '') " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "RETURN e " +
                     "ORDER BY e.fechaHora DESC " +
                     "SKIP $skip " +
                     "LIMIT $limit")
       List<Evento> participaUsuario(@Param("idUsuario") Long idUsuario, @Param("nombreEvento") String nombreEvento,
                     @Param("skip") int skip,
                     @Param("limit") int limit);

       @Query("MATCH (u:Usuario)-[:PARTICIPA_EN]->(e:Evento) " +
                     "WHERE id(u) = $idUsuario " +
                     "AND (toLower(e.nombre) CONTAINS toLower($nombreEvento) OR $nombreEvento = '') " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "AND date(e.fechaHora) > date(datetime()) " +
                     "WITH e, abs(duration.between(datetime(), e.fechaHora).days) AS diferencia " +
                     "ORDER BY diferencia ASC " +
                     "SKIP $skip " +
                     "LIMIT $limit " +
                     "RETURN e")
       List<Evento> participaUsuarioAFuturo(@Param("idUsuario") Long idUsuario,
                     @Param("nombreEvento") String nombreEvento,
                     @Param("skip") int skip,
                     @Param("limit") int limit);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(e:Evento)-[:ETIQUETADO_CON]->(et:Etiqueta) "
                     + "MATCH (evento:Evento)-[:ETIQUETADO_CON]->(et) "
                     + "WHERE NOT (u)-[:PARTICIPA_EN]->(evento) "
                     + "AND NOT (u)<-[:CREADO_POR]-(evento) "
                     + "AND NOT (u)-[:EXPULSADO_EVENTO]-(evento) "
                     + "AND NOT evento.esPrivadoParaLaComunidad "
                     +"AND ( " 
                     +"    ($generoUsuario = 'masculino' AND evento.genero IN ['masculino', 'sinGenero']) OR " 
                     +"    ($generoUsuario = 'femenino' AND evento.genero IN ['femenino', 'sinGenero']) OR " 
                     +"    ($generoUsuario = 'otro' AND evento.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " 
                     +") " 
                     + "WITH evento, COUNT(DISTINCT et) AS etiquetasComunes, "
                     + "point({latitude: evento.latitud, longitude: evento.longitud}) AS eventoUbicacion, "
                     + "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion "
                     + "WITH evento, etiquetasComunes, eventoUbicacion, usuarioUbicacion, "
                     + "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia "
                     + "WITH evento, etiquetasComunes, distancia, "
                     + "(etiquetasComunes/(distancia+1500000)) AS score "
                     + "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(participante:Usuario) "
                     + "WITH evento, score, etiquetasComunes, COUNT(DISTINCT participante) AS cantidadParticipantes "
                     + "WHERE cantidadParticipantes < evento.cantidadMaximaParticipantes "
                     + "AND evento.fechaHora > datetime() + duration({hours: 1}) "
                     + "AND COALESCE(evento.eliminado, false) = false "
                     + "RETURN evento, score, 'Es similar a los eventos en los que te inscribiste' AS motivo "
                     + "ORDER BY score DESC, evento.fechaHora ASC")
       List<ScoreEvento> sugerenciasDeEventosBasadosEnEventos2(String nombreUsuario, String generoUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo:Usuario) " +
                     "MATCH (amigo)-[:PARTICIPA_EN]->(eventoAmigo:Evento) " +
                     "MATCH (eventoAmigo)-[:ETIQUETADO_CON]->(etiqueta:Etiqueta) " +
                     "WHERE NOT eventoAmigo.esPrivadoParaLaComunidad " +
                     "WITH etiqueta, u, COLLECT(DISTINCT amigo) AS amigos " +
                     "MATCH (evento:Evento)-[:ETIQUETADO_CON]->(etiqueta) " +
                     "WHERE NOT evento.esPrivadoParaLaComunidad " +
                     "AND ( " +
                     "    ($generoUsuario = 'masculino' AND evento.genero IN ['masculino', 'sinGenero']) OR " +
                     "    ($generoUsuario = 'femenino' AND evento.genero IN ['femenino', 'sinGenero']) OR " +
                     "    ($generoUsuario = 'otro' AND evento.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "WITH evento, COUNT(etiqueta) AS coincidencias, amigos, " +
                     "point({latitude: evento.latitud, longitude: evento.longitud}) AS eventoUbicacion, " +
                     "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion, u " + // Pasamos 'u'
                                                                                                     // aquí
                     "WITH evento, coincidencias, amigos, eventoUbicacion, usuarioUbicacion, " +
                     "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia, u " + // No reintroducimos 'u'
                     "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(amigo:Usuario) WHERE amigo IN amigos " +
                     "WITH evento, coincidencias, COUNT(DISTINCT amigo) AS amigosParticipando, distancia, u, " +
                     "(coincidencias/(distancia+1500000)) AS score " +
                     "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(participante:Usuario) " +
                     "WITH evento, score, amigosParticipando, coincidencias, COUNT(DISTINCT participante) AS cantidadParticipantes, u "
                     +
                     "WHERE cantidadParticipantes < evento.cantidadMaximaParticipantes " +
                     "AND NOT (u)-[:PARTICIPA_EN]->(evento) " +
                     "AND NOT (u)<-[:CREADO_POR]-(evento) " +
                     "AND NOT (u)-[:EXPULSADO_EVENTO]-(evento) " +
                     "AND evento.fechaHora > datetime() + duration({hours: 1}) " +
                     "AND COALESCE(evento.eliminado, false) = false " +
                     "RETURN evento, score, 'Es similar con eventos en los que participan tus amigos' AS motivo " +
                     "ORDER BY score DESC, amigosParticipando DESC, evento.fechaHora ASC")
       List<ScoreEvento> sugerenciasDeEventosBasadosEnAmigos2(String nombreUsuario, String generoUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(com:Comunidad)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(evento:Evento) "
                     +
                     "WHERE NOT (u)-[:PARTICIPA_EN]->(evento) " +
                     "AND NOT (u)<-[:CREADO_POR]-(evento) " +
                     "AND NOT (u)-[:EXPULSADO_EVENTO]-(evento) " +
                     "AND NOT evento.esPrivadoParaLaComunidad " +
                     "AND ( " +
                     "    ($generoUsuario = 'masculino' AND evento.genero IN ['masculino', 'sinGenero']) OR " +
                     "    ($generoUsuario = 'femenino' AND evento.genero IN ['femenino', 'sinGenero']) OR " +
                     "    ($generoUsuario = 'otro' AND evento.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "WITH evento, COUNT(DISTINCT e) AS etiquetasCompartidas, " +
                     "point({latitude: evento.latitud, longitude: evento.longitud}) AS eventoUbicacion, " +
                     "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion " +
                     "WITH evento, etiquetasCompartidas, eventoUbicacion, usuarioUbicacion, " +
                     "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " +
                     "WITH evento, etiquetasCompartidas, distancia, " +
                     "(etiquetasCompartidas/(distancia+1500000)) AS score " +
                     "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(participante:Usuario) " + // Contamos la cantidad de
                                                                                          // participantes
                     "WITH evento, score, etiquetasCompartidas, COUNT(DISTINCT participante) AS cantidadParticipantes "
                     +
                     "WHERE cantidadParticipantes < evento.cantidadMaximaParticipantes " + // Verificamos que haya
                                                                                           // cupos
                                                                                           // disponibles
                     "AND evento.fechaHora > datetime() + duration({hours: 1}) " +
                     "AND COALESCE(evento.eliminado, false) = false " +
                     "RETURN evento, score, 'Es similar a las comunidades a las que perteneces' AS motivo  "
                     +
                     "ORDER BY score DESC, evento.fechaHora ASC")
       List<ScoreEvento> sugerenciasDeEventosBasadosEnComunidades2(String nombreUsuario, String generoUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(:Rutina)-[:ETIQUETADA_CON]->(e:Etiqueta)<-[:ETIQUETADO_CON]-(evento:Evento) "
                     +
                     "WHERE NOT (u)-[:PARTICIPA_EN]->(evento) " +
                     "AND NOT (u)<-[:CREADO_POR]-(evento) " +
                     "AND NOT (u)-[:EXPULSADO_EVENTO]-(evento) " +
                     "AND NOT evento.esPrivadoParaLaComunidad " +
                     "AND ( " +
                     "    ($generoUsuario = 'masculino' AND evento.genero IN ['masculino', 'sinGenero']) OR " +
                     "    ($generoUsuario = 'femenino' AND evento.genero IN ['femenino', 'sinGenero']) OR " +
                     "    ($generoUsuario = 'otro' AND evento.genero IN ['masculino', 'femenino', 'otro', 'sinGenero']) " +
                     ") " +
                     "WITH evento, COUNT(DISTINCT e) AS etiquetasCompartidas, " +
                     "point({latitude: evento.latitud, longitude: evento.longitud}) AS eventoUbicacion, " +
                     "point({latitude: u.latitud, longitude: u.longitud}) AS usuarioUbicacion " +
                     "WITH evento, etiquetasCompartidas, eventoUbicacion, usuarioUbicacion, " +
                     "point.distance(eventoUbicacion, usuarioUbicacion) AS distancia " + // Definir distancia
                     "WITH evento, etiquetasCompartidas, distancia, " +
                     "(etiquetasCompartidas/(distancia+1500000)) AS score " +
                     "OPTIONAL MATCH (evento)<-[:PARTICIPA_EN]-(participante:Usuario) " +
                     "WITH evento, score,etiquetasCompartidas, COUNT(DISTINCT participante) AS cantidadParticipantes "
                     +
                     "WHERE cantidadParticipantes < evento.cantidadMaximaParticipantes " +
                     "AND evento.fechaHora > datetime() + duration({hours: 1}) " +
                     "AND COALESCE(evento.eliminado, false) = false " +
                     "RETURN evento, score, 'Es similar a las rutinas que realizas' AS motivo "
                     +
                     "ORDER BY score DESC, evento.fechaHora ASC ")
       List<ScoreEvento> sugerenciasDeEventosBasadosEnRutinas2(String nombreUsuario, String generoUsuario);

       @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN|CREADO_POR]-(e:Evento) " +
                     "WHERE e.fechaHora > datetime() " +
                     "AND COALESCE(e.eliminado, false) = false " +
                     "RETURN DISTINCT e")
       List<Evento> eventosFuturosPertenecientesAUnUsuario(String nombreUsuario);

       @Query("""
                     MATCH (u:Usuario) WHERE id(u)=$idUsuario
                     MATCH (e:Evento) WHERE id(e)=$idEvento
                     MATCH (u)-[r:PARTICIPA_EN]->(e) DELETE r
                     CREATE (u)-[:EXPULSADO_EVENTO {motivoExpulsion: $motivoExpulsion}]->(e)
                                """)
       void eliminarUsuario(Long idEvento, Long idUsuario, String motivoExpulsion);

        @Query("""
            MATCH (e:Evento) WHERE id(e) = $idEvento
            SET e.eliminado = true

            // Eliminar relaciones NOTIFICACION asociadas a usuarios del evento
            WITH e
            MATCH (u:Usuario)-[r:NOTIFICACION]-(e)
            DELETE r

            // Eliminar relaciones INVITACION_EVENTO que contienen el id del evento
            WITH e
            MATCH (u1:Usuario)-[rel:INVITACION_EVENTO]-(u2:Usuario)
            WHERE rel.idEvento = $idEvento
            DELETE rel
            """)
        void eliminar(Long idEvento);


       @Query("""
                     MATCH (u:Usuario) WHERE id(u)=$idUsuario
                     MATCH (e:Evento) WHERE id(e)=$idEvento
                     MATCH (u)-[r:EXPULSADO_EVENTO]-(e)
                     RETURN COUNT(r)>0
                     """)
       boolean estaExpulsado(Long idUsuario, Long idEvento);

       @Query("""
                     MATCH (u:Usuario) WHERE id(u)=$idUsuario
                     MATCH (e:Evento) WHERE id(e)=$idEvento
                     MATCH (u)-[r:EXPULSADO_EVENTO]-(e)
                     RETURN r.motivoExpulsion
                     """)
       String motivoExpulsion(Long idUsuario, Long idEvento);

       @Query("MATCH (ev:Evento)-[r:ETIQUETADO_CON]->(e:Etiqueta) " +
                     "WHERE id(ev) = $idEvento AND id(e) = $etiquetaId " +
                     "DELETE r")
       void desetiquetarEvento(Long idEvento, Long etiquetaId);






    @Query("""
        MATCH (u:Usuario)-[:CREADO_POR]-(e:Evento)
        WHERE id(u) = $idUsuario AND e.eliminado = false
        MATCH (e)-[:ETIQUETADO_CON]->(t:Etiqueta)
        WITH e, t, u, toString(e.fechaHora) AS fechaStr
        WITH e, u, t, datetime(fechaStr) AS fecha
        WHERE (apoc.text.clean(e.nombre) CONTAINS apoc.text.clean($query)
           OR apoc.text.clean(u.nombre) CONTAINS apoc.text.clean($query)
           OR apoc.text.clean(e.ubicacion) CONTAINS apoc.text.clean($query)
           OR apoc.text.clean(e.descripcion) CONTAINS apoc.text.clean($query)
           OR apoc.text.clean(e.genero) CONTAINS apoc.text.clean($query)
           OR apoc.text.clean(t.nombre) CONTAINS apoc.text.clean($query)

           OR toString(datetime(fecha).year) CONTAINS $query

           OR toString(datetime(fecha).month) CONTAINS $query
           OR apoc.text.clean([
               'enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'
             ][datetime(fecha).month-1]) CONTAINS apoc.text.clean($query)

           OR toString(datetime(fecha).day) CONTAINS $query
           OR apoc.text.clean([
               'uno','dos','tres','cuatro','cinco','seis','siete','ocho','nueve','diez','once','doce','trece','catorce','quince',
               'dieciseis','diecisiete','dieciocho','diecinueve','veinte','veintiuno','veintidos','veintitres','veinticuatro',
               'veinticinco','veintiseis','veintisiete','veintiocho','veintinueve','treinta','treinta y uno'
             ][datetime(fecha).day-1]) CONTAINS apoc.text.clean($query)
           OR apoc.text.clean([
               'lunes','martes','miercoles','jueves','viernes','sabado','domingo'
             ][datetime(fecha).dayOfWeek-1]) CONTAINS apoc.text.clean($query)
           OR $query = '')
        WITH e, fecha
        ORDER BY abs(duration.between(date(), fecha).days) ASC, e.nombre DESC
        RETURN DISTINCT e
        SKIP $skip
        LIMIT $limit

                    """)

List<Evento> busquedaEventosCreadosPorUsuarioGoogle(@Param("idUsuario") Long idUsuario,
        @Param("query") String query,
        @Param("skip") int skip,
        @Param("limit") int limit);

@Query("""
        MATCH (e:Evento), (u:Usuario)
        WHERE NOT (e)-[:PARTICIPA_EN]-(u)
        AND NOT (u)-[:EXPULSADO_EVENTO]-(e)
        AND date(e.fechaHora) > date(datetime())
        AND COALESCE(e.eliminado, false) = false
        AND (
            (u.genero = 'masculino' AND e.genero IN ['masculino', 'sinGenero']) OR
            (u.genero = 'femenino' AND e.genero IN ['femenino', 'sinGenero']) OR
            (u.genero = 'otro' AND e.genero IN ['masculino', 'femenino', 'otro', 'sinGenero'])
        )
        AND (
            NOT e.esPrivadoParaLaComunidad OR
            EXISTS {
                MATCH (e)-[:EVENTO_INTERNO]->(c:Comunidad)
                MATCH (u)-[:MIEMBRO|CREADA_POR|ADMINISTRADA_POR|MODERADA_POR]->(c)
            }
        )
        WITH e, u, COUNT { (e)<-[:PARTICIPA_EN]-() } AS numParticipantes
        WHERE numParticipantes < e.cantidadMaximaParticipantes

        MATCH (e)-[:ETIQUETADO_CON]->(t:Etiqueta)
        MATCH (r)-[:CREADO_POR]->(creador:Usuario)
        WITH e, t, u, creador, toString(e.fechaHora) AS fechaStr
        WITH e, t, u, creador, datetime(fechaStr) AS fecha
        WHERE (apoc.text.clean(toLower(e.nombre)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.ubicacion)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.descripcion)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.genero)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(t.nombre)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(creador.nombreUsuario) CONTAINS apoc.text.clean($query)
             OR apoc.text.clean(creador.nombreReal) CONTAINS apoc.text.clean($query)
             OR toString(datetime(fecha).year) CONTAINS $query
             OR toString(datetime(fecha).month) CONTAINS $query
             OR apoc.text.clean(toLower([
                 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
             ][datetime(fecha).month-1])) CONTAINS apoc.text.clean(toLower($query))
             OR toString(datetime(fecha).day) CONTAINS $query
             OR apoc.text.clean(toLower([
                 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
                 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho',
                 'diecinueve', 'veinte', 'veintiuno', 'veintidos', 'veintitres', 'veinticuatro',
                 'veinticinco', 'veintiseis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno'
             ][datetime(fecha).day-1])) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower([
                 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
             ][datetime(fecha).dayOfWeek-1])) CONTAINS apoc.text.clean(toLower($query))
             OR $query = '')
        WITH e, fecha
        ORDER BY abs(duration.between(date(), fecha).days) ASC, e.nombre DESC
        RETURN DISTINCT e
        SKIP $skip
        LIMIT $limit
        """)
List<Evento> busquedaEventosDisponiblesGoogle(@Param("idUsuario") Long idUsuario,
        @Param("query") String query,
        @Param("skip") int skip,
        @Param("limit") int limit);


@Query("""
        MATCH (u:Usuario)-[:PARTICIPA_EN]->(e:Evento)
        WHERE id(u) = $idUsuario
        AND date(e.fechaHora) > date(datetime())
        AND COALESCE(e.eliminado, false) = false
        WITH e, u
        MATCH (e)-[:ETIQUETADO_CON]->(t:Etiqueta)
        MATCH (r)-[:CREADO_POR]->(creador:Usuario)
        WITH e, t, u, creador, toString(e.fechaHora) AS fechaStr
        WITH e, t, u, creador, datetime(fechaStr) AS fecha
        WHERE (apoc.text.clean(toLower(e.nombre)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.ubicacion)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.descripcion)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.genero)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(t.nombre)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(creador.nombreUsuario) CONTAINS apoc.text.clean($query)
             OR apoc.text.clean(creador.nombreReal) CONTAINS apoc.text.clean($query)
             OR toString(datetime(fecha).year) CONTAINS $query
             OR toString(datetime(fecha).month) CONTAINS $query
             OR apoc.text.clean(toLower([
                 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
             ][datetime(fecha).month-1])) CONTAINS apoc.text.clean(toLower($query))
             OR toString(datetime(fecha).day) CONTAINS $query
             OR apoc.text.clean(toLower([
                 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
                 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho',
                 'diecinueve', 'veinte', 'veintiuno', 'veintidos', 'veintitres', 'veinticuatro',
                 'veinticinco', 'veintiseis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno'
             ][datetime(fecha).day-1])) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower([
                 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
             ][datetime(fecha).dayOfWeek-1])) CONTAINS apoc.text.clean(toLower($query))
             OR $query = '')
        WITH e, fecha
        ORDER BY abs(duration.between(date(), fecha).days) ASC, e.nombre DESC
        RETURN DISTINCT e
        SKIP $skip
        LIMIT $limit
        """)
List<Evento> busquedaEventosParticipaFuturoGoogle(@Param("idUsuario") Long idUsuario,
        @Param("query") String query,
        @Param("skip") int skip,
        @Param("limit") int limit);

@Query("""
        MATCH (u:Usuario)-[:PARTICIPA_EN]->(e:Evento)
        WHERE id(u) = $idUsuario
        AND COALESCE(e.eliminado, false) = false
        WITH e, u
        MATCH (e)-[:ETIQUETADO_CON]->(t:Etiqueta)
        MATCH (r)-[:CREADO_POR]->(creador:Usuario)

        WITH e, t, creador, u, toString(e.fechaHora) AS fechaStr
        WITH e, t,creador, u, datetime(fechaStr) AS fecha
        WHERE (apoc.text.clean(toLower(e.nombre)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.ubicacion)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.descripcion)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(e.genero)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower(t.nombre)) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(creador.nombreUsuario) CONTAINS apoc.text.clean($query)
             OR apoc.text.clean(creador.nombreReal) CONTAINS apoc.text.clean($query)
             OR toString(datetime(fecha).year) CONTAINS $query
             OR toString(datetime(fecha).month) CONTAINS $query
             OR apoc.text.clean(toLower([
                 'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
                 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
             ][datetime(fecha).month-1])) CONTAINS apoc.text.clean(toLower($query))
             OR toString(datetime(fecha).day) CONTAINS $query
             OR apoc.text.clean(toLower([
                 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
                 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciseis', 'diecisiete', 'dieciocho',
                 'diecinueve', 'veinte', 'veintiuno', 'veintidos', 'veintitres', 'veinticuatro',
                 'veinticinco', 'veintiseis', 'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno'
             ][datetime(fecha).day-1])) CONTAINS apoc.text.clean(toLower($query))
             OR apoc.text.clean(toLower([
                 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
             ][datetime(fecha).dayOfWeek-1])) CONTAINS apoc.text.clean(toLower($query))
             OR $query = '')
        WITH e, fecha
        ORDER BY abs(duration.between(date(), fecha).days) ASC, e.nombre DESC
        RETURN DISTINCT e
        SKIP $skip
        LIMIT $limit
        """)
List<Evento> busquedaEventosParticipaHistoricoGoogle(@Param("idUsuario") Long idUsuario,
        @Param("query") String query,
        @Param("skip") int skip,
        @Param("limit") int limit);
}
