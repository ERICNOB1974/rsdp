package unpsjb.labprog.backend.business;

import org.springframework.data.jpa.repository.Query;
import unpsjb.labprog.backend.model.Operario;
import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface OperarioRepository extends CrudRepository<Operario, Integer>,PagingAndSortingRepository<Operario, Integer>{

    @Query("SELECT e FROM Operario e WHERE UPPER(e.nombre) LIKE ?1")
    List<Operario> search(String term);
 
    @Query("SELECT e FROM Operario e WHERE e.legajo = ?1")
    Optional<Operario> findByLegajo(int legajo);

}