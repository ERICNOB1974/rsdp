/*package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.HistoricoTurno;
import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.Tarea;
import unpsjb.labprog.backend.model.Turno;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import org.springframework.dao.DataIntegrityViolationException;

@Service
public class HistoricoTurnoService {
    
    @Autowired
    HistoricoTurnoRepository repository;

    @Transactional
    public HistoricoTurno save(HistoricoTurno e){
        return repository.save(e);
    }

}
*/