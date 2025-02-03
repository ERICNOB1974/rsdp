package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private PublicacionRepository publicacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public void notificarInscripcionEvento(Long idUsuario, Long idEvento) {
        notificacionRepository.crearNotificacion(
                idUsuario,
                idEvento,
                "Inscripción a evento",
                LocalDateTime.now());
        enviarEventoTiempoReal(idUsuario, "Inscripción a evento");
    }

    public void notificarAceptacionAmistad(Long idUsuario, Long idAmigo) {
        notificacionRepository.crearNotificacion(
                idUsuario,
                idAmigo,
                "Aceptación de solicitud de amistad",
                LocalDateTime.now());
        enviarEventoTiempoReal(idUsuario, "Aceptación de solicitud de amistad");
    }

    public List<Notificacion> obtenerNotificacionesPorUsuario(Long usuarioId) throws Exception {
        // Paso 1: Obtener los IDs de las notificaciones
        List<Long> notificacionIds = notificacionRepository.findNotificacionIdsByUsuario(usuarioId);

        // Paso 2: Construir la lista de objetos Notificacion
        List<Notificacion> notificaciones = new ArrayList<>();
        for (Long id : notificacionIds) {
            Notificacion notificacion = obtenerNotificacionPorId(id);
            if (notificacion != null) {
                notificaciones.add(notificacion);
            }
        }
        // Paso 3: Ordenar por no leídas primero y luego por fecha (más reciente
        // primero)
        notificaciones.sort(Comparator.comparing(Notificacion::isLeida)
                .thenComparing(Notificacion::getFecha, Comparator.reverseOrder()));
        return notificaciones;
    }

    public Notificacion obtenerNotificacionPorId(Long id) throws Exception {
        String tipo = notificacionRepository.findTipoById(id);
        String mensaje = notificacionRepository.findMensajeById(id);
        LocalDateTime fecha = notificacionRepository.findFechaById(id);
        boolean leida = notificacionRepository.findLeidaById(id);
        Long entidadId = notificacionRepository.findEntidadIdById(id);

        if (tipo == null || mensaje == null || fecha == null || entidadId == null) {
            throw new Exception("Notificación no encontrada con ID: " + id);
        }

        // Construir el objeto Notificacion
        Notificacion notificacion = new Notificacion();
        notificacion.setId(id);
        notificacion.setTipo(tipo);
        notificacion.setMensaje(mensaje);
        notificacion.setFecha(fecha);
        notificacion.setLeida(leida);
        notificacion.setEntidadId(entidadId);

        return notificacion;
    }

    public void crearNotificacion(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha) {
        // Crea la notificación en la base de datos
        notificacionRepository.crearNotificacion(idUsuario, idEntidad, tipo, fecha);
        enviarEventoTiempoReal(idUsuario, tipo);

    }

    public void crearNotificacionPublicacion(Long idUsuarioReceptor, Long idUsuarioEmisor, Long idEntidad, String tipo,
            LocalDateTime fecha) {
        if (idUsuarioReceptor != idUsuarioEmisor) {
            if (publicacionRepository.publicadaYNoAprobada(idEntidad)) {
                return;
            }
            notificacionRepository.crearNotificacionPublicacion(idUsuarioReceptor, idUsuarioEmisor, idEntidad, tipo,
                    fecha);
            enviarEventoTiempoReal(idUsuarioReceptor, tipo);
        }
    }

    public void eliminarNotificacionSolicitudEntrante(Long idReceptor, Long idEmisor) {
        notificacionRepository.eliminarNotificacion(idReceptor, idEmisor, "SOLICITUD_ENTRANTE");
    }

    public void notificarEventoProximo() {
        List<Evento> eventos = eventoRepository.eventosProximos();
        for (Evento ev : eventos) {
            List<Usuario> inscriptos = usuarioRepository.inscriptosEvento(ev.getId());
            for (Usuario u : inscriptos) {
                this.crearNotificacion(u.getId(), ev.getId(), "RECORDATORIO_EVENTO_PROXIMO", LocalDateTime.now());
                enviarEventoTiempoReal(u.getId(), "RECORDATORIO_EVENTO_PROXIMO");

            }
        }
    }

    public void notificarCambioEvento(String mensaje, Evento evento) {
        List<Usuario> inscriptos = usuarioRepository.inscriptosEvento(evento.getId());
        for (Usuario u : inscriptos) {
            notificacionRepository.crearNotificacionCambioEvento(u.getId(), evento.getId(),
                    "MODIFICACION_EVENTO", LocalDateTime.now(), mensaje);
            enviarEventoTiempoReal(u.getId(), "MODIFICACION_EVENTO");

        }

    }

    public String marcarLeida(Long idNotificacion) {
        notificacionRepository.setearNotifacionLeida(idNotificacion);
        return "Notificacion marcada como leida correctamente";
    }

    public String deleteById(Long idNotificacion) {
        notificacionRepository.deleteById(idNotificacion);
        return "Notificacion marcada como leida correctamente";
    }
    // Otros métodos para diferentes tipos de notificaciones

    public void notificarExpulsionEvento(String mensaje, Long idEvento, Long idUsuario) {
        this.notificacionRepository.crearNotificacionMotivoExpulsion(idUsuario, idEvento, "EXPULSION_EVENTO",
                LocalDateTime.now(), mensaje);
        enviarEventoTiempoReal(idUsuario, "EXPULSION_EVENTO");

    }

    public void notificarExpulsionComunidad(String mensaje, Long idComunidad, Long idUsuario) {
        this.notificacionRepository.crearNotificacionMotivoExpulsion(idUsuario, idComunidad, "EXPULSION_COMUNIDAD",
                LocalDateTime.now(), mensaje);
        enviarEventoTiempoReal(idUsuario, "EXPULSION_COMUNIDAD");

    }

    public void enviarEventoTiempoReal(Long idUsuario, String tipo) {
        messagingTemplate.convertAndSend("/queue/notificaciones/" + idUsuario, tipo);
        messagingTemplate.convertAndSend("/topic/notificaciones", tipo);

    }
}