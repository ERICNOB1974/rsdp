package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.RutinaService;
import unpsjb.labprog.backend.business.ScoreEvento;
import unpsjb.labprog.backend.business.ScoreRutina;
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
    public ResponseEntity<Object> create(@RequestBody Rutina rutina) throws Exception{
        return Response.ok(rutinaService.save(rutina));
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        return Response.ok(rutinaService.findById(id));
    }

    @GetMapping("/{id}/ejercicios")
    public ResponseEntity<Object> ejercicios(@PathVariable Long id) {
        return Response.ok(rutinaService.ejercicios(id));
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnRutinas/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnRutinas(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciasDeRutinasBasadasEnRutinas(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnComunidades/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnComunidades(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciasDeRutinasBasadasEnComunidades(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }
    @GetMapping("/sugerenciasDeRutinasBasadasEnEventos/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnEventos(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciaDeRutinasBasadosEnEventos(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }
    @GetMapping("/sugerenciasDeRutinasBasadosEnEventosPorEtiqueta/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }


    @GetMapping("/sugerenciasDeRutinasBasadosEnEventos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnEventos2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventos = rutinaService
                .sugerenciasDeRutinasBasadosEnEventos2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadosEnEventos);
    }

        @GetMapping("/sugerenciasDeRutinasBasadosEnAmigos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnAmigos2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadosEnAmigos = rutinaService
                .sugerenciasDeRutinasBasadosEnAmigos2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadosEnAmigos);
    }

    @GetMapping("/sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta = rutinaService
                .sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadosEnEventosPorEtiqueta);
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnRutinas2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnRutinas2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadasEnRutinas = rutinaService
                .sugerenciasDeRutinasBasadasEnRutinas2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadasEnRutinas);
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnComunidades2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnComunidades2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadasEnComunidades = rutinaService
                .sugerenciasDeRutinasBasadasEnComunidades2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadasEnComunidades);
    }

    @GetMapping("/sugerencias-combinadas/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasCombinadas(@PathVariable String nombreUsuario) {
        try {
            return Response.ok(rutinaService.obtenerTodasLasSugerenciasDeRutinas(nombreUsuario));
        } catch (Exception e) {
            // Manejo del error
            return Response.error("", "Error al obtener las sugerencias: " + e.getMessage());
        }
    }
}
