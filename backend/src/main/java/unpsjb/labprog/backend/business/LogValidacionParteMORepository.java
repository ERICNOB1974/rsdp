package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.LogValidacionParteMO;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface LogValidacionParteMORepository extends CrudRepository<LogValidacionParteMO, Integer>,PagingAndSortingRepository<LogValidacionParteMO, Integer>{

}