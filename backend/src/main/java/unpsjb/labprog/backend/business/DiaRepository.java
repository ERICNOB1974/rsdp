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
            "CREATE (u)-[rel:DIA_FINALIZADO {intento: $intento,fechaFin: datetime()}]->(d)")
    void crearRelacionDiaFinalizado(Long diaId, Long usuarioId, Integer intento);

    @Query("MATCH (d:Dia)-[:TIENE_DIA]-(ru:Rutina) " +
            "WHERE id(d) = $diaId " +
            "MATCH (ru)-[rd:TIENE_DIA]-(diaOrden1:Dia) " +
            "WHERE rd.orden = 1 " +
            "OPTIONAL MATCH (u:Usuario)-[rel:DIA_FINALIZADO]->(diaOrden1) " +
            "WHERE id(u) = $usuarioId " +
            "RETURN coalesce(max(rel.intento), 0) AS intento")
    Integer buscarMaxIntento(Long diaId, Long usuarioId);

    @Query("MATCH (d:Dia)-[r:TIENE_DIA]-(ru:Rutina) " +
            "WHERE id(d) = $diaId " +
            "RETURN r.orden")
    int buscarNumeroDia(Long diaId);

}