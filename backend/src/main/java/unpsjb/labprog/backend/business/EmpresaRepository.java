package unpsjb.labprog.backend.business;

import org.springframework.data.jpa.repository.Query;
import unpsjb.labprog.backend.model.Empresa;
import java.util.Optional;
import java.util.List;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface EmpresaRepository extends CrudRepository<Empresa, Integer>,PagingAndSortingRepository<Empresa, Integer>{

    @Query("SELECT e FROM Empresa e WHERE UPPER(e.nombre) LIKE ?1")
    List<Empresa> search(String termino);

    @Query("SELECT e FROM Empresa e WHERE e.cuit = ?1")
    Optional<Empresa> findByCuit(String cuit);
    
}