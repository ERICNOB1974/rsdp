package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.model.Usuario;

@RestController
@RequestMapping("usuarios")
public class UsuarioPresenter {

    @Autowired
    UsuarioService usuarioService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll() {
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

    @GetMapping("/sugerenciasDeAmigosBasadasEnAmigos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeAmigosBasadasEnAmigos(@PathVariable String nombreUsuario) {
        List<Usuario> amigosDeAmigos = usuarioService.sugerenciaDeAmigosBasadasEnAmigos(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    @GetMapping("/sugerenciasDeAmigosBasadosEnEventos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeAmigosBasadosEnEventos(@PathVariable String nombreUsuario) {
        return Response.ok(usuarioService.sugerenciaDeAmigosBasadosEnEventos(nombreUsuario));
    }

    @GetMapping("/sugerenciasDeAmigosBasadosEnComunidades/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeAmigosBasadosEnComunidades(@PathVariable String nombreUsuario) {
        return Response.ok(usuarioService.sugerenciasDeAmigosBasadosEnComunidades(nombreUsuario));
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Usuario usuario) {
        return Response.ok(usuarioService.save(usuario));
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        return Response.ok(usuarioService.findById(id));
    }

    @GetMapping("/findByNombreUsuario/{nombreUsuario}")
    public ResponseEntity<Object> findByNombreUsuario(@PathVariable String nombreUsuario) {
        return Response.ok(usuarioService.findByNombreUsuario(nombreUsuario));
    }

}
