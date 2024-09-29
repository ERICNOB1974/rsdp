package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ComunidadService;
import unpsjb.labprog.backend.business.UsuarioComunidadService;
import unpsjb.labprog.backend.model.Comunidad;

@RestController
@RequestMapping("comunidades")
public class ComunidadPresenter {

    @Autowired
    ComunidadService comunidadService;

    @Autowired
    private UsuarioComunidadService usuarioComunidadService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll(){
        return Response.ok(comunidadService.findAll());
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Comunidad comunidad){
        return Response.ok(comunidadService.save(comunidad));
    }

    @GetMapping("/recomendarComunidadesPorAmigos/{nombreUsuario}")
    public ResponseEntity<Object> recomendarComunidadesPorAmigos(@PathVariable String nombreUsuario) {
        List<Comunidad> recomendarComunidadesPorAmigos = comunidadService.recomendarComunidadesPorAmigos(nombreUsuario);
        return Response.ok(recomendarComunidadesPorAmigos);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> recomendarComunidadesPorAmigos(@PathVariable Long id) {
        return Response.ok(comunidadService.findById(id));
    }

    @PostMapping("/otorgarRolAdministrador/{idCreador}/{idMiembro}/{idComunidad}")
    public ResponseEntity<Object> otorgarRolAdministrador(@PathVariable Long idCreador, @PathVariable Long idMiembro, @PathVariable Long idComunidad) {
        try {
            String respuesta=usuarioComunidadService.otorgarRolAdministrador(idCreador, idMiembro, idComunidad);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al otorgar rol: " + e.getMessage());
        }
    }

    @PostMapping("/quitarRolAdministrador/{idCreador}/{idMiembro}/{idComunidad}")
    public ResponseEntity<Object> quitarRolAdministrador(@PathVariable Long idCreador, @PathVariable Long idMiembro, @PathVariable Long idComunidad) {
        try {
            String respuesta=usuarioComunidadService.quitarRolAdministrador(idCreador, idMiembro, idComunidad);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al quitar rol: " + e.getMessage());
        }
    }

    @PostMapping("/gestionarSolicitudIngreso/{idSuperUsuario}/{idMiembro}/{idComunidad}")
    public ResponseEntity<Object> gestionarSolicitudIngreso(@PathVariable Long idSuperUsuario, @PathVariable Long idMiembro, @PathVariable Long idComunidad, @RequestParam boolean aceptada) {
        try {
            String respuesta=usuarioComunidadService.gestionarSolicitudes(idSuperUsuario, idMiembro, idComunidad, aceptada);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al gestionar solicitud de ingreso: " + e.getMessage());
        }
    }

    @RequestMapping(path = "/create/{idUsuario}", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Comunidad comunidad,@PathVariable Long idUsuario){
        try {
            System.out.println("FACUUUUUUUUUUUUUUUUComunidad recibida: " + comunidad);
            return Response.ok(usuarioComunidadService.guardarComunidadYCreador(comunidad,idUsuario));
        } catch (Exception e) {
            return Response.error("", "Error al crear la comunidad: " + e.getMessage()+e);
        }
    }
}
