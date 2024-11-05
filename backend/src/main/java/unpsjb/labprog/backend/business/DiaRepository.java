package unpsjb.labprog.backend.business;

import java.util.List;

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
    "CREATE (u)-[rel:DIA_FINALIZADO {fechaFin: datetime()}]->(d)")
    void crearRelacionDiaFinalizado(Long diaId, Long usuarioId);   

    @Query("MATCH (u:Usuario)-[rel:DIA_FINALIZADO]->(d:Dia)-[r:TIENE_DIA]-(ru:Rutina) " +
       "WHERE id(u) = $usuarioId AND id(ru) = $rutinaId AND r.orden = 1 " +
       "RETURN coalesce(MAX(rel.intento), 0)")
    int obtenerIntentoMaximo(Long usuarioId, Long rutinaId);

    @Query("MATCH (ru:Rutina)-[r:TIENE_DIA]->(d:Dia) " +
       "WHERE id(ru) = $rutinaId AND NOT EXISTS((u:Usuario)-[rel:DIA_FINALIZADO]->(d)) " +
       "AND id(u) = $usuarioId AND rel.intento = $intento " +
       "RETURN d " +
       "ORDER BY r.orden")
    List<Dia> obtenerDiasNoCompletadosEnUltimoIntento(Long usuarioId, Long rutinaId, int intento);

    @Query("MATCH (u:Usuario)-[rel:DIA_FINALIZADO]->(d:Dia)-[r:TIENE_DIA]-(ru:Rutina) " +
       "WHERE id(u) = $usuarioId AND id(ru) = $rutinaId AND rel.intento = $intento " +
       "RETURN d " +
       "ORDER BY r.orden")
    List<Dia> obtenerDiasCompletadosEnUltimoIntento(Long usuarioId, Long rutinaId, int intento);



}