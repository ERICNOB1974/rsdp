package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.ValidacionParteMO;

import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface ValidacionParteMORepository extends CrudRepository<ValidacionParteMO, Integer>,PagingAndSortingRepository<ValidacionParteMO, Integer>{

}