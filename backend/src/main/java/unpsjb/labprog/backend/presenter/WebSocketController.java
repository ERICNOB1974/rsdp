package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate simpMessagingTemplate;



    // Enviar notificación a todos los usuarios conectados
    public void enviarNotificacionGlobal(String mensaje) {
        simpMessagingTemplate.convertAndSend("/topic/notificaciones", mensaje);
    }

    public void enviarNotificacion(Long idUsuario, String mensaje) {
        // El destino del mensaje es el canal al que se suscribe el usuario
        String destino = "/topic/notificaciones/" + idUsuario;
        simpMessagingTemplate.convertAndSend(destino, mensaje);
    }
}