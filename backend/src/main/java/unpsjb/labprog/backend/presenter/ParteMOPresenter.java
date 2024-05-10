package unpsjb.labprog.backend.presenter;

import java.util.Date;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ParteMOService;
import unpsjb.labprog.backend.model.ParteMO;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;

@RestController
@RequestMapping("partes")
public class ParteMOPresenter{

    @Autowired
    ParteMOService service;

    @RequestMapping(value ="/id/{id}", method = RequestMethod.GET)
    public ResponseEntity<Object> findById(@PathVariable("id") int id){
        ParteMO aParteMOOrNull = service.findById(id);
        return (aParteMOOrNull != null)?
            Response.ok(aParteMOOrNull):
            Response.notFound();
    }

    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<Object> findAll(){
        return Response.ok(service.findAll());
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody ParteMO aParteMO){
        try {
        return Response.ok(
            service.save(aParteMO),
            "Parte MO generado correctamente");
        } catch (DataIntegrityViolationException e){
            return Response.error("El parte no puede ser creado ya que existe un parte con ese id",e.getMessage());
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") int id){
        try {
            service.delete(id);
            return Response.ok("Parte " + id + " borrado con exito.");
        } catch (DataIntegrityViolationException e){
            return Response.error("Parte " + id + " no puede ser borrado",e.getMessage());
        }
    }

    @RequestMapping(value="/page", method=RequestMethod.GET)
    public ResponseEntity<Object> findByPage(
    @RequestParam(defaultValue = "0") int page, 
    @RequestParam(defaultValue = "10") int size){
        return Response.ok(service.findByPage(page, size));
    }

    @RequestMapping(value ="/informeFecha/{fecha}", method = RequestMethod.GET)
    public ResponseEntity<Object> informePartesPorFecha( @PathVariable("fecha") @DateTimeFormat(pattern = "yyyy-MM-dd") Date fecha) {
        return Response.ok(service.informePartesPorFecha(fecha));
    }

    @RequestMapping(value ="/informeGeneral", method = RequestMethod.GET)
    public ResponseEntity<Object> informePartesGeneral() {
        return Response.ok(service.informePartesGeneral());
    }

    @RequestMapping(method=RequestMethod.PUT)
    public ResponseEntity<Object> update(@RequestBody ParteMO aParteMO){
        if (aParteMO.getId() <= 0){
            return Response.error(aParteMO,"Debe especificar un id valido para poder modificar un parte.");
        }
        return Response.ok(
            service.save(aParteMO), 
            "Parte " + aParteMO.getId() + " ingresado correctamente");
    }

}