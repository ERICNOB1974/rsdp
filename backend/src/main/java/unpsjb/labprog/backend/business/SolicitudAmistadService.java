package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Usuario;

@Service
public class SolicitudAmistadService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private NotificacionService notificacionService;

    public String enviarSolicitud(Long idEmisor, Long idReceptor) throws Exception {
        if (idEmisor.equals(idReceptor)) {
            throw new Exception("No puedes enviarte una solicitud a ti mismo.");
        }

        if (usuarioRepository.sonAmigos(idEmisor, idReceptor)) {
            throw new Exception("Ya existe una relación de amistad entre los usuarios.");
        }

        if (usuarioRepository.solicitudAmistadExiste(idEmisor, idReceptor)) {
            throw new Exception("Ya existe una solicitud de amistad entre los usuarios.");
        }
        // Buscar los usuarios en la base de datos
        Optional<Usuario> emisorOpt = usuarioRepository.findById(idEmisor);
        Optional<Usuario> receptorOpt = usuarioRepository.findById(idReceptor);

        if (emisorOpt.isEmpty() || receptorOpt.isEmpty()) {
            throw new Exception("Usuario no encontrado.");
        }
        usuarioRepository.enviarSolicitudAmistad(idEmisor, idReceptor, "pendiente", LocalDateTime.now());
        notificacionService.crearNotificacion(idReceptor, idEmisor, "SOLICITUD_ENTRANTE", LocalDateTime.now());
        return "Solicitud enviada correctamente";
    }

    public String gestionarSolicitudAmistad(Long idEmisor, Long idReceptor, boolean aceptada) throws Exception {
        if (idEmisor.equals(idReceptor)) {
            throw new Exception("No puedes ser amigo de tu mismo");
        }
        // Buscar los usuarios en la base de datos
        Optional<Usuario> emisorOpt = usuarioRepository.findById(idEmisor);
        Optional<Usuario> receptorOpt = usuarioRepository.findById(idReceptor);
                
        if (emisorOpt.isEmpty() || receptorOpt.isEmpty()) {
            throw new Exception("Usuario no encontrado.");
        }

        if (usuarioRepository.sonAmigos(idEmisor, idReceptor)) {
            throw new Exception("Ya existe una relación de amistad entre los usuarios.");
        }
        if (!usuarioRepository.solicitudAmistadExiste(idEmisor, idReceptor)) {
            throw new Exception("No existe una solicitud de amistad entre los usuarios.");
        }

        if(aceptada){
            usuarioRepository.rechazarSolicitudAmistad(idEmisor, idReceptor);
            usuarioRepository.aceptarSolicitudAmistad(idEmisor, idReceptor, LocalDateTime.now());
            notificacionService.crearNotificacion(idEmisor, idReceptor, "SOLICITUD_ACEPTADA", LocalDateTime.now());
            notificacionService.eliminarNotificacionSolicitudEntrante(idReceptor, idEmisor);
            return "Solicitud de amistad aceptada correctamente";
        }
        usuarioRepository.rechazarSolicitudAmistad(idEmisor, idReceptor);
        notificacionService.eliminarNotificacionSolicitudEntrante(idReceptor, idEmisor);
        return "Solicitud de amistad rechazada correctamente";
    }

    public String cancelarSolicitud(Long idEmisor, Long idReceptor) throws Exception {
        Optional<Usuario> emisorOpt = usuarioRepository.findById(idEmisor);
        Optional<Usuario> receptorOpt = usuarioRepository.findById(idReceptor);

        if (emisorOpt.isEmpty() || receptorOpt.isEmpty()) {
            throw new Exception("Usuario no encontrado.");
        }
        if (idEmisor.equals(idReceptor)) {
            throw new Exception("No puedes cancelar una solicitud a ti mismo.");
        }

        if (usuarioRepository.sonAmigos(idEmisor, idReceptor)) {
            throw new Exception("Ya existe una relación de amistad entre los usuarios.");
        }

        if (!usuarioRepository.haySolicitud(idEmisor, idReceptor)) {
            throw new Exception("No existe una solicitud de amistad entre los usuarios.");
        }
        usuarioRepository.rechazarSolicitudAmistad(idEmisor, idReceptor);
        return "Solicitud enviada correctamente";
    }
}
