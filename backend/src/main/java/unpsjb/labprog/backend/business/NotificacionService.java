package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

     @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public void notificarInscripcionEvento(Long idUsuario, Long idEvento) {
        notificacionRepository.crearNotificacion(
            idUsuario, 
            idEvento, 
            "Inscripción a evento", 
            LocalDateTime.now()
        );
    }

    public void notificarAceptacionAmistad(Long idUsuario, Long idAmigo) {
        notificacionRepository.crearNotificacion(
            idUsuario, 
            idAmigo, 
            "Aceptación de solicitud de amistad", 
            LocalDateTime.now()
        );
    }

    public List<Notificacion> obtenerNotificaciones(Long idUsuario) {
        return notificacionRepository.findNotificacionesByUsuario(idUsuario);
    }


    public void crearNotificacion(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha) {
        // Crea la notificación en la base de datos
        notificacionRepository.crearNotificacion(idUsuario, idEntidad, tipo, fecha);
    }

    public void eliminarNotificacionSolicitudEntrante(Long idReceptor, Long idEmisor) {
        notificacionRepository.eliminarNotificacion(idReceptor, idEmisor, "SOLICITUD_ENTRANTE");
    }

    public void notificarEventoProximo() {
        List<Evento> eventos = eventoRepository.eventosProximos();
        for (Evento ev : eventos) {
            List<Usuario> inscriptos = usuarioRepository.inscriptosEvento(ev.getId());
            for (Usuario u : inscriptos) {
                this.crearNotificacion(u.getId(),ev.getId(),"RECORDATORIO_EVENTO_PROXIMO",LocalDateTime.now());
            }
        }
    }

    // Otros métodos para diferentes tipos de notificaciones
}
