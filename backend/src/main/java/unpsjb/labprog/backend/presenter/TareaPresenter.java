package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.TareaService;
import unpsjb.labprog.backend.model.Tarea;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("tareas")
public class TareaPresenter{

    @Autowired
    TareaService service;
    
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
        Tarea aTareaOrNull = service.findById(id);
        return (aTareaOrNull != null)?
            Response.ok(aTareaOrNull):
            Response.notFound();
    }

    @RequestMapping(value ="/codigo/{codigo}", method = RequestMethod.GET)
    public ResponseEntity<Object> findByCodigo(@PathVariable("codigo") String codigo){
        Tarea aTareaOrNull = service.findByCodigo(codigo);
        return (aTareaOrNull != null)?
            Response.ok(aTareaOrNull):
            Response.notFound();
    }



    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody Tarea aTarea){
        try {
            return Response.ok(
                service.save(aTarea), 
                "Tarea " + aTarea.getCodigo() + " ingresada correctamente");
        } catch (DataIntegrityViolationException e){
            return Response.error("La tarea no puede ser creada ya que existe un tarea con ese codigo",e.getMessage());
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") int id){
        try {
            service.delete(id);
            return Response.ok("Tarea " + id + " borrado con exito.");
        } catch (DataIntegrityViolationException e){
            return Response.error("Tarea " + id + " no puede ser borrada",e.getMessage());
        }
    }

    @RequestMapping(value="/page", method=RequestMethod.GET)
    public ResponseEntity<Object> findByPage(
    @RequestParam(defaultValue = "0") int page, 
    @RequestParam(defaultValue = "10") int size){
        return Response.ok(service.findByPage(page, size));
    }

    @RequestMapping(method=RequestMethod.PUT)
    public ResponseEntity<Object> update(@RequestBody Tarea aTarea){
        if (aTarea.getId() <= 0){
            return Response.error(aTarea,"Debe especificar un id valido para poder modificar una tarea.");
        }
        return Response.ok(
            service.save(aTarea), 
            "Tarea " + aTarea.getCodigo() + " ingresada correctamente");
    }

}