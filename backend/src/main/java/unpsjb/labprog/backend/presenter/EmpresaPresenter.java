package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EmpresaService;
import unpsjb.labprog.backend.model.Empresa;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.dao.DataIntegrityViolationException;

@RestController
@RequestMapping("empresas")
public class EmpresaPresenter{

    @Autowired
    EmpresaService service;

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
        Empresa aEmpresaOrNull = service.findById(id);
        return (aEmpresaOrNull != null)?
            Response.ok(aEmpresaOrNull):
            Response.notFound();
    }

    @RequestMapping(value ="/cuit/{cuit}", method = RequestMethod.GET)
    public ResponseEntity<Object> findByCuit(@PathVariable("cuit") String cuit){
        Empresa aEmpresaOrNull = service.findByCuit(cuit);
        return (aEmpresaOrNull != null)?
            Response.ok(aEmpresaOrNull):
            Response.notFound();
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create (@RequestBody Empresa aEmpresa){
        try {
            return Response.ok(
                service.create(aEmpresa), 
                "Cliente " + aEmpresa.getNombre() + " con cuit " + aEmpresa.getCuit() + " cargado correctamente");
            } catch (DataIntegrityViolationException e){
            return Response.error("La empresa no puede ser creada ya que existe una empresa con ese cuit",e.getMessage());
        }
    }

    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") int id){
        try {
            service.delete(id);
            return Response.ok("Empresa " + id + " borrada con exito.");
        } catch (DataIntegrityViolationException e){
            return Response.error("Empresa " + id + " no puede ser borrada",e.getMessage());
        }
    }

    @RequestMapping(value="/page", method=RequestMethod.GET)
    public ResponseEntity<Object> findByPage(
    @RequestParam(defaultValue = "0") int page, 
    @RequestParam(defaultValue = "10") int size){
        return Response.ok(service.findByPage(page, size));
    }

    @RequestMapping(method=RequestMethod.PUT)
    public ResponseEntity<Object> update(@RequestBody Empresa aEmpresa){
        if (aEmpresa.getId() <= 0){
            return Response.error(aEmpresa,"Debe especificar un id valido para poder modificar una empresa.");
        }
        return Response.ok(service.save(aEmpresa));
    }

}