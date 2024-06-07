package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.TipoTurno;

import java.util.Date;
import java.util.List;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface TipoTurnoRepository extends CrudRepository<TipoTurno, Integer>,PagingAndSortingRepository<TipoTurno, Integer>{

    @Query(value = 
    "SELECT ht.tipoTurno " +
    "FROM Operario op JOIN op.historicoTurnos ht " +
    "WHERE op = :operario AND (:fecha BETWEEN ht.fechaTurnoDesde AND COALESCE(ht.fechaTurnoHasta, :fecha))")
    TipoTurno obtenerTurno(@Param("operario") Operario operario, @Param("fecha") Date fecha);

    @Query(value = 
    "SELECT e " +
    "FROM TipoTurno e " +
    "ORDER BY id ASC")
    List<TipoTurno> findAll();

    @Query("SELECT e FROM TipoTurno e WHERE UPPER(e.nombre) LIKE ?1")
    List<TipoTurno> search(String term);

}