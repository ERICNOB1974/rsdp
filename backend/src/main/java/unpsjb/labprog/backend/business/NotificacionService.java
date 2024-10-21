package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
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
        Collections.sort(notificaciones, Collections.reverseOrder());

        return notificaciones;
    }

 

    public Notificacion obtenerNotificacionPorId(Long id) throws Exception {
        String tipo = notificacionRepository.findTipoById(id);
        String mensaje = notificacionRepository.findMensajeById(id);
        LocalDateTime fecha = notificacionRepository.findFechaById(id);
        Long entidadId = notificacionRepository.findEntidadIdById(id);


        if (tipo == null || mensaje == null || fecha == null || entidadId == null) {
            throw new Exception("Notificación no encontrada con ID: " + id);
        }

        // Construir el objeto Notificacion
        Notificacion notificacion = new Notificacion();
        notificacion.setTipo(tipo);
        notificacion.setMensaje(mensaje);
        notificacion.setFecha(fecha);
        notificacion.setEntidadId(entidadId);

        return notificacion;
    }

    public void crearNotificacion(Long idUsuario, Long idEntidad, String tipo, LocalDateTime fecha) {
        // Crea la notificación en la base de datos
        notificacionRepository.crearNotificacion(idUsuario, idEntidad, tipo, fecha);
    }

    public void crearNotificacionPublicacion(Long idUsuarioReceptor, Long idUsuarioEmisor, Long idEntidad, String tipo, LocalDateTime fecha){
        System.out.println("ENTRO ACAAAAA\n"    );
        notificacionRepository.crearNotificacionPublicacion(idUsuarioReceptor, idUsuarioEmisor, idEntidad, tipo, fecha);
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