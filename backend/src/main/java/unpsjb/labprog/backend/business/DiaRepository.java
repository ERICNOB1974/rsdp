package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Dia;

@Repository
public interface DiaRepository extends Neo4jRepository<Dia, Long> {

    @Query("CREATE (d:Dia {nombre: $nombre, descripcion: $descripcion}) RETURN ID(d)")
    Long crearDia(String nombre, String descripcion);

    @Query("MATCH (u:Usuario)-[r:DIA_FINALIZADO]->(d:Dia) " +
    "WHERE id(u) = $usuarioId AND id(d) = $diaId " +
    "RETURN COUNT(r) > 0")
    boolean verificarDiaFinalizado(Long diaId, Long usuarioId);

    @Query("MATCH (d:Dia), (u:Usuario) " +
    "WHERE id(u) = $usuarioId AND id(d) = $diaId " +
    "MERGE (u)-[rel:DIA_FINALIZADO]->(d) " +
    "ON CREATE SET rel.fechaFin = date()")
    void crearRelacionDiaFinalizado(Long diaId, Long usuarioId);

}