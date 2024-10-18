package unpsjb.labprog.backend.presenter;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ComunidadService;
import unpsjb.labprog.backend.business.ScoreComunidad;
import unpsjb.labprog.backend.business.UsuarioComunidadService;
import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Usuario;

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
    public ResponseEntity<Object> visualizarSolicitudesPendientes(@PathVariable Long idSuperUsuario,
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

    @GetMapping("/participa/{idComunidad}/{idUsuario}")
    public ResponseEntity<Object> estadoParticipacion(@PathVariable Long idComunidad, @PathVariable Long idUsuario) {
        return Response.ok(usuarioComunidadService.verEstado(idComunidad, idUsuario));
    }

    @RequestMapping(path = "/disponibles", method = RequestMethod.GET)
    public ResponseEntity<Object> disponibles() {
        return Response.ok(comunidadService.disponibles());
    }

    @RequestMapping(path = "/miembro/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> miembroUsuario(@PathVariable Long idUsuario) {
        return Response.ok(comunidadService.miembroUsuario(idUsuario));
    }

    @GetMapping("/sugerenciasDeComunidadesBasadasEnAmigos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeComunidadesBasadasEnAmigos2(@PathVariable String nombreUsuario) {
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnAmigos = comunidadService
                .obtenerSugerenciasDeComunidadesBasadasEnAmigos2(nombreUsuario);
        return Response.ok(sugerenciasDeComunidadesBasadasEnAmigos);
    }

    @GetMapping("/sugerenciasDeComunidadesBasadasEnEventos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeComunidadesBasadasEnEventos2(@PathVariable String nombreUsuario) {
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnAmigos = comunidadService
                .obtenerSugerenciasDeComunidadesBasadasEnEventos2(nombreUsuario);
        return Response.ok(sugerenciasDeComunidadesBasadasEnAmigos);
    }

    @GetMapping("/sugerenciasDeComunidadesBasadasEnComunidades2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeComunidadesBasadasEnComunidades2(@PathVariable String nombreUsuario) {
        List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnAmigos = comunidadService
                .sugerenciasDeComunidadesBasadasEnComunidades2(nombreUsuario);
        return Response.ok(sugerenciasDeComunidadesBasadasEnAmigos);
    }

    @GetMapping("/sugerencias-combinadas/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasCombinadas(@PathVariable String nombreUsuario) {
        try {
            return Response.ok(comunidadService.obtenerTodasLasSugerenciasDeComunidades(nombreUsuario));
        } catch (Exception e) {
            // Manejo del error
            return Response.error("", "Error al obtener las sugerencias: " + e.getMessage());
        }
    }



    @RequestMapping(value = "/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<Object> delete(@PathVariable("id") Long id) {
        Comunidad aComunidad = comunidadService.findById(id);
        if (aComunidad == null) {
            return Response.notFound("comunidad id " + id + " no encontrada");
        }
        try {
            comunidadService.deleteById(id);
        } catch (RuntimeException e) {
            return Response.error(aComunidad, e.getMessage());
        }
        return Response.ok("Persona ", +id + " borrada con exito");
    }

      @RequestMapping(path = "/actualizar", method = RequestMethod.PUT)
    public ResponseEntity<Object> actualizar(@RequestBody Comunidad comunidad) {
        return ResponseEntity.ok(comunidadService.save(comunidad));
    }
}
