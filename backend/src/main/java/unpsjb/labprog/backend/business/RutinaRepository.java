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
                        "ORDER BY cantidad DESC")
        List<Rutina> sugerenciasDeRutinasBasadosEnEventos(String nombreUsuario);


}
