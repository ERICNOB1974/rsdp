package unpsjb.labprog.backend.business;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Estado;

@Repository
public interface EstadoRepository extends CrudRepository<Estado, Integer>{
    
}