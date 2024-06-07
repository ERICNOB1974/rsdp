package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.NoExisteTurnoException;
import unpsjb.labprog.backend.business.OperarioService;
import unpsjb.labprog.backend.business.SuperposicionDeFechasException;
import unpsjb.labprog.backend.model.Operario;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("operarios")
public class OperarioPresenter{

    @Autowired
    OperarioService service;

    @RequestMapping(value = "/search/{term}", method = RequestMethod.GET)
    public ResponseEntity<Object> search (@PathVariable("term") String term){
        return Response.ok(service.search(term));
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> findAll(){
        return Response.ok(service.findAll());
    }

    @RequestMapping(value ="/id/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> findById(@PathVariable("id") int id){
        Operario aOperarioOrNull = service.findById(id);
        return (aOperarioOrNull != null)?
            Response.ok(aOperarioOrNull):
            Response.notFound();
    }

    @RequestMapping(value ="/legajo/{legajo}", method = RequestMethod.GET)
    public ResponseEntity<Object> findByLegajo(@PathVariable("legajo") int legajo){
        Operario aOperarioOrNull = service.findByLegajo(legajo);
        return (aOperarioOrNull != null)?
            Response.ok(aOperarioOrNull):
            Response.notFound();
    }

    
    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") int id){
        try {
            service.delete(id);
            return Response.ok("Operario " + id + " borrado con exito.");
        } catch (DataIntegrityViolationException e){
            return Response.error("Operario " + id + " no puede ser borrado (...)",e.getMessage());
        }
    }
    
    @RequestMapping(value="/page", method=RequestMethod.GET)
    public ResponseEntity<Object> findByPage(
        @RequestParam(defaultValue = "0") int page, 
        @RequestParam(defaultValue = "10") int size){
            return Response.ok(service.findByPage(page, size));
        }
        
    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Operario aOperario) {
        try {
            return Response.ok(
                service.save(aOperario),
                "Operario/a " + aOperario.getLegajo() + " " + aOperario.getNombre() + " ingresado/a correctamente"
            );
        } catch (SuperposicionDeFechasException e) {
            return Response.error("No se puede crear el operario debido a una superposición de fechas", e.getMessage());
        } catch (NoExisteTurnoException e) {
            return Response.error("No existe turno para esa fecha desde!", e.getMessage());
        }
        
    }

    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<Object> update(@RequestBody Operario aOperario) {
        try {
            return Response.ok(
                service.save(aOperario)
            );
        } catch (SuperposicionDeFechasException e) {
            return Response.error("No se puede actualizar el operario debido a una superposición de fechas", e.getMessage());
        } catch (NoExisteTurnoException e) {
            return Response.error("No existe turno para esa fecha desde!", e.getMessage());
        }
    }

}