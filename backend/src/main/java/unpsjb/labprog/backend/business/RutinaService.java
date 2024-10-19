package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Ejercicio;
import unpsjb.labprog.backend.model.Rutina;

@Service
public class RutinaService {

    @Autowired
    RutinaRepository rutinaRepository;

    @Autowired
    EjercicioRepository ejercicioRepository;

    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }


    public List<Rutina> sugerenciasDeRutinasBasadosEnAmigos(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos(nombreUsuario);
    }


    @Transactional
    public Rutina save(Rutina rutina) throws Exception {
        if(rutina.getNombre()==null){
            throw new Exception("La rutina debe tener nombre");
        }

        //if rutina no tiene ejercicios
        
        return rutinaRepository.save(rutina);
    }

    @Transactional
    public void deleteById(Long id) {
        rutinaRepository.deleteById(id);
    }

    public Rutina findById(Long id){
        return rutinaRepository.findById(id).orElse(null);
    }

    public List<Ejercicio> ejercicios(Long idRutina){
        return ejercicioRepository.findEjerciciosByRutinaId(idRutina);
    }

    public List<Rutina> sugerenciasDeRutinasBasadasEnRutinas(String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadasEnRutinas(nombreUsuario);
    }

    public List<Rutina> sugerenciasDeRutinasBasadasEnComunidades(String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadasEnComunidades(nombreUsuario);
    }

    public List<Rutina> sugerenciaDeRutinasBasadosEnEventos (String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadosEnEventos(nombreUsuario);
    }
    public List<Rutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta (String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(nombreUsuario);
    }


       public List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventos2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadosEnEventos2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadosEnAmigos2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadasEnRutinas2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadasEnRutinas2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadasEnComunidades2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadasEnComunidades2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> obtenerTodasLasSugerenciasDeRutinas(String nombreUsuario) {
        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreRutina> sugerenciasEventos = rutinaRepository.sugerenciasDeRutinasBasadosEnEventos2(nombreUsuario);
        List<ScoreRutina> sugerenciasAmigos = rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos2(nombreUsuario);
        List<ScoreRutina> sugerenciasComunidades = rutinaRepository.sugerenciasDeRutinasBasadasEnComunidades2(nombreUsuario);
        List<ScoreRutina> sugerenciasRutinas = rutinaRepository.sugerenciasDeRutinasBasadasEnRutinas2(nombreUsuario);
        List<ScoreRutina> sugerenciasEventosPorEtiquetas = rutinaRepository.sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(nombreUsuario);


    
        // Imprimir la cantidad de sugerencias para depuración
        System.out.println("Sugerencias amigos: " + sugerenciasAmigos.size());
        System.out.println("Sugerencias eventos: " + sugerenciasEventos.size());
        System.out.println("Sugerencias comunidades: " + sugerenciasComunidades.size());
    
        // Combinar todas las sugerencias en una sola lista
        List<ScoreRutina> todasLasSugerencias = new ArrayList<>();
        todasLasSugerencias.addAll(sugerenciasAmigos);
        todasLasSugerencias.addAll(sugerenciasEventos);
        todasLasSugerencias.addAll(sugerenciasComunidades);
        todasLasSugerencias.addAll(sugerenciasRutinas);
        todasLasSugerencias.addAll(sugerenciasEventosPorEtiquetas);


        // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
        Map<Long, ScoreRutina> mapaSugerencias = new HashMap<>();
    
        for (ScoreRutina scoreEvento : todasLasSugerencias) {
            // Si la comunidad ya existe en el mapa, sumar los scores
            mapaSugerencias.merge(scoreEvento.getRutina().getId(),
                    new ScoreRutina(scoreEvento.getRutina(), scoreEvento.getScore()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        return existente; // Retornar el objeto existente actualizado
                    });
        }
    
        // Obtener la lista de ScoreComunidad sin duplicados con los scores sumados
        List<ScoreRutina> listaSugerenciasSinDuplicados = new ArrayList<>(mapaSugerencias.values());
    
        // Ordenar la lista por score en orden descendente
        listaSugerenciasSinDuplicados.sort((a, b) -> Double.compare(b.getScore(), a.getScore())); // Orden descendente
    
        // Retornar la lista ordenada
        return listaSugerenciasSinDuplicados;
    }

}