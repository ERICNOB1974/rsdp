package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Comunidad;

@Service
public class ComunidadService {

    @Autowired
    ComunidadRepository comunidadRepository;
    @Autowired
    UsuarioRepository usuarioRepository;

    public List<Comunidad> findAll() {
        return comunidadRepository.findAll();
    }

    public int miembrosDeComunidad(Long idComunidad) {
        return comunidadRepository.miembrosDeComunidad(idComunidad);
    }

    public List<Comunidad> sugerenciasDeComunidadesBasadasEnAmigos(String nombreDeUsuario) {
        return comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos(nombreDeUsuario);
    }

    public List<Comunidad> sugerenciasDeComunidadesBasadasEnComunidades(String nombreDeUsuario) {
        return comunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades(nombreDeUsuario);
    }

    public List<Comunidad> sugerenciasDeComunidadesBasadasEnEventos(String nombreDeUsuario) {
        return comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos(nombreDeUsuario);
    }

    @Transactional
    public Comunidad save(Comunidad comunidad) {
        return comunidadRepository.save(comunidad);
    }

    @Transactional
    public void deleteById(Long id) {
        comunidadRepository.deleteById(id);
    }

    public Comunidad findById(Long id) {
        return comunidadRepository.findById(id).orElse(null);
    }

    public List<Comunidad> todasLasSugerencias(String nombreUsuario) {
        List<Comunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos(nombreUsuario);
        sugerencias.addAll(comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos(nombreUsuario));
        sugerencias.addAll(comunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades(nombreUsuario));
        Set<Comunidad> setUsuarios = new HashSet<Comunidad>();
        setUsuarios.addAll(sugerencias);
        sugerencias.removeAll(sugerencias);
        sugerencias.addAll(setUsuarios);
        return sugerencias;
    }

    public void etiquetarComunidad(Comunidad comunidad, Long etiqueta) {
        comunidadRepository.etiquetarComunidad(comunidad.getId(), etiqueta);
    }

    /*
     * esto tambien esta en UsuarioComunidadServce ver donde lo dejamos
     */
    public String verEstado(Long idComunidad, Long idUsuario) {
        if (usuarioRepository.esMiembro(idUsuario, idComunidad)) {
            return "Miembro";
        }
        if (usuarioRepository.solicitudIngresoExiste(idUsuario, idComunidad)) {
            return "Pendiente";
        }
        return "Vacio";
    }

    public String miembroSale(Long idComunidad, Long idUsuario) {
        if (!usuarioRepository.esMiembro(idUsuario, idComunidad)) {
            return "El usuario no pertenece a la comunidad.";
        }
        comunidadRepository.miembroSaliente(idComunidad, idUsuario);
        return "Exito al salir de la comunidad";
    }

   



      public List<Comunidad> disponibles() {
        return comunidadRepository.disponibles();
    }

    public List<Comunidad> miembroUsuario(Long idUsuario){
        return comunidadRepository.miembroUsuario(idUsuario);
    }
    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnAmigos2(String nombreUsuario) {
        List<ScoreComunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }


    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnEventos2(String nombreUsuario) {
        List<ScoreComunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }


    public List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnComunidades2(String nombreUsuario) {
        List<ScoreComunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades2(nombreUsuario);
        sugerencias.forEach(s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreComunidad> obtenerTodasLasSugerenciasDeComunidades(String nombreUsuario) {
        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreComunidad> sugerenciasAmigos = comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos2(nombreUsuario);
        List<ScoreComunidad> sugerenciasEventos = comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos2(nombreUsuario);
        List<ScoreComunidad> sugerenciasComunidades = comunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades2(nombreUsuario);
    
        // Imprimir la cantidad de sugerencias para depuración
        System.out.println("Sugerencias amigos: " + sugerenciasAmigos.size());
        System.out.println("Sugerencias eventos: " + sugerenciasEventos.size());
        System.out.println("Sugerencias comunidades: " + sugerenciasComunidades.size());
    
        // Combinar todas las sugerencias en una sola lista
        List<ScoreComunidad> todasLasSugerencias = new ArrayList<>();
        todasLasSugerencias.addAll(sugerenciasAmigos);
        todasLasSugerencias.addAll(sugerenciasEventos);
        todasLasSugerencias.addAll(sugerenciasComunidades);
    
        // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
        Map<Long, ScoreComunidad> mapaSugerencias = new HashMap<>();
    
        for (ScoreComunidad scoreComunidad : todasLasSugerencias) {
            // Si la comunidad ya existe en el mapa, sumar los scores
            mapaSugerencias.merge(scoreComunidad.getComunidad().getId(),
                    new ScoreComunidad(scoreComunidad.getComunidad(), scoreComunidad.getScore()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        return existente; // Retornar el objeto existente actualizado
                    });
        }
    
        // Obtener la lista de ScoreComunidad sin duplicados con los scores sumados
        List<ScoreComunidad> listaSugerenciasSinDuplicados = new ArrayList<>(mapaSugerencias.values());
    
        // Ordenar la lista por score en orden descendente
        listaSugerenciasSinDuplicados.sort((a, b) -> Double.compare(b.getScore(), a.getScore())); // Orden descendente
    
        // Retornar la lista ordenada
        return listaSugerenciasSinDuplicados;
    }
}