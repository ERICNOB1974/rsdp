package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Rutina;

@Repository
public interface RutinaRepository extends Neo4jRepository<Rutina, Long> {

    // Buscar rutinas por nombre
    List<Rutina> findByNombre(String nombre);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento)-[:PARTICIPA_EN]->(participantes:Usuario)-[:REALIZA_RUTINA]->(r:Rutina) "
            +
            "WHERE NOT (u)-[:REALIZA_RUTINA]->(r) " +
            "WITH r, count(participantes) as cantidad " +
            "RETURN r " +
            "ORDER BY cantidad DESC " +
            "LIMIT 3")
    List<Rutina> sugerenciasDeRutinasBasadosEnEventos(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]->(amigo:Usuario) " +
            "MATCH (amigo)-[:REALIZA_RUTINA]->(rutina:Rutina) " +
            "WHERE NOT (u)-[:REALIZA_RUTINA]->(rutina) " + // Excluimos las rutinas que realiza lucas
            "WITH rutina, COUNT(amigo) AS popularidad " + // Contamos cuántos amigos realizan la rutina
            "RETURN rutina " +
            "ORDER BY popularidad DESC " + // Ordenamos por popularidad, de mayor a menor
            "LIMIT 3")
    List<Rutina> sugerenciasDeRutinasBasadosEnAmigos(String nombreUsuario);

   
    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[PARTICIPA_EN]->(eventos:Evento) "+
    " MATCH (eventos)-[:ETIQUETADO_CON]->(etiquetas:Etiqueta)"+
    " MATCH (rutinas:Rutina)-[:ETIQUETADA_CON]->(etiquetas) "+
    " WHERE NOT (u)-[:REALIZA_RUTINA]->(rutinas) " +
    " COUNT (etiquetas) as etiquetasEnComun "+
    " ORDER BY etiquetasEnComun "+
    " LIMIT 3")
    List<Rutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(String nombreUsuario);

}
