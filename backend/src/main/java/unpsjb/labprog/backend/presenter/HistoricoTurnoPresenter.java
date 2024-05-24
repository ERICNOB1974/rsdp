/*package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.HistoricoTurnoService;
import unpsjb.labprog.backend.model.HistoricoTurno;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("historicoTurnos")
public class HistoricoTurnoPresenter{

    @Autowired
    HistoricoTurnoService service;
    
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody HistoricoTurno aHistoricoTurno){
            return Response.ok(
                service.save(aHistoricoTurno), 
                "Historico " + aHistoricoTurno.getId() + " ingresado correctamente");
    }

}*/