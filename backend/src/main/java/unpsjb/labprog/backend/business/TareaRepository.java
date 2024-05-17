package unpsjb.labprog.backend.business;

import org.springframework.data.jpa.repository.Query;

import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.Tarea;

import java.util.Collection;
import java.util.Date;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface TareaRepository extends CrudRepository<Tarea, Integer>,PagingAndSortingRepository<Tarea, Integer>{

    @Query("SELECT e FROM Tarea e WHERE UPPER(e.descripcion) LIKE ?1")
    List<Tarea> search(String term);
    
    @Query("SELECT e FROM Tarea e WHERE e.codigo = ?1")
    Tarea findByCodigo(String codigo);

}