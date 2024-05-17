package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;
import unpsjb.labprog.backend.model.Tarea;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.util.Collection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface ParteMORepository extends CrudRepository<ParteMO, Integer>,PagingAndSortingRepository<ParteMO, Integer>{

    @Query(value = 
    "SELECT pmo.operario.legajo as legajo, " +
    "pmo.operario.nombre as nombre, " +
    "max(pmo.fecha) fecha, " +
    "MIN(pmo.horaDesde) as ingreso, " +
    "MAX(pmo.horaHasta) as egreso, " +
    "CAST(MAX(pmo.horaHasta) - MIN(pmo.horaDesde) as time) horas , " +
    "CAST(SUM(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes " +  
    "FROM ParteMO pmo " +
    "WHERE pmo.fecha = COALESCE(:fecha,pmo.fecha) " +
    "GROUP BY pmo.operario.legajo, pmo.operario.nombre " +
    "ORDER BY pmo.operario.legajo ASC")
    Collection<ResumenParteMO> informePartesPorFecha(@Param("fecha") Optional<Date> fecha);

    @Query(value = 
    "SELECT pmo.operario.legajo as legajo, " +
    "pmo.operario.nombre as nombre, " +
    "max(pmo.fecha) fecha, " +
    "MIN(pmo.horaDesde) as ingreso, " +
    "MAX(pmo.horaHasta) as egreso, " +
    "CAST(MAX(pmo.horaHasta) - MIN(pmo.horaDesde) as time) horas , " +
    "CAST(SUM(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes " +  
    "FROM ParteMO pmo " +
    "WHERE pmo.fecha <= :fecha AND pmo.estado.nombre IN ('generado', 'corregido') " +
    "GROUP BY pmo.operario.legajo, pmo.operario.nombre " + 
    "ORDER BY pmo.operario.legajo ASC")
    Collection<ResumenParteMO> informePartesALaFecha(@Param("fecha") Date fecha);

    @Query(value =
    "SELECT pmo "  +
    "FROM ParteMO pmo " + 
    "WHERE (pmo.operario = :operario) AND (pmo.fecha = :fecha) " +
    "ORDER BY pmo.horaDesde ASC")
    List<ParteMO> partesDeUnResumen(@Param("operario") Operario operario, @Param("fecha") Date fecha);

    @Query(value =
    "SELECT pmo "  +
    "FROM ParteMO pmo " + 
    "WHERE (pmo.operario.legajo = :legajo) AND (pmo.fecha = :fecha) " +
    "ORDER BY pmo.horaDesde ASC")
    List<ParteMO> resumenOperario(@Param("legajo") int legajo, @Param("fecha") Date fecha);

}
