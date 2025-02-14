package unpsjb.labprog.backend.business;

import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.ArrayList;
import java.util.Collections;
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

        String ubicacion = locationService.getDisplayName(evento.getLatitud(), evento.getLongitud());

        evento.setUbicacion(ubicacion);

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

        String ubicacion = locationService.getDisplayName(evento.getLatitud(), evento.getLongitud());

        evento.setUbicacion(ubicacion);

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
    public Evento crearConCreadorParaEventoInternoParaComunidad(Evento evento, String nombreUsuario, Long comunidadId)
            throws MessagingException, EventoException {

        String ubicacion = locationService.getDisplayName(evento.getLatitud(), evento.getLongitud());

        evento.setUbicacion(ubicacion);

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
            boolean cambioUbicacion= (eventoViejo.get().getLatitud()!=evento.getLatitud()) || (eventoViejo.get().getLongitud()!=evento.getLongitud());
            boolean cambioFecha = !evento.getFechaHora()
                    .truncatedTo(ChronoUnit.SECONDS) // Elimina nanosegundos
                    .equals(eventoViejo.get().getFechaHora().truncatedTo(ChronoUnit.SECONDS)); 
            if (cambioFecha || cambioUbicacion) {
                emailService.enviarMailCambio(cambioFecha, cambioUbicacion, evento);
            }
        }
    }

    public void notificar(Evento evento) {
        Optional<Evento> eventoViejo = eventoRepository.findById(evento.getId());
        if (!eventoViejo.isEmpty()) {
            boolean cambioDescripcion = evento.getDescripcion() != eventoViejo.get().getDescripcion();
            boolean cambioFecha = evento.getFechaHora() != eventoViejo.get().getFechaHora();
            boolean cambioUbicacion = eventoViejo.get().getUbicacion() != evento.getUbicacion();
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
        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) ||
                evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        mail(evento);
        notificar(evento);
        return eventoRepository.save(evento);
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

    public List<Evento> eventosEtiquetas(List<String> etiquetas, String tipo, Long usuarioId) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosEtiquetasDisponibles(usuarioId, etiquetas);
        } else if ("participante".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosEtiquetasParticipante(usuarioId, etiquetas);
        } else {
            return eventoRepository.eventosEtiquetas(etiquetas, usuarioId);
        }
    }

    public List<Evento> eventosNombre(String nombre, String tipo, Long usuarioId) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosNombreDisponibles(nombre, usuarioId);
        } else if ("participante".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosNombreParticipante(nombre, usuarioId);
        } else {
            return eventoRepository.eventosNombre(nombre, usuarioId);
        }
    }

    public List<Evento> eventosFecha(String tipo, Long usuarioId, ZonedDateTime min, ZonedDateTime max) {
        ZonedDateTime fechaInicioUtc = min.withZoneSameInstant(ZoneOffset.UTC);
        ZonedDateTime fechaFinUtc = max.withZoneSameInstant(ZoneOffset.UTC);
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosFechaDisponible(usuarioId, fechaInicioUtc, fechaFinUtc);
        } else if ("participante".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosFechaParticipante(usuarioId, fechaInicioUtc, fechaFinUtc);
        } else {
            return eventoRepository.eventosFecha(fechaInicioUtc, fechaFinUtc, usuarioId);
        }
    }

    public List<Evento> eventosDesdeFecha(String tipo, Long usuarioId, ZonedDateTime min) {
        ZonedDateTime fechaInicioUtc = min.withZoneSameInstant(ZoneOffset.UTC);
        
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosDesdeFechaDisponible(usuarioId, fechaInicioUtc);
        } else if ("participante".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosDesdeFechaParticipante(usuarioId, fechaInicioUtc);
        } else {
            return eventoRepository.eventosDesdeFecha(fechaInicioUtc, usuarioId);
        }
    }
    

    public List<Evento> eventosParticipantes(String tipo, Long usuarioId, int min, int max) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosCantidadParticipantesDisponible(usuarioId, min, max);
        } else if ("participante".equalsIgnoreCase(tipo)) {
            return eventoRepository.eventosCantidadParticipantesParticipante(usuarioId, min, max);
        } else {
            return eventoRepository.eventosCantidadParticipantes(min, max, usuarioId);
        }
    }

    public List<Evento> eventosDisponibles(String nombreUsuario, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        return eventoRepository.disponibles(nombreUsuario, skip, size);
    }

    public List<Evento> participaUsuario(Long idUsuario, String nombreEvento, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreEvento == null || nombreEvento.trim().isEmpty()) ? "" : nombreEvento;
        return eventoRepository.participaUsuario(idUsuario, filtroNombre, skip, size);
    }
    public List<Evento> participaUsuarioAFuturo(Long idUsuario, String nombreEvento, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreEvento == null || nombreEvento.trim().isEmpty()) ? "" : nombreEvento;
        return eventoRepository.participaUsuarioAFuturo(idUsuario, filtroNombre, skip, size);
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnEventos2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnEventos2(nombreUsuario,
                generoUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnAmigos2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnAmigos2(nombreUsuario,
                generoUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnComunidades2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnComunidades2(nombreUsuario,
                generoUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreEvento> sugerenciasDeEventosBasadosEnRutinas2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreEvento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnRutinas2(nombreUsuario,
                generoUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getEvento().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public Map<String, Object> obtenerSugerenciasEventosConTotalPaginas(String nombreUsuario, int page, int pageSize) {

        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        // Obtener todas las sugerencias de eventos (como en tu código original)
        List<ScoreEvento> sugerenciasEventos = eventoRepository.sugerenciasDeEventosBasadosEnEventos2(nombreUsuario,
                generoUsuario);
        List<ScoreEvento> sugerenciasAmigos = eventoRepository.sugerenciasDeEventosBasadosEnAmigos2(nombreUsuario,
                generoUsuario);
        List<ScoreEvento> sugerenciasComunidades = eventoRepository
                .sugerenciasDeEventosBasadosEnComunidades2(nombreUsuario, generoUsuario);
        List<ScoreEvento> sugerenciasRutinas = eventoRepository.sugerenciasDeEventosBasadosEnRutinas2(nombreUsuario,
                generoUsuario);

        // Combinar todas las sugerencias en una sola lista
        List<ScoreEvento> todasLasSugerencias = new ArrayList<>();
        todasLasSugerencias.addAll(sugerenciasAmigos);
        todasLasSugerencias.addAll(sugerenciasEventos);
        todasLasSugerencias.addAll(sugerenciasComunidades);
        todasLasSugerencias.addAll(sugerenciasRutinas);

        // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
        Map<Long, ScoreEvento> mapaSugerencias = new HashMap<>();
        for (ScoreEvento scoreEvento : todasLasSugerencias) {
            mapaSugerencias.merge(scoreEvento.getEvento().getId(),
                    new ScoreEvento(scoreEvento.getEvento(), scoreEvento.getScore(), scoreEvento.getMotivo()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        String nuevoMotivo = existente.getMotivo() + " --- " + nuevo.getMotivo();
                        existente.setMotivo(nuevoMotivo);
                        return existente;
                    });
        }

        for (ScoreEvento scoreEvento : mapaSugerencias.values()) {
            String motivo = scoreEvento.getMotivo();
            if (!motivo.contains("Está adecuado a tus preferencias de género")) {
                motivo += " --- Está adecuado a tus preferencias de género";
                scoreEvento.setMotivo(motivo);
            }
        }

        // Obtener la lista de ScoreEvento sin duplicados con los scores sumados
        List<ScoreEvento> listaSugerenciasSinDuplicados = new ArrayList<>(mapaSugerencias.values());

        // Ordenar la lista por score en orden descendente
        listaSugerenciasSinDuplicados.sort((a, b) -> Double.compare(b.getScore(), a.getScore()));

        // Calcular el total de páginas
        int totalElementos = listaSugerenciasSinDuplicados.size();
        int totalPaginas = (int) Math.ceil((double) totalElementos / pageSize);

        // Paginar la lista
        int start = page * pageSize;
        int end = Math.min(start + pageSize, listaSugerenciasSinDuplicados.size());

        if (start > end) {
            return Collections.emptyMap(); // Si la página está fuera de rango
        }

        // Crear el mapa con los datos de eventos y el total de páginas
        Map<String, Object> result = new HashMap<>();
        result.put("data", listaSugerenciasSinDuplicados.subList(start, end)); // Eventos de la página
        result.put("totalPaginas", totalPaginas); // Total de páginas

        return result;
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
        Evento e = eventoRepository.findById(idEvento).get();
        String notificacion = "Has sido eliminado del evento " + e.getNombre();
        this.eventoRepository.eliminar(idEvento);
                this.notificacionService.notificarEliminacionEvento(notificacion, idEvento);
    }

    public List<Usuario> todosLosParticipantes(Long idEvento) {
        return usuarioService.inscriptosEvento(idEvento);
    }

    public void eliminarUsuario(String mensaje, Long idEvento, Long idUsuario) {
        Evento e = eventoRepository.findById(idEvento).get();
        String notificacion = "Se ha eliminado el evento " + e.getNombre();
        this.notificacionService.notificarExpulsionEvento(notificacion, idEvento, idUsuario);
        this.eventoRepository.eliminarUsuario(idEvento, idUsuario, mensaje);
    }

    @Transactional
    public void agregarUbicacionAEventosSinUbicacion() {
        List<Evento> eventos = eventoRepository.findAll(); // Obtener todos los eventos

        for (Evento evento : eventos) {
            // Verificar si el evento ya tiene el atributo 'ubicacion'
            if (evento.getUbicacion() == null || evento.getUbicacion().isEmpty()) {
                try {
                    // Obtener latitud y longitud del evento
                    Double latitud = evento.getLatitud();
                    Double longitud = evento.getLongitud();

                    if (latitud != null && longitud != null) {
                        // Llamar al servicio para obtener el nombre de la ubicación
                        String ubicacion = locationService.getDisplayName(latitud, longitud);

                        // Actualizar el atributo 'ubicacion' del evento
                        evento.setUbicacion(ubicacion);

                        // Guardar los cambios en la base de datos
                        eventoRepository.save(evento);
                    }
                } catch (Exception e) {
                    // Manejo de errores al obtener la ubicación
                    System.err
                            .println("Error al procesar el evento con ID: " + evento.getId() + " - " + e.getMessage());
                }
            }
        }
    }

    public boolean estaExpulsado(Long idUsuario, Long idEvento) {
        return this.eventoRepository.estaExpulsado(idUsuario, idEvento);
    }

    public String motivoExpulsion(Long idUsuario, Long idEvento) {
        return this.eventoRepository.motivoExpulsion(idUsuario, idEvento);
    }

    public void desetiquetarEvento(Long idEvento, Long etiqueta) {
        eventoRepository.desetiquetarEvento(idEvento, etiqueta);
    }

       public List<Evento> eventosCreadosPorUsuarioFiltrados(Long idUsuario, String nombreEvento, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreEvento == null || nombreEvento.trim().isEmpty()) ? "" : nombreEvento;
        return eventoRepository.eventosCreadosPorUsuarioFiltrados(idUsuario, filtroNombre, skip, size);
    }
       public List<Evento> busquedaEventosCreadosPorUsuarioGoogle(Long idUsuario, String nombreEvento, int page, int size) {
        //int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreEvento == null || nombreEvento.trim().isEmpty()) ? "" : nombreEvento;
        return eventoRepository.busquedaEventosCreadosPorUsuarioGoogle(idUsuario, filtroNombre, page, size);
    }
       public List<Evento> busquedaEventosDisponiblesGoogle(Long idUsuario, String nombreEvento, int page, int size) {
        //int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreEvento == null || nombreEvento.trim().isEmpty()) ? "" : nombreEvento;
        return eventoRepository.busquedaEventosDisponiblesGoogle(idUsuario, filtroNombre, page, size);
    }
}
