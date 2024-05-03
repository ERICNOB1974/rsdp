package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ProyectoService;
import unpsjb.labprog.backend.model.Proyecto;
import unpsjb.labprog.backend.model.ResumenParteMO;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.regex.Pattern;
import java.util.Collection;
import java.util.Date;
import java.util.regex.Matcher;

@RestController
@RequestMapping("proyectos")
public class ProyectoPresenter{

    @Autowired
    ProyectoService service;
    
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
        Proyecto aProyectoOrNull = service.findById(id);
        return (aProyectoOrNull != null)?
            Response.ok(aProyectoOrNull):
            Response.notFound();
    }

    @RequestMapping(value ="/codigo/{codigo}", method = RequestMethod.GET)
    public ResponseEntity<Object> findByCodigo(@PathVariable("codigo") String codigo){
        Proyecto aProyectoOrNull = service.findByCodigo(codigo);
        return (aProyectoOrNull != null)?
            Response.ok(aProyectoOrNull):
            Response.notFound();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody Proyecto aProyecto){
        try {
            return Response.ok(
                service.save(aProyecto), 
                "Proyecto " + aProyecto.getCodigo() + " para " + aProyecto.getEmpresa().getNombre() + " ingresado correctamente");
        } catch (DataIntegrityViolationException e){
            String nombreConstraint = identificarError(e.getMessage());
            if (nombreConstraint.equals("uk_69qu6nmyn8o3el7x56j2l86uj")) { // Nombre de la constraint unique key del código del proyecto
                return Response.error("El proyecto no puede ser creado ya que el código del proyecto ya existe",e.getMessage());
            } else if (nombreConstraint.equals("uk_4r2284ccbe0tpx2vkue564t66")) { // Nombre de la constraint unique key de las tareas
                return Response.error("El proyecto no puede ser creado debido a tareas repetidas",e.getMessage());
            } else {
                return Response.error("El proyecto no puede ser creado debido a una violación del constraint: " + nombreConstraint,e.getMessage());
            }
        }
    }
    
    private String identificarError(String errorMessage) {
        String regex = "constraint \\[([^\\]]+)]";
        Pattern pattern = Pattern.compile(regex);
        Matcher matcher = pattern.matcher(errorMessage);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "Error desconocido";
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") int id){
        try {
            service.delete(id);
            return Response.ok("Proyecto " + id + " borrado con exito.");
        } catch (DataIntegrityViolationException e){
            return Response.error("Proyecto " + id + " no puede ser borrado",e.getMessage());
        }
    }

    @RequestMapping(value="/page", method=RequestMethod.GET)
    public ResponseEntity<Object> findByPage(
    @RequestParam(defaultValue = "0") int page, 
    @RequestParam(defaultValue = "10") int size){
        return Response.ok(service.findByPage(page, size));
    }

    @RequestMapping(method=RequestMethod.PUT)
    public ResponseEntity<Object> update(@RequestBody Proyecto aProyecto){
        if (aProyecto.getId() <= 0){
            return Response.error(aProyecto,"Debe especificar un id valido para poder modificar un proyecto.");
        }
        return Response.ok(
            service.save(aProyecto), 
            "Proyecto " + aProyecto.getCodigo() + " para " + aProyecto.getEmpresa().getNombre() + " ingresado correctamente");
    }

}