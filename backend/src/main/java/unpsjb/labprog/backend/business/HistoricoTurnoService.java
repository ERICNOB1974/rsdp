package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.HistoricoTurno;

@Service
public class HistoricoTurnoService {
    
    @Autowired
    HistoricoTurnoRepository repository;

    @Transactional
    public HistoricoTurno save(HistoricoTurno historicoTurno){
        return repository.save(historicoTurno);
    }

}