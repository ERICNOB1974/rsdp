package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.model.Usuario;
import java.util.List;

@RestController
@RequestMapping("usuarios")
public class UsuarioPresenter {

    @Autowired
    UsuarioService usuarioService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll(){
        return Response.ok(usuarioService.findAll());
    }

    @GetMapping("/amigos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerAmigos(@PathVariable String nombreUsuario) {
        List<Usuario> amigosDeAmigos = usuarioService.amigos(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    @GetMapping("/amigosDeAmigos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerAmigosDeAmigos(@PathVariable String nombreUsuario) {
        List<Usuario> amigosDeAmigos = usuarioService.amigosDeAmigos(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }



    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Usuario usuario){
        return Response.ok(usuarioService.save(usuario));
    }

}
