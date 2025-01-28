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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ComentarioService;
import unpsjb.labprog.backend.model.Comentario;

@RestController
@RequestMapping("comentarios")
public class ComentarioPresenter {

    @Autowired
    ComentarioService comentarioService;

    @GetMapping("/publicacion/{idPublicacion}")
    public ResponseEntity<Object> obtenerComentariosPorPublicacion(@PathVariable Long idPublicacion) {
        List<Comentario> comentarios = comentarioService.obtenerComentariosPorPublicacion(idPublicacion);
        return Response.ok(comentarios);
    }

    @PostMapping("/responder/{comentarioPadreId}/{usuarioId}")
    public ResponseEntity<Object> responderComentario(@PathVariable Long comentarioPadreId,
            @PathVariable Long usuarioId, @RequestBody String texto)
            throws Exception {
        // Llamar al servicio que maneja la lógica de responder comentario
        Comentario comentarioRespondido = comentarioService.responderComentario(comentarioPadreId, texto, usuarioId);

        // Retornar el comentario respondido
        return Response.ok(comentarioRespondido); // Devuelve el comentario respondido con un código de estado 200
    }

    @PostMapping("/comentar/{idUsuario}/{idPublicacion}")
    public ResponseEntity<Object> comentar(@PathVariable Long idUsuario, @PathVariable Long idPublicacion,
            @RequestBody String comentario)
            throws Exception {
        Comentario coment = comentarioService.comentar(idUsuario, idPublicacion, comentario);
        return Response.ok(coment, "OK");
    }

    @GetMapping("/respuestas/{comentarioPadreId}")
    public ResponseEntity<Object> obtenerRespuestasPaginadas(
            @PathVariable Long comentarioPadreId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        return Response.ok(comentarioService.obtenerRespuestas(comentarioPadreId, page, size));
    }

    @GetMapping("/contarRespuestas/{comentarioPadreId}")
    public ResponseEntity<Object> contarRespuestas(@PathVariable Long comentarioPadreId) {
        return Response.ok(comentarioService.contarRespuestas(comentarioPadreId));
    }

    @DeleteMapping("/eliminar/{comentarioId}")
    public ResponseEntity<Object> eliminar(@PathVariable Long comentarioId) {
        comentarioService.eliminar(comentarioId);
        return Response.ok("OK");
    }


    @GetMapping("/likear/{idUsuario}/{idComentaro}")
    public ResponseEntity<Object> likear(@PathVariable Long idUsuario, @PathVariable Long idComentaro)
            throws Exception {
        
        return Response.ok(null, comentarioService.likear(idUsuario, idComentaro));
    }

    @GetMapping("/deslikear/{idUsuario}/{idComentaro}")
    public ResponseEntity<Object> sacarLike(@PathVariable Long idUsuario, @PathVariable Long idComentaro)
            throws Exception {
        return Response.ok(null, comentarioService.sacarLike(idUsuario, idComentaro));
    }

    @GetMapping("/isLikeada/{idUsuario}/{idComentaro}")
    public ResponseEntity<Object> estaLikeado(@PathVariable Long idUsuario, @PathVariable Long idComentaro)
            throws Exception {
        boolean like = comentarioService.estaLikeado(idUsuario, idComentaro);
        return Response.ok(like, "OK");
    }


    @GetMapping("/cantidadLikes/{idComentaro}")
    public ResponseEntity<Object> cantidadLikes(@PathVariable Long idComentaro) {
        try {
            return Response.ok(comentarioService.cantidadLikes(idComentaro));
        } catch (Exception e) {
            return Response.error("", "Error al obtener los comentarios: " + e.getMessage());
        }
    }
   

}