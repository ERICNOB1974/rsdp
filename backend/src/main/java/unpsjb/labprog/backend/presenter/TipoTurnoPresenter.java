package unpsjb.labprog.backend.presenter;

import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.OperarioService;
import unpsjb.labprog.backend.business.TipoTurnoService;
import unpsjb.labprog.backend.model.Horario;
import unpsjb.labprog.backend.model.TipoTurno;

@RestController
@RequestMapping("tipoTurnos")
public class TipoTurnoPresenter{

    @Autowired
    TipoTurnoService service;

    @RequestMapping(value ="/id/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> findById(@PathVariable("id") int id){
        TipoTurno aTurnoOrNull = service.findById(id);
        return (aTurnoOrNull != null)?
            Response.ok(aTurnoOrNull):
            Response.notFound();
    }

    @RequestMapping(value = "/obtenerHorario/{operarioLegajo}/{fecha}", method = RequestMethod.GET)
    public ResponseEntity<Object> obtenerHorario(@PathVariable("operarioLegajo") int operarioLegajo, @PathVariable("fecha") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha) {
        Horario aHorarioOrNull = service.obtenerHorario(operarioLegajo, fecha);
        if (aHorarioOrNull != null) {
            return Response.ok(aHorarioOrNull);
        } else {
            return Response.error("Horario no encontrado", null);
        }
    } 

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> findAll(){
        return Response.ok(service.findAll());
    }
    
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody TipoTurno aTurno){
        try {
            return Response.ok(
                service.save(aTurno), 
                "TipoTurno/a " + aTurno.getId() + " ingresado/a correctamente");
            } catch (DataIntegrityViolationException e){
            return Response.error("El TipoTurno no puede ser cread ya que existe un TipoTurno con ese codigo",e.getMessage());
        }
    }

}