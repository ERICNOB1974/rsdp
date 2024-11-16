package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    // Enviar notificación a un usuario específico
    public void enviarNotificacion(Long usuarioId, String mensaje) {
        messagingTemplate.convertAndSendToUser(usuarioId.toString(), "/topic/notificaciones", mensaje);
    }

    // Enviar notificación a todos los usuarios conectados
    public void enviarNotificacionGlobal(String mensaje) {
        messagingTemplate.convertAndSend("/topic/notificaciones", mensaje);
    }
}