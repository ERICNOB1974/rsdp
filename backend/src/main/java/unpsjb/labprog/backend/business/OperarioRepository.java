package unpsjb.labprog.backend.business;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Query;
import unpsjb.labprog.backend.model.Operario;
import java.util.List;
import java.util.Optional;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;

public interface OperarioRepository extends CrudRepository<Operario, Integer>,PagingAndSortingRepository<Operario, Integer>{

    @Query("SELECT e FROM Operario e WHERE UPPER(e.nombre) LIKE ?1")
    List<Operario> search(String termino);
 
    @Query("SELECT e FROM Operario e WHERE e.legajo = ?1")
    Optional<Operario> findByLegajo(int legajo);

    @Query("SELECT e FROM Operario e WHERE (LOWER(e.nombre) LIKE LOWER(CONCAT('%', ?1, '%')) OR CAST(e.legajo AS string) LIKE CONCAT('%', ?1, '%'))")
    Page<Operario> findByNombre(@Param("filter") String filter, PageRequest pageRequest);

}