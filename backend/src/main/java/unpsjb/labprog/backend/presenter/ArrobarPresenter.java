package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ArrobarService;
import unpsjb.labprog.backend.model.DTO.UsuarioEsAmigoDTO;

@RestController
@RequestMapping("arrobar")
public class ArrobarPresenter {

    @Autowired
    ArrobarService arrobarService;


    @RequestMapping(path = "/etiquetarPublicacion/{idUsuario}/{idEtiquetado}/{idPublicacion}", method = RequestMethod.PUT)
    public ResponseEntity<Object> etiquetarEnPublicacion(@PathVariable Long idEtiquetado, @PathVariable Long idUsuario,
            @PathVariable Long idPublicacion)
            throws Exception {
        arrobarService.etiquetarEnPublicacion(idUsuario, idEtiquetado, idPublicacion);
        return Response.ok(null);
    }

    @RequestMapping(path = "/etiquetarComentario/{idUsuario}/{idEtiquetado}/{idComentario}", method = RequestMethod.PUT)
    public ResponseEntity<Object> etiquetarEnComentario(@PathVariable Long idEtiquetado, @PathVariable Long idUsuario,
            @PathVariable Long idComentario)
            throws Exception {
        arrobarService.etiquetarEnComentario(idUsuario, idEtiquetado, idComentario);
        return Response.ok(null);
    }

    @RequestMapping(path = "/buscar/{idUsuario}/{termino}", method = RequestMethod.GET)
    public ResponseEntity<Object> buscarUsuarios(
            @PathVariable Long idUsuario,
            @PathVariable String termino) {
        List<UsuarioEsAmigoDTO> usuarios = arrobarService.buscarUsuariosPorTermino(idUsuario, termino);
        return ResponseEntity.ok(usuarios);
    }
}
