package unpsjb.labprog.backend.business;

import org.springframework.data.repository.Repository;
import org.springframework.data.jpa.repository.Query;
import unpsjb.labprog.backend.model.Operador;
import java.util.Optional;
import java.util.List;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface OperadorRepository extends Repository<Operador, Integer>,PagingAndSortingRepository<Operador, Integer>{

    @Query("SELECT e FROM Operador e WHERE UPPER(e.nombre) LIKE ?1")
    List<Operador> search(String term);

    @Query("SELECT e FROM Operador e")
    List<Operador> findAll();

    @Query("SELECT e FROM Operador e WHERE e.legajo = ?1")
    Optional<Operador> findById(int legajo);

    void deleteById(int legajo);

    Operador save(Operador operador);
    
}