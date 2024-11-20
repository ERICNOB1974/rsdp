package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestParam;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.PublicacionService;
import unpsjb.labprog.backend.model.Publicacion;
import unpsjb.labprog.backend.model.Usuario;

@RestController
@RequestMapping("publicacion")
public class PublicacionPresenter {
    @Autowired
    PublicacionService publicacionService;

    @RequestMapping(path = "/crear/{idUsuario}", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Publicacion publicacion, @PathVariable Long idUsuario)
            throws Exception {
        return Response.ok(publicacionService.save(publicacion, idUsuario));
    }

    @RequestMapping(path = "/crear/{idUsuario}/{idComunidad}", method = RequestMethod.POST)
    public ResponseEntity<Object> publicarEnComunidad(@RequestBody Publicacion publicacion,
            @PathVariable Long idUsuario, @PathVariable Long idComunidad)
            throws Exception {
                publicacionService.publicarEnComunidad(idComunidad, idUsuario, publicacion);
        return Response.ok("OK");
    }

    @DeleteMapping(path = "/eliminar/{idPublicacion}")
    public ResponseEntity<Object> eliminar(@PathVariable Long idPublicacion)
            throws Exception {
        publicacionService.eliminar(idPublicacion);
        return Response.ok(null);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) throws Exception {
        return Response.ok(publicacionService.findById(id));
    }

    @GetMapping("/likear/{idUsuario}/{idPublicacion}")
    public ResponseEntity<Object> likear(@PathVariable Long idUsuario, @PathVariable Long idPublicacion)
            throws Exception {
        publicacionService.likear(idUsuario, idPublicacion);
        return Response.ok(null, "OK");
    }

    @GetMapping("/deslikear/{idUsuario}/{idPublicacion}")
    public ResponseEntity<Object> sacarLike(@PathVariable Long idUsuario, @PathVariable Long idPublicacion)
            throws Exception {
        publicacionService.sacarLike(idUsuario, idPublicacion);
        return Response.ok(null, "OK");
    }

    @GetMapping("/isLikeada/{idUsuario}/{idPublicacion}")
    public ResponseEntity<Object> estaLikeada(@PathVariable Long idUsuario, @PathVariable Long idPublicacion)
            throws Exception {
        boolean like = publicacionService.estaLikeada(idUsuario, idPublicacion);
        return Response.ok(like, "OK");
    }

    @PostMapping("/comentar/{idUsuario}/{idPublicacion}")
    public ResponseEntity<Object> comentar(@PathVariable Long idUsuario, @PathVariable Long idPublicacion,
            @RequestBody String comentario)
            throws Exception {
        publicacionService.comentar(idUsuario, idPublicacion, comentario);
        return Response.ok(null, "OK");
    }

    @GetMapping("/publicaciones/usuario/{idUsuario}")
    public ResponseEntity<Object> publicacionesUsuario(@PathVariable Long idUsuario, 
        @RequestParam(defaultValue = "0") int offset,
        @RequestParam(defaultValue = "10") int limit)
            throws Exception {
        List<Publicacion> publicaciones = publicacionService.publicacionesUsuario(idUsuario,offset, limit);
        return Response.ok(publicaciones, "OK");
    }

    @GetMapping("/usuarioPublicador/{idPublicacion}")
    public ResponseEntity<Object> publicadoPor(@PathVariable Long idPublicacion)
            throws Exception {
        Usuario u = publicacionService.obtenerCreadorPublicacion(idPublicacion);
        return Response.ok(u, "OK");
    }

    @GetMapping("/publicaciones/amigos/usuario/{idUsuario}")
    public ResponseEntity<Object> publicacionesAmigo(@PathVariable Long idUsuario)
            throws Exception {
        List<Publicacion> publicaciones = publicacionService.publicacionesAmigos(idUsuario);
        return Response.ok(publicaciones, "OK");
    }

    @GetMapping("/publicacionesHome/{idUsuario}")
    public ResponseEntity<Object> publicacionesHome(@PathVariable Long idUsuario)
            throws Exception {
        List<Publicacion> publicaciones = publicacionService.publicacionesHome(idUsuario);
        return Response.ok(publicaciones, "OK");
    }


    @GetMapping("/publicaciones/comunidad/{idComunidad}")
    public ResponseEntity<Object> publicacionesComunidad(@PathVariable Long idComunidad)
            throws Exception {
        List<Publicacion> publicaciones = publicacionService.publicacionesComunidad(idComunidad);
        return Response.ok(publicaciones, "OK");
    }

    @GetMapping("/comentarios/{idPublicacion}")
    public ResponseEntity<Object> obtenerNotificaciones(@PathVariable Long idPublicacion) {
        try {
            return Response.ok(publicacionService.obtenerComentariosPorPublicacion(idPublicacion));
        } catch (Exception e) {
            return Response.error("", "Error al obtener los comentarios: " + e.getMessage());
        }
    }

    @GetMapping("/cantidadLikes/{idPublicacion}")
    public ResponseEntity<Object> cantidadLikes(@PathVariable Long idPublicacion) {
        try {
            return Response.ok(publicacionService.cantidadLikes(idPublicacion));
        } catch (Exception e) {
            return Response.error("", "Error al obtener los comentarios: " + e.getMessage());
        }
    }
}