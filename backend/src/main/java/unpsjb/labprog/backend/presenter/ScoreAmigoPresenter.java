package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.business.ScoreAmigo;
import unpsjb.labprog.backend.business.ScoreAmigoService;

@RestController
@RequestMapping("ScoreAmigo")
public class ScoreAmigoPresenter {

    @Autowired
    ScoreAmigoService scoreAmigoService;

    @GetMapping("/sugerencias-amigosAmigos/{nombreUsuario}")
    public List<ScoreAmigo> obtenerSugerenciasBasadasEnAmigos(@PathVariable String nombreUsuario) {
        return scoreAmigoService.obtenerSugerenciasDeAmigosBasadosEnAmigosConScore(nombreUsuario);
    }

    @GetMapping("/sugerencias-amigosEventos/{nombreUsuario}")
    public List<ScoreAmigo> obtenerSugerenciasBasadasEnEventos(@PathVariable String nombreUsuario) {
        return scoreAmigoService.obtenerSugerenciasDeAmigosBasadosEnEventosConScore(nombreUsuario);
    }

    @GetMapping("/sugerencias-amigosComunidades/{nombreUsuario}")
    public List<ScoreAmigo> obtenerSugerenciasBasadasEnComunidades(@PathVariable String nombreUsuario) {
        return scoreAmigoService.obtenerSugerenciasDeAmigosBasadosEnComunidadesConScore(nombreUsuario);
    }

    @GetMapping("/sugerencias-usuarios/{nombreUsuario}")
    public List<ScoreAmigo> obtenerSugerenciasDeAmigos(@PathVariable String nombreUsuario) {
        return scoreAmigoService.obtenerTodasLasSugerenciasDeAmigosConScore(nombreUsuario);
    }
}
