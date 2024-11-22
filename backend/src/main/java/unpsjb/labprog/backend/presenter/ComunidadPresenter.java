package unpsjb.labprog.backend.presenter;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ComunidadService;
import unpsjb.labprog.backend.business.ScoreComunidad;
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

    @GetMapping("/puedeVer/{idComunidad}/{idUsuario}")
    public ResponseEntity<Object> puedeVer(@PathVariable Long idComunidad, @PathVariable Long idUsuario) {
        return Response.ok(comunidadService.puedeVer(idComunidad, idUsuario));
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findByIdPrivacidad(@PathVariable Long id) {
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

    @PostMapping("/eliminarUsuario/{idSuperUsuario}/{idMiembro}/{idComunidad}")
    public ResponseEntity<Object> eliminarUsuario(@PathVariable Long idSuperUsuario,
            @PathVariable Long idMiembro, @PathVariable Long idComunidad) {
        try {
            String respuesta = usuarioComunidadService.eliminarUsuario(idSuperUsuario, idMiembro, idComunidad);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al eliminar al usuario de la comunidad: " + e.getMessage());
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
        // return Response.ok("ok");
    }

    @GetMapping("/salir/{idComunidad}/{idUsuario}")
    public ResponseEntity<Object> salir(@PathVariable Long idComunidad, @PathVariable Long idUsuario) {
        return Response.ok(null, comunidadService.miembroSale(idComunidad, idUsuario));
        // return Response.ok("ok");
    }

    @GetMapping("/comunidadesCreadasPorUsuario/{idUsuario}")
    public ResponseEntity<Object> comunidadesCreadasPorUsuario(@PathVariable Long idUsuario, @RequestParam int offset,
            @RequestParam int limit) {
        List<Comunidad> comunidadesCreadasPorUsuario = comunidadService.comunidadesCreadasPorUsuario(idUsuario, offset,
                limit);
        return Response.ok(comunidadesCreadasPorUsuario);
    }

    @GetMapping(path = "/{nombreUsuario}/disponibles")
    public ResponseEntity<Object> obtenerComunidadesDisponibles(
            @PathVariable String nombreUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Response.ok(comunidadService.obtenerComunidadesDisponiblesPaginadas(nombreUsuario, page, size));
    }

    @RequestMapping(path = "/miembro/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> miembroUsuario(
        @PathVariable Long idUsuario, 
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size,
        @RequestParam(required = false, defaultValue = "") String nombreComunidad) {
        return Response.ok(comunidadService.miembroUsuario(idUsuario, nombreComunidad, page, size));
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
    public ResponseEntity<Object> obtenerSugerenciasCombinadas(
            @PathVariable String nombreUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        try {
            // Llamar al servicio que devuelve los eventos y el total de páginas
            Map<String, Object> result = comunidadService.obtenerSugerenciasComunidadesConTotalPaginas(nombreUsuario,
                    page, size);

            // Verificar si el resultado contiene datos y total de páginas
            if (result.isEmpty()) {
                return Response.error("", "No se encontraron sugerencias para los parámetros proporcionados.");
            }

            // Retornar los eventos y el total de páginas en el ResponseEntity
            return Response.ok(result);
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

    @GetMapping("/filtrar/etiquetas")
    public ResponseEntity<Object> comunidadesPorEtiquetas(@RequestParam List<String> etiquetas,@RequestParam(required = false) String tipo,
    @RequestParam(required = false) Long usuarioId) {
        return Response.ok(comunidadService.comunidadesEtiquetas(etiquetas,tipo, usuarioId));
    }


    @GetMapping("/filtrar/nombre")
    public ResponseEntity<Object> comunidadesPorNombre(
        @RequestParam String nombre,
        @RequestParam(required = false) String tipo,
        @RequestParam(required = false) Long usuarioId) {
        return Response.ok(comunidadService.comunidadesPorNombreYTipo(nombre, tipo, usuarioId));
    }

    @GetMapping("/filtrar/participantes")
    public ResponseEntity<Object> comunidadesPorParticipantes(@RequestParam(required = false) String tipo,@RequestParam(required = false) Long usuarioId,
    @RequestParam int min, @RequestParam int max) {
        return Response.ok(comunidadService.comunidadesParticipantes(tipo, usuarioId ,min, max));
    }
}
