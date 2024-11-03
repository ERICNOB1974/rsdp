package unpsjb.labprog.backend.business;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.exceptions.EventoException;
import unpsjb.labprog.backend.model.Etiqueta;
import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class EventoService {

    @Autowired
    EventoRepository eventoRepository;

    @Autowired
    EtiquetaRepository etiquetaRepository;

    @Autowired
    NotificacionService notificacionService;

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    EmailService emailService;

    @Autowired
    LocationService locationService;

    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    public List<Evento> sugerenciaDeEventosBasadosEnEventos(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnEventos(nombreUsuario);
    }

    public List<Evento> sugerenciaDeEventosBasadosEnRutinas(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnRutinas(nombreUsuario);
    }

    public List<Evento> sugerenciaDeEventosBasadosEnComunidades(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnComunidades(nombreUsuario);
    }

    public List<Evento> sugerenciasDeEventosBasadosEnAmigos(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnAmigos(nombreUsuario);
    }

    @Transactional
    public Evento crear(Evento evento) throws MessagingException, EventoException {
        // Validar fecha y hora del evento
        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) || evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
            throw new EventoException("El evento no puede crearse en el futuro");
        }
        if (evento.getFechaHora().toLocalDate().isBefore(evento.getFechaDeCreacion()) ||
                evento.getFechaHora().toLocalDate().isEqual(evento.getFechaDeCreacion())) {
            throw new EventoException("El evento no puede tener una fecha anterior a la fecha de creacion");
        }

        // Validar latitud y longitud
        if (evento.getLatitud() < -90 || evento.getLatitud() > 90) {
            throw new EventoException("La latitud debe estar entre -90 y 90 grados");
        }
        if (evento.getLongitud() < -180 || evento.getLongitud() > 180) {
            throw new EventoException("La longitud debe estar entre -180 y 180 grados");
        }

        /*
         * if (eventoRepository.enComunidad() && !evento.isEsPrivadoParaLaComunidad()) {
         * exception
         * }
         */

        return eventoRepository.save(evento);
    }

    @Transactional
    public Evento crearConCreador(Evento evento, String nombreUsuario) throws MessagingException, EventoException {
        // suponiendo que se crea ahora mismo
        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) ||
                evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
            throw new EventoException("El evento no puede crearse en el futuro");
        }

        Evento c = eventoRepository.save(evento);
        eventoRepository.establecerCreador(c.getId(), usuarioService.findByNombreUsuario(nombreUsuario).getId());
        return c;
    }

    @Transactional
    public Evento crearConCreadorParaEventoInternoParaComunidad(Evento evento, String nombreUsuario, Long comunidadId) throws MessagingException, EventoException {
        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) ||
                evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
            throw new EventoException("El evento no puede crearse en el futuro");
        }

        evento.setEsPrivadoParaLaComunidad(true);
    
        // Guardar el evento
        Evento c = eventoRepository.save(evento);
        
        // Establecer la relación CREADO_POR entre el evento y el usuario
        eventoRepository.establecerCreador(c.getId(), usuarioService.findByNombreUsuario(nombreUsuario).getId());
    
        // Establecer la relación EVENTO_INTERNO entre el evento y la comunidad
        eventoRepository.establecerEventoInterno(c.getId(), comunidadId);
    
        return c;
        
    }
    

    public List<Evento> todasLasSugerencias(String nombreUsuario) {
        List<Evento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnAmigos(nombreUsuario);
        sugerencias.addAll(eventoRepository.sugerenciasDeEventosBasadosEnComunidades(nombreUsuario));
        sugerencias.addAll(eventoRepository.sugerenciasDeEventosBasadosEnEventos(nombreUsuario));
        Set<Evento> setUsuarios = new HashSet<Evento>();
        setUsuarios.addAll(sugerencias);
        sugerencias.removeAll(sugerencias);
        sugerencias.addAll(setUsuarios);
        return sugerencias;
    }

    public void mail(Evento evento) throws MessagingException {
        Optional<Evento> eventoViejo = eventoRepository.findById(evento.getId());
        if (!eventoViejo.isEmpty()) {
            boolean cambioFecha = evento.getFechaHora() != eventoViejo.get().getFechaHora();
            boolean cambioUbicacion = (evento.getLatitud() != eventoViejo.get().getLatitud())
                    || (evento.getLongitud() != eventoViejo.get().getLongitud());
            emailService.enviarMailCambio(cambioFecha, cambioUbicacion, evento);
        }
        if (eventoViejo.isEmpty() && evento.isEsPrivadoParaLaComunidad()) {
            // emailService.enviarMail();
        }
    }

    public void notificar(Evento evento) {
        Optional<Evento> eventoViejo = eventoRepository.findById(evento.getId());
        if (!eventoViejo.isEmpty()) {
            boolean cambioDescripcion = evento.getDescripcion() != eventoViejo.get().getDescripcion();
            boolean cambioFecha = evento.getFechaHora() != eventoViejo.get().getFechaHora();
            boolean cambioUbicacion = (evento.getLatitud() != eventoViejo.get().getLatitud())
                    || (evento.getLongitud() != eventoViejo.get().getLongitud());
            if (cambioDescripcion || cambioFecha || cambioUbicacion) {
                String mensaje = crearMensaje(evento, cambioFecha, cambioUbicacion, cambioDescripcion);
                notificacionService.notificarCambioEvento(mensaje, evento);
            }
        }
    }

    public String crearMensaje(Evento evento, boolean cambioFecha, boolean cambioUbicacion, boolean cambioDescripcion) {
        String mensajeParte1 = "El evento " + evento.getNombre() + " sufrió un cambio en ";
        StringBuilder mensajeParte2 = new StringBuilder();

        if (cambioFecha) {
            mensajeParte2.append("la fecha");
        }
        if (cambioUbicacion) {
            if (mensajeParte2.length() > 0) {
                mensajeParte2.append(cambioDescripcion ? ", " : " y ");
            }
            mensajeParte2.append("la ubicación");
        }
        if (cambioDescripcion) {
            if (mensajeParte2.length() > 0) {
                mensajeParte2.append(" y ");
            }
            mensajeParte2.append("la descripción");
        }

        mensajeParte2.append(".");

        return mensajeParte1 + mensajeParte2;
    }

    @Transactional
    public Evento actualizar(Evento evento) throws MessagingException, EventoException {
        mail(evento);
        notificar(evento);

        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) ||
                evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        return eventoRepository.save(evento);
        // suponiendo que se crea ahora mismo
        /*
         * 
         * if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
         * throw new EventoException("El evento no puede crearse en el futuro");
         * 
         * }
         */

        // opciones para cuando hay una relacion
        /*
         * 1. establecer la relacion aca obligatoriamente si es nuevo el evento.
         * si es viejo la busco. si quiero actualizar esa relacion no permitir que la
         * actualice mal
         * 
         */
    }

    @Transactional
    public void deleteById(Long id) {
        eventoRepository.deleteById(id);
    }

    public Evento findById(Long id) {
        return eventoRepository.findById(id).orElse(null);
    }

    public List<Evento> eventosProximos() {
        return eventoRepository.eventosProximos();
    }

    public List<Evento> eventosCreadosPorUsuario(Long idUsuario, int offset, int limit) {
        return eventoRepository.eventosCreadosPorUsuario(idUsuario, offset, limit);
    }

    public List<Evento> eventosNuevosComunidad(Usuario u) {
        return eventoRepository.eventosNuevosComunidad(u);
    }

    public int participantesDeEvento(Long idEvento) {
        return eventoRepository.participantesDeEvento(idEvento);
    }

    public List<Evento> eventosDeUnaComunidad(Long comunidadId) {
        return eventoRepository.eventosDeUnaComunidad(comunidadId);
    }

    public void etiquetarEvento(Evento evento, Long etiqueta) {
        eventoRepository.etiquetarEvento(evento.getId(), etiqueta);
    }

    public boolean participa(String nombreUsuario, Long idEvento) {
        Usuario u = usuarioService.findByNombreUsuario(nombreUsuario);
        return eventoRepository.participa(u.getId(), idEvento);
    }

    public String desinscribirse(Long idEvento, Long idUsuario) {
        if (!eventoRepository.participa(idUsuario, idEvento)) {
            return "El usuario no participa en el evento";
        }
        eventoRepository.desinscribirse(idEvento, idUsuario);
        return "Exito al desinscribirse del evento";
    }

    public List<Evento> eventosEtiquetas(List<String> etiquetas) {
        return eventoRepository.eventosEtiquetas(etiquetas);
    }

    public List<Evento> eventosNombre(String nombre) {
        return eventoRepository.eventosNombre(nombre);
    }

    public List<Evento> eventosFecha(ZonedDateTime min, ZonedDateTime max) {
        return eventoRepository.eventosFecha(min, max);
    }

    public List<Evento> eventosParticipantes(int min, int max) {
        return eventoRepository.eventosCantidadParticipantes(min, max);
    }

    public List<Evento> disponibles() {
        return eventoRepository.disponibles();
    }

    public List<Evento> participaUsuario(Long idUsuario) {
        return eventoRepository.participaUsuario(idUsuario);
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnEventos2(String nombreUsuario) {
        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnEventos2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnAmigos2(String nombreUsuario) {
        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnAmigos2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnComunidades2(String nombreUsuario) {
        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnComunidades2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnRutinas2(String nombreUsuario) {
        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnRutinas2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreEvento> obtenerTodasLasSugerenciasDeEventos(String nombreUsuario) {
        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreEvento> sugerenciasEventos = eventoRepository.sugerenciasDeEventosBasadosEnEventos2(nombreUsuario);
        List<ScoreEvento> sugerenciasAmigos = eventoRepository.sugerenciasDeEventosBasadosEnAmigos2(nombreUsuario);
        List<ScoreEvento> sugerenciasComunidades = eventoRepository
                .sugerenciasDeEventosBasadosEnComunidades2(nombreUsuario);
        List<ScoreEvento> sugerenciasRutinas = eventoRepository.sugerenciasDeEventosBasadosEnRutinas2(nombreUsuario);

        // Combinar todas las sugerencias en una sola lista
        List<ScoreEvento> todasLasSugerencias = new ArrayList<>();
        todasLasSugerencias.addAll(sugerenciasAmigos);
        todasLasSugerencias.addAll(sugerenciasEventos);
        todasLasSugerencias.addAll(sugerenciasComunidades);
        todasLasSugerencias.addAll(sugerenciasRutinas);

        // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
        Map<Long, ScoreEvento> mapaSugerencias = new HashMap<>();

        for (ScoreEvento scoreEvento : todasLasSugerencias) {
            // Si la comunidad ya existe en el mapa, sumar los scores
            mapaSugerencias.merge(scoreEvento.getEvento().getId(),
                    new ScoreEvento(scoreEvento.getEvento(), scoreEvento.getScore()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        return existente; // Retornar el objeto existente actualizado
                    });
        }

        // Obtener la lista de ScoreComunidad sin duplicados con los scores sumados
        List<ScoreEvento> listaSugerenciasSinDuplicados = new ArrayList<>(mapaSugerencias.values());

        // Ordenar la lista por score en orden descendente
        listaSugerenciasSinDuplicados.sort((a, b) -> Double.compare(b.getScore(), a.getScore())); // Orden descendente

        // Retornar la lista ordenada
        return listaSugerenciasSinDuplicados;
    }

    public List<Evento> eventosFuturosPertenecientesAUnUsuario(String nombreUsuario) {
        return eventoRepository.eventosFuturosPertenecientesAUnUsuario(nombreUsuario);
    }

    public boolean esCreadoPor(Long idUsuario, Long idEvento) {
        return eventoRepository.eventoCreadoPor(idUsuario, idEvento);
    }

    public List<Etiqueta> etiquetasEvento(Long idEvento) {
        return etiquetaRepository.etiquetasEnEvento(idEvento);
    }

    public void eliminar(Long idEvento) {
        this.eventoRepository.delete(this.eventoRepository.findById(idEvento).get());
    }

    public List<Usuario> todosLosParticipantes(Long idEvento) {
        return usuarioService.inscriptosEvento(idEvento);
    }

    public void eliminarUsuario(Long idEvento, Long idUsuario) {
        this.eventoRepository.eliminarUsuario(idEvento, idUsuario);
    }
    
}
