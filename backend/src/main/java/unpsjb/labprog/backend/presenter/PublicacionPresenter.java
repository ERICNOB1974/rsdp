package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.PublicacionService;
import unpsjb.labprog.backend.model.Publicacion;

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
    public ResponseEntity<Object> publicacionesUsuario(@PathVariable Long idUsuario)
            throws Exception {
        List<Publicacion> publicaciones = publicacionService.publicacionesUsuario(idUsuario);
        return Response.ok(publicaciones, "OK");
    }
}