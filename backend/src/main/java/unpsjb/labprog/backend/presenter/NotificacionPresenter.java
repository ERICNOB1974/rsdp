package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.business.Notificacion;
import unpsjb.labprog.backend.business.NotificacionService;
import unpsjb.labprog.backend.Response;


import java.util.List;

@RestController
@RequestMapping("notificaciones")
public class NotificacionPresenter {

   
   @Autowired
    NotificacionService notificacionService;


    @GetMapping("/notificaciones/{usuarioId}")
    public ResponseEntity<Object> obtenerNotificaciones(@PathVariable Long usuarioId) {
        try {
            return Response.ok(notificacionService.obtenerNotificacionesPorUsuario(usuarioId));
        } catch (Exception e) {
            return Response.error("", "Error al obtener las notificaciones: " + e.getMessage());
        }
    }
}
