package unpsjb.labprog.backend.business;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service 
public class ScoreAmigoService {
       @Autowired
    ScoreAmigoRepository scoreAmigoRepository;

    
    public List<ScoreAmigo> obtenerSugerenciasDeAmigosBasadosEnAmigosConScore(String nombreUsuario) {
        return scoreAmigoRepository.sugerenciaDeAmigosBasadaEnAmigos(nombreUsuario);
    }

    public List<ScoreAmigo> obtenerSugerenciasDeAmigosBasadosEnComunidadesConScore(String nombreUsuario) {
        return scoreAmigoRepository.sugerenciasDeAmigosBasadosEnComunidades(nombreUsuario);
    }

    public List<ScoreAmigo> obtenerSugerenciasDeAmigosBasadosEnEventosConScore(String nombreUsuario) {
        return scoreAmigoRepository.sugerenciasDeAmigosBasadosEnEventos(nombreUsuario);
    }


public List<ScoreAmigo> obtenerTodasLasSugerenciasDeAmigosConScore(String nombreUsuario) {
    // Obtener las sugerencias de amigos de las diferentes fuentes
    List<ScoreAmigo> amigosBasadosEnAmigos = scoreAmigoRepository.sugerenciaDeAmigosBasadaEnAmigos(nombreUsuario);
    List<ScoreAmigo> amigosBasadosEnComunidades = scoreAmigoRepository.sugerenciasDeAmigosBasadosEnComunidades(nombreUsuario);
    List<ScoreAmigo> amigosBasadosEnEventos = scoreAmigoRepository.sugerenciasDeAmigosBasadosEnEventos(nombreUsuario);
    
    // Combinar todas las sugerencias en una sola lista
    List<ScoreAmigo> todasLasSugerencias = new ArrayList<>();
    todasLasSugerencias.addAll(amigosBasadosEnAmigos);
    todasLasSugerencias.addAll(amigosBasadosEnComunidades);
    todasLasSugerencias.addAll(amigosBasadosEnEventos);

    // Eliminar duplicados y sumar los scores
    List<ScoreAmigo> resultadoFinal = new ArrayList<>();

    for (ScoreAmigo nuevoScore : todasLasSugerencias) {
        boolean encontrado = false;

        for (ScoreAmigo existente : resultadoFinal) {
            // Si ya existe, sumar el score
            if (existente.getUsuarioId().equals(nuevoScore.getUsuarioId())) {
                existente.setScore(existente.getScore() + nuevoScore.getScore());
                encontrado = true;
                break; // Salir del bucle, ya no necesitamos seguir buscando
            }
        }

        // Si no existe, añadir el nuevo ScoreAmigo a la lista
        if (!encontrado) {
            resultadoFinal.add(nuevoScore);
        }
    }

    resultadoFinal.sort(Comparator.comparingInt(ScoreAmigo::getScore).reversed());


    return resultadoFinal;
}

}
