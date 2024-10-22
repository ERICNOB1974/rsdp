package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Ejercicio;

@Repository
public interface EjercicioRepository extends Neo4jRepository<Ejercicio, Long> {

    @Query("CREATE (e:Ejercicio {nombre: $nombre, descripcion: $descripcion, imagen: $imagen}) RETURN ID(e)")
    Long crearEjercicio(String nombre, String descripcion, String imagen);

    @Query("MATCH (e:Ejercicio) WHERE toUpper(e.nombre) CONTAINS toUpper($nombre) RETURN e")
    List<Ejercicio> search(String nombre);

    @Query("MATCH (e:Ejercicio {nombre: $nombre}) RETURN COUNT(e) > 0")
    boolean existeNombre(String nombre);

    @Query("MATCH (e:Ejercicio) WHERE toUpper(e.nombre) = toUpper($nombre) RETURN e")
    Ejercicio findByNombre(String nombre);    

    @Query("MATCH (r:Rutina)-[:TIENE]->(e:Ejercicio) WHERE id(r) = $idRutina RETURN e")
    List<Ejercicio> findEjerciciosByRutinaId(Long idRutina);

}