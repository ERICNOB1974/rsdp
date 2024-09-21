package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Rutina;

import java.util.List;

@Repository
public interface RutinaRepository extends Neo4jRepository<Rutina, Long> {

    // Buscar rutinas por nombre
    List<Rutina> findByNombre(String nombre);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:REALIZA_RUTINA]->(rc:Rutina)-[:ETIQUETADA_CON]->(etiqueta:Etiqueta) " +
           "WITH u, collect(DISTINCT etiqueta) AS etiquetasUsuario " +
           "MATCH (r:Rutina)-[:ETIQUETADA_CON]->(etiqueta) " +
           "WHERE etiqueta IN etiquetasUsuario AND NOT EXISTS { " +
           "    MATCH (u)-[:REALIZA_RUTINA]->(r) " +
           "} " +
           "WITH r, COUNT(DISTINCT etiqueta) AS etiquetasEnComun " +
           "RETURN r " +
           "ORDER BY etiquetasEnComun DESC " +
           "LIMIT 3")
    List<Rutina> sugerenciasDeRutinasBasadasEnRutinas(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:MIEMBRO]->(comunidad:Comunidad) " +
       "MATCH (comunidad)<-[:MIEMBRO]-(miembro:Usuario)-[:REALIZA_RUTINA]->(r:Rutina) " +
       "WHERE NOT EXISTS { " +
       "    MATCH (u)-[:REALIZA_RUTINA]->(r) " +
       "} " +
       "WITH r, COUNT(DISTINCT miembro) AS popularidad " +
       "RETURN r " +
       "ORDER BY popularidad DESC " + 
       "LIMIT 3")
    List<Rutina> sugerenciasDeRutinasBasadasEnComunidades(String nombreUsuario);


}
