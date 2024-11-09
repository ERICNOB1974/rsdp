package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PostMapping;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.NotificacionService;

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

    @PostMapping("/marcar-leida/{id}")
    public ResponseEntity<Object> marcarNotificacionLeida(@PathVariable Long id) {
            return Response.ok(notificacionService.marcarLeida(id));
        
    }

    @RequestMapping(value = "/eliminarNotififacion/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") Long id) {
        try {
            notificacionService.deleteById(id);
        } catch (RuntimeException e) {
            return Response.error(null, e.getMessage());
        }
        return Response.ok("notificacion ", +id + " borrada con exito");
    }
}
