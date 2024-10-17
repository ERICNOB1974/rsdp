package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ScoreComunidadService {


    @Autowired
    ScoreComunidadRepository scoreComunidadRepository;

    
    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnAmigosConScore(String nombreUsuario) {
        return scoreComunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos(nombreUsuario);
    }

    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnComunidadesConScore(String nombreUsuario) {
        return scoreComunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades(nombreUsuario);
    }

    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnEventosConScore(String nombreUsuario) {
        return scoreComunidadRepository.sugerenciasDeComunidadesBasadasEnEventos(nombreUsuario);
    }

   


    public List<ScoreComunidad> obtenerTodasLasSugerenciasDeComunidades(String nombreUsuario) {
    // Obtener todas las sugerencias de comunidades desde las tres consultas
    List<ScoreComunidad> sugerenciasAmigos = scoreComunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos(nombreUsuario);
    List<ScoreComunidad> sugerenciasEventos = scoreComunidadRepository.sugerenciasDeComunidadesBasadasEnEventos(nombreUsuario);
    List<ScoreComunidad> sugerenciasComunidades = scoreComunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades(nombreUsuario);

    // Combinar todas las sugerencias en una sola lista
    List<ScoreComunidad> todasLasSugerencias = new ArrayList<>();
    todasLasSugerencias.addAll(sugerenciasAmigos);
    todasLasSugerencias.addAll(sugerenciasEventos);
    todasLasSugerencias.addAll(sugerenciasComunidades);

    // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
    Map<Integer, ScoreComunidad> mapaSugerencias = new HashMap<>();
    
    for (ScoreComunidad scoreComunidad : todasLasSugerencias) {
        // Si la comunidad ya existe en el mapa, sumar los scores
        if (mapaSugerencias.containsKey(scoreComunidad.getComunidadId())) {
            ScoreComunidad existente = mapaSugerencias.get(scoreComunidad.getComunidadId());
            double nuevoScore = existente.getScore() + scoreComunidad.getScore();
            existente.setScore(nuevoScore); // Actualizar el score sumado
        } else {
            // Si no existe, agregarla al mapa
            mapaSugerencias.put(scoreComunidad.getComunidadId(), scoreComunidad);
        }
    }

    // Retornar la lista de ScoreComunidad sin duplicados con los scores sumados
    return new ArrayList<>(mapaSugerencias.values());
}
    
}
