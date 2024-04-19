package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.OperadorService;
import unpsjb.labprog.backend.model.Operador;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("operadores")
public class OperadorPresenter{

    @Autowired
    OperadorService service;

    @RequestMapping(value = "/search/{term}", method = RequestMethod.GET)
    public ResponseEntity<Object> search (@PathVariable("term") String term){
        return Response.ok(service.search(term));
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> findAll(){
        return Response.ok(service.findAll());
    }

    @RequestMapping(value ="/legajo/{legajo}", method = RequestMethod.GET)
    public ResponseEntity<Object> findById(@PathVariable("legajo") int legajo){
        Operador aOperadorOrNull = service.findById(legajo);
        return (aOperadorOrNull != null)?
            Response.ok(aOperadorOrNull):
            Response.notFound();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody Operador aOperador){
        try {
            return Response.ok(
                service.create(aOperador),
                "Operario/a " + aOperador.getLegajo() + " " + aOperador.getNombre() + " ingresado/a correctamente");
        } catch (DataIntegrityViolationException e){
            return Response.error("El Operario no puede ser creado ya que existe un operario con ese nombre",e.getMessage());
        }
    }

    @RequestMapping(value = "/{legajo}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("legajo") int legajo){
        try {
            service.delete(legajo);
            return Response.ok("Operario " + legajo + " borrado con exito.");
        } catch (DataIntegrityViolationException e){
            return Response.error("Operario " + legajo + " no puede ser borrado ya que pertenece a un bordero",e.getMessage());
        }
    }

    @RequestMapping(value="/page", method=RequestMethod.GET)
    public ResponseEntity<Object> findByPage(
    @RequestParam(defaultValue = "0") int page, 
    @RequestParam(defaultValue = "10") int size){
        return Response.ok(service.findByPage(page, size));
    }

    @RequestMapping(method=RequestMethod.PUT)
    public ResponseEntity<Object> update(@RequestBody Operador aOperador){
        if (aOperador.getLegajo() <= 0){
            return Response.error(aOperador,"Debe especificar un id valido para poder modificar un operario.");
        }
        return Response.ok(service.save(aOperador));
    }

}