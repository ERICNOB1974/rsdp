package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ComunidadService;
import unpsjb.labprog.backend.model.Comunidad;

@RestController
@RequestMapping("comunidades")
public class ComunidadPresenter {

    @Autowired
    ComunidadService comunidadService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll(){
        return Response.ok(comunidadService.findAll());
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Comunidad comunidad){
        return Response.ok(comunidadService.save(comunidad));
    }

    @GetMapping("/recomendarComunidadesPorAmigos/{nombreUsuario}")
    public ResponseEntity<Object> recomendarComunidadesPorAmigos(@PathVariable String nombreUsuario) {
        List<Comunidad> recomendarComunidadesPorAmigos = comunidadService.recomendarComunidadesPorAmigos(nombreUsuario);
        return Response.ok(recomendarComunidadesPorAmigos);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> recomendarComunidadesPorAmigos(@PathVariable Long id) {
        return Response.ok(comunidadService.findById(id));
    }

}
