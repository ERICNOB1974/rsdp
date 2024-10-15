package unpsjb.labprog.backend.presenter;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.business.ScoreComunidad;
import unpsjb.labprog.backend.business.ScoreComunidadService;

@RestController
@RequestMapping("ScoreComunidad")
public class ScoreComunidadPresenter {

    @Autowired
    ScoreComunidadService scoreComunidadService;

    @GetMapping("/sugerencias-comunidadesAmigos/{nombreUsuario}")
    public List<ScoreComunidad> obtenerSugerenciasBasadasEnAmigos(@PathVariable String nombreUsuario) {
        return scoreComunidadService.obtenerSugerenciasDeComunidadesBasadasEnAmigosConScore(nombreUsuario);
    }

    @GetMapping("/sugerencias-comunidadesEventos/{nombreUsuario}")
    public List<ScoreComunidad> obtenerSugerenciasBasadasEnEventos(@PathVariable String nombreUsuario) {
        return scoreComunidadService.obtenerSugerenciasDeComunidadesBasadasEnEventosConScore(nombreUsuario);
    }

    @GetMapping("/sugerencias-comunidadesComunidades/{nombreUsuario}")
    public List<ScoreComunidad> obtenerSugerenciasBasadasEnComunidades(@PathVariable String nombreUsuario) {
        return scoreComunidadService.obtenerSugerenciasDeComunidadesBasadasEnComunidadesConScore(nombreUsuario);
    }

    @GetMapping("/sugerencias-combinadas/{nombreUsuario}")
    public List<ScoreComunidad> obtenerSugerenciasCombinadas(@PathVariable String nombreUsuario) {
        try {
            return scoreComunidadService.obtenerTodasLasSugerenciasDeComunidades(nombreUsuario);
        } catch (Exception e) {
            // Manejo del error
            System.out.println("Error: " + e.getMessage());
            return new ArrayList<>(); // Retorna una lista vacía o lanza una excepción personalizada
        }
    }
}
