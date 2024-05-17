/*package unpsjb.labprog.backend.presenter;

import java.sql.Date;

import java.util.Collection;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.TareaService;
import unpsjb.labprog.backend.business.TurnoService;
import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.Tarea;
import unpsjb.labprog.backend.model.Turno;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("turnos")
public class TurnoPresenter{

    @Autowired
    TurnoService service;
    
    @RequestMapping(value = "/{horaDesde}/{horaHasta}", method = RequestMethod.GET)
    public ResponseEntity<Object> findByTurno(@PathVariable("horaDesde") String horaDesde, @PathVariable("horaHasta") String horaHasta) {
        Turno aTurnoOrNull = service.findByTurno(horaDesde, horaHasta);
        if (aTurnoOrNull != null) {
            return ResponseEntity.ok(aTurnoOrNull);
        } else {
            return ResponseEntity.status(404).body("Turno no encontrado");
        }
    }

}*/