package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.business.Notificacion;
import unpsjb.labprog.backend.business.NotificacionService;


import java.util.List;

@RestController
@RequestMapping("notificaciones")
public class NotificacionPresenter {

   
   @Autowired
    NotificacionService notificacionService;

    @PostMapping("/evento")
    public void notificarInscripcionEvento(@RequestParam Long idUsuario, @RequestParam Long idEvento) {
        notificacionService.notificarInscripcionEvento(idUsuario, idEvento);
    }

    @PostMapping("/amistad")
    public void notificarAceptacionAmistad(@RequestParam Long idUsuario, @RequestParam Long idAmigo) {
        notificacionService.notificarAceptacionAmistad(idUsuario, idAmigo);
    }

    @GetMapping("/{idUsuario}")
    public List<Notificacion> obtenerNotificaciones(@PathVariable Long idUsuario) {
        return notificacionService.obtenerNotificaciones(idUsuario);
    }
}
