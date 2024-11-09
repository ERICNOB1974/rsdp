package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class ComunidadService {

    @Autowired
    ComunidadRepository comunidadRepository;
    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    private NotificacionService notificacionService;

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
        if (comunidad.getId() != null) {
            Comunidad comVieja = comunidadRepository.findById(comunidad.getId()).get();
            if (comVieja.isEsPrivada() && !comunidad.isEsPrivada()) {
                comunidadRepository.save(comunidad);
                cambioAPublico(comVieja.getId());
            }
        }
        return comunidadRepository.save(comunidad);
    }

    public void cambioAPublico(Long idComunidad) {
        int disponibilidad = comunidadRepository.cuposDisponibles(idComunidad);
        List<Usuario> solicitudes = this.usuarioRepository.solicititudesPendientes(idComunidad);
        int minimo = Math.min(disponibilidad, solicitudes.size());
        //ver aca que onda
        for (int i = 0; i < minimo; i++) {
            aceptarSolicitud(solicitudes.get(i).getId(), idComunidad);
        }
        if (disponibilidad < solicitudes.size()) {
            for (int i = disponibilidad; i < solicitudes.size(); i++) {
                comunidadRepository.eliminarSolicitudIngreso(solicitudes.get(i).getId(), idComunidad);
            }
        }
    }

    public void aceptarSolicitud(Long idUsuario, Long idComunidad) {
        comunidadRepository.eliminarSolicitudIngreso(idUsuario, idComunidad);
        comunidadRepository.nuevoMiembro(idComunidad, idUsuario, LocalDateTime.now());
        notificacionService.crearNotificacion(idUsuario, idComunidad, "ACEPTACION_PRIVADA", LocalDateTime.now());

    }

    @Transactional
    public void deleteById(Long id) {
        comunidadRepository.deleteById(id);
    }

    public Comunidad findById(Long id) {
        return comunidadRepository.findById(id).orElse(null);
    }

    public void etiquetarComunidad(Comunidad comunidad, Long etiqueta) {
        comunidadRepository.etiquetarComunidad(comunidad.getId(), etiqueta);
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

    public List<Comunidad> miembroUsuario(Long idUsuario) {
        return comunidadRepository.miembroUsuario(idUsuario);
    }

    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnAmigos2(String nombreUsuario) {
        List<ScoreComunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos2(nombreUsuario);
        sugerencias.forEach(
                s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnEventos2(String nombreUsuario) {
        List<ScoreComunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos2(nombreUsuario);
        sugerencias.forEach(
                s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnComunidades2(String nombreUsuario) {
        List<ScoreComunidad> sugerencias = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnComunidades2(nombreUsuario);
        sugerencias.forEach(
                s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreComunidad> obtenerTodasLasSugerenciasDeComunidades(String nombreUsuario) {
        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreComunidad> sugerenciasAmigos = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnAmigos2(nombreUsuario);
        List<ScoreComunidad> sugerenciasEventos = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnEventos2(nombreUsuario);
        List<ScoreComunidad> sugerenciasComunidades = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnComunidades2(nombreUsuario);

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
                    new ScoreComunidad(scoreComunidad.getComunidad(), scoreComunidad.getScore(),
                            scoreComunidad.getMotivo()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        String nuevoMotivo = existente.getMotivo() + " --- " + nuevo.getMotivo();
                        existente.setMotivo(nuevoMotivo);
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

    public List<Comunidad> comunidadesEtiquetas(List<String> etiquetas) {
        return comunidadRepository.comunidadesEtiquetas(etiquetas);
    }

    public List<Comunidad> comunidadesNombre(String nombre) {
        return comunidadRepository.comunidadesNombre(nombre);
    }

    public List<Comunidad> comunidadesParticipantes(int min, int max) {
        return comunidadRepository.comunidadesCantidadParticipantes(min, max);
    }

    public List<Comunidad> comunidadesCreadasPorUsuario(Long idUsuario, int offset, int limit) {
        return comunidadRepository.comunidadesCreadasPorUsuario(idUsuario, offset, limit);
    }

    public boolean puedeVer(Long idComunidad, Long idUsuario) {
        Comunidad c = comunidadRepository.findById(idComunidad).orElse(null);
        if (c == null) {
            return false;
        }
        if (!c.isEsPrivada()) {
            return true;
        }
        if (c.isEsPrivada() && comunidadRepository.esMiembro(idComunidad, idUsuario)) {
            return true;
        }
        return false;
    }
}