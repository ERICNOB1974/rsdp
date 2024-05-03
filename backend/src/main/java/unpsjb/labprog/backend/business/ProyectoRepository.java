package unpsjb.labprog.backend.business;

import org.springframework.data.jpa.repository.Query;
import unpsjb.labprog.backend.model.Proyecto;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ProyectoRepository extends CrudRepository<Proyecto, Integer>,PagingAndSortingRepository<Proyecto, Integer>{

    @Query("SELECT e FROM Proyecto e WHERE UPPER(e.descripcion) LIKE ?1")
    List<Proyecto> search(String term);
    
    @Query("SELECT e FROM Proyecto e WHERE e.codigo = ?1")
    Proyecto findByCodigo(String codigo);

}