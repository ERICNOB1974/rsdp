package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;
import java.util.Date;
import java.util.Collection;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface ParteMORepository extends CrudRepository<ParteMO, Integer>,PagingAndSortingRepository<ParteMO, Integer>{

    @Query(value = 
    "SELECT pmo.operario.legajo as legajo, " +
    "pmo.operario.nombre as nombre, " +
    "MIN(pmo.horaDesde) as ingreso, " +
    "MAX(pmo.horaHasta) as egreso, " +
    "CAST(MAX(pmo.horaHasta) - MIN(pmo.horaDesde) as time) horas , " +
    "CAST(SUM(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes " +  
    "FROM ParteMO pmo " +
    "WHERE pmo.fecha = :fecha " +
    "GROUP BY pmo.operario.legajo, pmo.operario.nombre " +
    "ORDER BY pmo.operario.legajo ASC")
    Collection<ResumenParteMO> informePartesPorFecha(@Param("fecha") Date fecha);

    @Query(value = 
    "SELECT pmo.operario.legajo as legajo, " +
    "pmo.operario.nombre as nombre, " +
    "MIN(pmo.horaDesde) as ingreso, " +
    "MAX(pmo.horaHasta) as egreso, " +
    "CAST(MAX(pmo.horaHasta) - MIN(pmo.horaDesde) as time) horas , " +
    "CAST(SUM(pmo.horaHasta - pmo.horaDesde) as time) as horasPartes " +  
    "FROM ParteMO pmo " +
    "GROUP BY pmo.operario.legajo, pmo.operario.nombre " +
    "ORDER BY pmo.operario.legajo ASC")
    Collection<ResumenParteMO> informePartesGeneral();


}
