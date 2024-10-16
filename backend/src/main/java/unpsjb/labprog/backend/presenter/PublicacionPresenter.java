package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
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
    public ResponseEntity<Object> create(@RequestBody Publicacion publicacion, @PathVariable Long idUsuario) throws Exception {
        return Response.ok(publicacionService.save(publicacion, idUsuario));
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) throws Exception {
        return Response.ok(publicacionService.findById(id));
    }
}