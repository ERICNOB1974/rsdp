package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.Proyecto;
import unpsjb.labprog.backend.model.ResumenParteMO;
import unpsjb.labprog.backend.model.Tarea;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.time.LocalDate;
import java.util.Collection;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface ParteMORepository extends CrudRepository<ParteMO, Integer>,PagingAndSortingRepository<ParteMO, Integer>{

    @Query(value = 
    "SELECT pmo.operario.legajo as legajo, " +
    "pmo.operario.nombre as nombre, " +
    "pmo.fecha as fecha, " +
    "MIN(pmo.horaDesde) as ingreso, " +
    "MAX(pmo.horaHasta) as egreso, " +
    "CAST(MAX(pmo.horaHasta) - MIN(pmo.horaDesde) as time) horas, " +
    "CAST(SUM(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes," +  
    "ANY_VALUE(pmo.estado.nombre) as estado " +
    "FROM ParteMO pmo " +
    "WHERE pmo.fecha = COALESCE(:fecha,pmo.fecha) AND (pmo.estado.nombre <> 'anulado') " +
    "GROUP BY pmo.operario.legajo, pmo.operario.nombre, pmo.fecha " +
    "ORDER BY pmo.fecha DESC")
    Page<ResumenParteMO> informePartesPorFecha(@Param("fecha") Optional<Date> fecha, Pageable pageable);

    @Query(value = 
    "SELECT pmo.operario.legajo as legajo, " +
    "pmo.operario.nombre as nombre, " +
    "max(pmo.fecha) fecha, " +
    "MIN(pmo.horaDesde) as ingreso, " +
    "MAX(pmo.horaHasta) as egreso, " +
    "CAST(MAX(pmo.horaHasta) - MIN(pmo.horaDesde) as time) horas , " +
    "CAST(SUM(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes, " +  
    "ANY_VALUE(pmo.estado.nombre) as estado " +
    "FROM ParteMO pmo " +
    "WHERE pmo.fecha <= COALESCE(:fecha,pmo.fecha) AND pmo.estado.nombre IN ('generado', 'corregido') " +
    "GROUP BY pmo.operario.legajo, pmo.operario.nombre " + 
    "ORDER BY pmo.operario.legajo ASC")
    Collection<ResumenParteMO> informePartesALaFecha(@Param("fecha") Optional<Date> fecha);

    @Query(value =
    "SELECT pmo "  +
    "FROM ParteMO pmo " + 
    "WHERE (pmo.operario = :operario) AND (pmo.fecha = :fecha) AND (pmo.estado.nombre <> 'anulado')" +
    "ORDER BY pmo.horaDesde ASC")
    List<ParteMO> partesDeUnResumen(@Param("operario") Operario operario, @Param("fecha") Date fecha);

    @Query(value =
    "SELECT pmo " +
    "FROM ParteMO pmo " +
    "WHERE (pmo.estado.nombre = 'inválido')")
    List<ParteMO> partesConEstadoInvalido();

    @Query(value =
    "SELECT pmo " +
    "FROM ParteMO pmo " +
    "WHERE (pmo.estado.nombre = 'corregido')")
    List<ParteMO> partesConEstadoCorregido();

    @Query(value =
    "SELECT pmo " +
    "FROM ParteMO pmo " +
    "WHERE (pmo.operario = :operario) AND (pmo.fecha = :fecha) AND (pmo.proyecto = :proyecto) AND (pmo.tarea = :tarea)")
    ParteMO parteDadoProyectoYTarea(@Param("fecha") Date fecha, @Param("operario") Operario operario, @Param("proyecto") Proyecto proyecto, @Param("tarea") Tarea tarea);

    @Query(value = 
    "SELECT e " +
    "FROM ParteMO e " +
    "ORDER BY id ASC")
    List<ParteMO> findAll();

    @Query(value = "SELECT pmo.fecha as fecha, pmo.operario.legajo as legajo, pmo.operario.nombre as nombre, "
    + "MIN(pmo.horaDesde) as ingreso, MAX(pmo.horaHasta) as egreso, "
    + "cast(max(pmo.horaHasta) - min(pmo.horaDesde) as time) as horas, "
    + "cast(sum(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes, "
    + "ANY_VALUE(pmo.estado.nombre) as estado "
    + "FROM ParteMO pmo "
    + "WHERE (pmo.fecha = COALESCE(:fecha,pmo.fecha)) AND lower(pmo.estado.nombre) IN ('inválido','corregido','rechazado') "
    + "GROUP BY pmo.operario.legajo, pmo.operario.nombre, pmo.fecha "
    + "ORDER BY pmo.fecha DESC")
    Page<ResumenParteMO> getInvalidos(@Param("fecha") Optional<Date> fecha, Pageable pageable);

    @Query(value = "SELECT pmo.fecha as fecha, pmo.operario.legajo as legajo, pmo.operario.nombre as nombre, "
        + "MIN(pmo.horaDesde) as ingreso, MAX(pmo.horaHasta) as egreso, "
        + "cast(max(pmo.horaHasta) - min(pmo.horaDesde) as time) as horas, "
        + "cast(sum(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes, "
        + "ANY_VALUE(pmo.estado.nombre) as estado "
        + "FROM ParteMO pmo "
        + "WHERE (pmo.fecha = COALESCE(:fecha,pmo.fecha)) AND lower(pmo.estado.nombre) IN ('válido','validado') "
        + "GROUP BY pmo.operario.legajo, pmo.operario.nombre, pmo.fecha "
        + "ORDER BY pmo.fecha DESC")
    Page<ResumenParteMO> getValidos(@Param("fecha") Optional<Date> fecha, Pageable pageable);

    @Query(value = "SELECT pmo.fecha as fecha, pmo.operario.legajo as legajo, pmo.operario.nombre as nombre, "
        + "MIN(pmo.horaDesde) as ingreso, MAX(pmo.horaHasta) as egreso, "
        + "cast(max(pmo.horaHasta) - min(pmo.horaDesde) as time) as horas, "
        + "cast(sum(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes, "
        + "ANY_VALUE(pmo.estado.nombre) as estado "
        + "FROM ParteMO pmo "
        + "WHERE (pmo.fecha = COALESCE(:fecha,pmo.fecha)) AND lower(pmo.estado.nombre) != 'anulado' "
        + "GROUP BY pmo.operario.legajo, pmo.operario.nombre, pmo.fecha "
        + "ORDER BY pmo.fecha DESC")
    Page<ResumenParteMO> getTodos(@Param("fecha") Optional<Date> fecha, Pageable pageable);

}