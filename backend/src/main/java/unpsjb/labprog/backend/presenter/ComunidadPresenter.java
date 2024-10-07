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
    public ResponseEntity<Object> findAll() {
        return Response.ok(comunidadService.findAll());
    }

    @GetMapping("/{id}/miembros")
    public ResponseEntity<Object> miembrosDeComunidad(@PathVariable Long id) {
        return Response.ok(comunidadService.miembrosDeComunidad(id));
    }

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Comunidad comunidad) {
        return Response.ok(comunidadService.save(comunidad));
    }

    @GetMapping("/sugerenciasDeComunidadesBasadasEnAmigos/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeComunidadesBasadasEnAmigos(@PathVariable String nombreUsuario) {
        List<Comunidad> sugerenciasDeComunidadesBasadasEnAmigos = comunidadService
                .sugerenciasDeComunidadesBasadasEnAmigos(nombreUsuario);
        return Response.ok(sugerenciasDeComunidadesBasadasEnAmigos);
    }

    @GetMapping("/sugerenciasDeComunidadesBasadasEnComunidades/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeComunidadesBasadasEnComunidades(@PathVariable String nombreUsuario) {
        List<Comunidad> sugerenciasDeComunidadesBasadasEnComunidades = comunidadService
                .sugerenciasDeComunidadesBasadasEnComunidades(nombreUsuario);
        return Response.ok(sugerenciasDeComunidadesBasadasEnComunidades);
    }

    @GetMapping("/sugerenciasDeComunidadesBasadasEnEventos/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeComunidadesBasadasEnEventos(@PathVariable String nombreUsuario) {
        List<Comunidad> sugerenciasDeComunidadesBasadasEnEventos = comunidadService
                .sugerenciasDeComunidadesBasadasEnEventos(nombreUsuario);
        return Response.ok(sugerenciasDeComunidadesBasadasEnEventos);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> recomendarComunidadesPorAmigos(@PathVariable Long id) {
        return Response.ok(comunidadService.findById(id));
    }

    @PostMapping("/otorgarRolAdministrador/{idCreador}/{idMiembro}/{idComunidad}")
    public ResponseEntity<Object> otorgarRolAdministrador(@PathVariable Long idCreador, @PathVariable Long idMiembro,
            @PathVariable Long idComunidad) {
        try {
            String respuesta = usuarioComunidadService.otorgarRolAdministrador(idCreador, idMiembro, idComunidad);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al otorgar rol: " + e.getMessage());
        }
    }

    @PostMapping("/quitarRolAdministrador/{idCreador}/{idMiembro}/{idComunidad}")
    public ResponseEntity<Object> quitarRolAdministrador(@PathVariable Long idCreador, @PathVariable Long idMiembro,
            @PathVariable Long idComunidad) {
        try {
            String respuesta = usuarioComunidadService.quitarRolAdministrador(idCreador, idMiembro, idComunidad);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al quitar rol: " + e.getMessage());
        }
    }

    @PostMapping("/gestionarSolicitudIngreso/{idSuperUsuario}/{idMiembro}/{idComunidad}")
    public ResponseEntity<Object> gestionarSolicitudIngreso(@PathVariable Long idSuperUsuario,
            @PathVariable Long idMiembro, @PathVariable Long idComunidad, @RequestParam boolean aceptada) {
        try {
            String respuesta = usuarioComunidadService.gestionarSolicitudes(idSuperUsuario, idMiembro, idComunidad,
                    aceptada);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al gestionar solicitud de ingreso: " + e.getMessage());
        }
    }

    @RequestMapping(path = "/create/{idUsuario}", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Comunidad comunidad, @PathVariable Long idUsuario) {
        try {
            return Response.ok(usuarioComunidadService.guardarComunidadYCreador(comunidad, idUsuario));
        } catch (Exception e) {
            return Response.error("", "Error al crear la comunidad: " + e.getMessage() + e);
        }
    }

    @GetMapping("/sugerencias/{nombreUsuario}")
    public ResponseEntity<Object> sugerencias(@PathVariable String nombreUsuario) {
        return Response.ok(comunidadService.todasLasSugerencias(nombreUsuario));
    }

    @GetMapping("/visualizarSolicitudes/{idSuperUsuario}/{idComunidad}")
    public ResponseEntity<Object> visualizarSolicitudesPendinetes(@PathVariable Long idSuperUsuario,
            @PathVariable Long idComunidad) {
        try {
            return Response.ok(usuarioComunidadService.visualizarSolicitudes(idSuperUsuario, idComunidad));
        } catch (Exception e) {
            return Response.error("", "Error al visualizar las solicitudes de la comunidad: " + e.getMessage() + e);
        }
    }

    @PostMapping("/etiquetar/{idEtiqueta}")
    public ResponseEntity<Object> etiquetarComunidad(@RequestBody Comunidad comunidad, @PathVariable Long idEtiqueta) {
        comunidadService.etiquetarComunidad(comunidad, idEtiqueta);
        return Response.ok("ok");
    }
}
