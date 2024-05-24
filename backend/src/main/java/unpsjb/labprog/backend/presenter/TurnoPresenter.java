/*package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.TurnoService;
import unpsjb.labprog.backend.model.Turno;

@RestController
@RequestMapping("turnos")
public class TurnoPresenter{

    @Autowired
    TurnoService service;
    
    @RequestMapping(value = "/{horaDesde}/{horaHasta}", method = RequestMethod.GET)
    public ResponseEntity<Object> findByTurno(@PathVariable("horaDesde") String horaDesde, @PathVariable("horaHasta") String horaHasta) {
        Turno aTurnoOrNull = service.findByTurno(horaDesde, horaHasta);
        if (aTurnoOrNull != null) {
            return Response.ok(aTurnoOrNull);
        } else {
            return Response.error("Turno no encontrado", null);
        }
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody Turno aTurno){
        try {
            return Response.ok(
                service.save(aTurno), 
                "Turno/a " + aTurno.getId() + " ingresado/a correctamente");
            } catch (DataIntegrityViolationException e){
            return Response.error("El Turno no puede ser cread ya que existe un Turno con ese codigo",e.getMessage());
        }
    }

}*/