package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificacionService {

     @Autowired
    private NotificacionRepository notificacionRepository;

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


    public void crearNotificacion(Long idUsuario, Long idEntidad, String mensaje, LocalDateTime fecha) {
        // Crea la notificación en la base de datos
        notificacionRepository.crearNotificacion(idUsuario, idEntidad, mensaje, fecha);
    }

    public void eliminarNotificacionSolicitudEntrante(Long idReceptor, Long idEmisor) {
        notificacionRepository.eliminarNotificacion(idReceptor, idEmisor, "SOLICITUD_ENTRANTE");
    }

    // Otros métodos para diferentes tipos de notificaciones
}
