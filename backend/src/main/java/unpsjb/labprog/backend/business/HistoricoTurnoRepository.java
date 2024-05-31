package unpsjb.labprog.backend.business;

import unpsjb.labprog.backend.model.HistoricoTurno;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;

public interface HistoricoTurnoRepository extends CrudRepository<HistoricoTurno, Integer>,PagingAndSortingRepository<HistoricoTurno, Integer>{

}