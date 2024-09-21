package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.RutinaService;
import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Rutina;

@RestController
@RequestMapping("rutinas")
public class RutinaPresenter {

    @Autowired
    RutinaService rutinaService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll(){
        return Response.ok(rutinaService.findAll());
    }

    @GetMapping("/sugerenciasDeRutinasBasadosEnAmigos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeRutinasBasadosEnAmigos(@PathVariable String nombreUsuario) {
        List<Rutina> rutinasDeAmigos = rutinaService.sugerenciasDeRutinasBasadosEnAmigos(nombreUsuario);
        return Response.ok(rutinasDeAmigos);
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Rutina rutina){
        return Response.ok(rutinaService.save(rutina));
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> recomendarComunidadesPorAmigos(@PathVariable Long id) {
        return Response.ok(rutinaService.findById(id));
    }

}
