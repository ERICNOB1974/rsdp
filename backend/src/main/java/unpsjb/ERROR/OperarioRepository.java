/*package unpsjb.labprog.backend.business;

import org.springframework.data.repository.Repository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import unpsjb.labprog.backend.model.Operario;
import java.util.Optional;
import java.util.List;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface OperarioRepository extends Repository<Operario, Integer>,PagingAndSortingRepository<Operario, Integer>{

    @Query("SELECT e FROM Operario e WHERE UPPER(e.nombre) LIKE ?1")
    List<Operario> search(String term);

    @Query("SELECT e FROM Operario e")
    List<Operario> findAll();

    @Query("SELECT e FROM Operario e WHERE e.legajo = ?1")
    Optional<Operario> findById(int legajo);

    @Modifying
    @Query("DELETE FROM Operario e WHERE e.legajo = ?1")
    void deleteByLegajo(int legajo);

    Operario save(Operario operario);
    
}*/