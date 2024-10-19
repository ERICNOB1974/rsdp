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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.InscripcionEventoService;
import unpsjb.labprog.backend.business.ScoreAmigo;
import unpsjb.labprog.backend.business.SolicitudAmistadService;
import unpsjb.labprog.backend.business.UsuarioComunidadService;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.model.Usuario;

@RestController
@RequestMapping("usuarios")
public class UsuarioPresenter {

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    private SolicitudAmistadService solicitudAmistadService;
    @Autowired
    private InscripcionEventoService inscripcionEventoService;

    @Autowired
    private UsuarioComunidadService usuarioComunidadService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll() {
        return Response.ok(usuarioService.findAll());
    }

    @GetMapping("/amigos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerAmigos(@PathVariable String nombreUsuario) {
        List<Usuario> amigosDeAmigos = usuarioService.amigos(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    @GetMapping("/solicitudes/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSolicitudes(@PathVariable String nombreUsuario) {
        List<Usuario> amigosDeAmigos = usuarioService.solicitudes(nombreUsuario);
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
    @GetMapping("/sugerencias/{nombreUsuario}")
    public ResponseEntity<Object> sugerencias(@PathVariable String nombreUsuario) {
        return Response.ok(usuarioService.todasLasSugerencias(nombreUsuario));
    }

    @PostMapping("/enviarSolicitudAmistad/{idEmisor}/{idReceptor}")
    public ResponseEntity<Object> enviarSolicitudAmistad(@PathVariable Long idEmisor, @PathVariable Long idReceptor) {
        try {
            String respuesta=solicitudAmistadService.enviarSolicitud(idEmisor, idReceptor);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al enviar la solicitud: " + e.getMessage());
        }
    }

    @PostMapping("/solicitarIngresoAComunidad/{idUsuario}/{idComunidad}")
    public ResponseEntity<Object> solicitarIngresoAComunidad(@PathVariable Long idUsuario,
            @PathVariable Long idComunidad) {
        try {
            String respuesta=usuarioComunidadService.solicitarIngreso(idUsuario, idComunidad);
            return Response.ok(null, respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al enviar solicitud de ingreso: " + e);
        }
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Usuario usuario) {
        return Response.ok(usuarioService.save(usuario));
    }

    @RequestMapping(path = "/actualizar", method = RequestMethod.PUT)
    public ResponseEntity<Object> actualizar(@RequestBody Usuario usuario) {
        return Response.ok(usuarioService.save(usuario));
    }
    
    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        return Response.ok(usuarioService.findById(id));
    }
    
     @PostMapping("/gestionarSolicitudAmistad/{idEmisor}/{idReceptor}")
    public ResponseEntity<Object> gestionarSolicitudAmistad(@PathVariable Long idEmisor, @PathVariable Long idReceptor, @RequestParam boolean aceptada) {
        try {
            String respuesta=solicitudAmistadService.gestionarSolicitudAmistad(idEmisor, idReceptor, aceptada);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al gestionar solicitud de amistad: " + e.getMessage());
        }
    }

    @GetMapping("/findByNombreUsuario/{nombreUsuario}")
    public ResponseEntity<Object> findByNombreUsuario(@PathVariable String nombreUsuario) {
        return Response.ok(usuarioService.findByNombreUsuario(nombreUsuario));
    }

    @PostMapping("/inscribirseEvento/{idUsuario}/{idEvento}")
    public ResponseEntity<Object> inscribirseEvento(@PathVariable Long idUsuario, @PathVariable Long idEvento) {
        try {
            String respuesta=inscripcionEventoService.inscribirse(idUsuario, idEvento);
            return Response.ok(respuesta);
        } catch (Exception e) {
            return Response.error("", "Error al inscribirse: " + e.getMessage());
        }
    }

    @GetMapping("/existeMail/{correoElectronico}")
    public ResponseEntity<Object> existeMail(@PathVariable String correoElectronico) {
        return Response.ok(usuarioService.existeMail(correoElectronico));
    }

    @GetMapping("/existeNombreUsuario/{nombreUsuario}")
    public ResponseEntity<Object> existeNombreUsuario(@PathVariable String nombreUsuario) {
        return Response.ok(usuarioService.existeNombreUsuario(nombreUsuario));
    }



    @GetMapping("/sonAmigos/{idEmisor}/{idReceptor}")
    public ResponseEntity<Object> verificarAmistad(@PathVariable Long idEmisor, @PathVariable Long idReceptor) {
        try {
            return Response.ok(usuarioService.sonAmigos(idEmisor, idReceptor));  // Enviamos el resultado (true o false)
        } catch (Exception e) {
            return Response.error("", "Error al verificar la amistad: " + e.getMessage());
        }
    }

    @GetMapping("/solicitudAmistadExiste/{idEmisor}/{idReceptor}")
    public ResponseEntity<Object> verificarSolicitudAmistad(@PathVariable Long idEmisor, @PathVariable Long idReceptor) {
        try {
            return Response.ok(usuarioService.solicitudAmistadExiste(idEmisor, idReceptor));  // Enviamos el resultado (true o false)
        } catch (Exception e) {
            return Response.error("", "Error al verificar la solicitud de amistad: " + e.getMessage());
        }
    }



    
    @GetMapping("/esCreador/{idUsuario}/{idComunidad}")
    public ResponseEntity<Object> esCreador(@PathVariable Long idUsuario,@PathVariable Long idComunidad) {
        return Response.ok(usuarioService.esCreador(idUsuario, idComunidad));
    }



    @GetMapping("/miembrosComunidad/{idComunidad}")
    public ResponseEntity<Object> miembrosComunidad(@PathVariable Long idComunidad) {
        try {
            return Response.ok(usuarioService.miembrosComunidad(idComunidad));  // Enviamos el resultado (true o false)
        } catch (Exception e) {
            return Response.error("", "Error al visualizar los miembros de la comunidad: " + e.getMessage());
        }
    }

    @GetMapping("/administradoresComunidad/{idComunidad}")
    public ResponseEntity<Object> administradoresComunidad(@PathVariable Long idComunidad) {
        try {
            return Response.ok(usuarioService.administradoresComunidad(idComunidad));  // Enviamos el resultado (true o false)
        } catch (Exception e) {
            return Response.error("", "Error al visualizar los miembros de la comunidad: " + e.getMessage());
        }
    }

    

 @GetMapping("/sugerenciaDeAmigosBasadaEnAmigos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciaDeAmigosBasadaEnAmigos2(@PathVariable String nombreUsuario) {
        List<ScoreAmigo> sugerenciaDeAmigosBasadaEnAmigos = usuarioService
                .sugerenciaDeAmigosBasadaEnAmigos2(nombreUsuario);
        return Response.ok(sugerenciaDeAmigosBasadaEnAmigos);
    }

    @GetMapping("/sugerenciasDeAmigosBasadosEnEventos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeAmigosBasadosEnEventos2(@PathVariable String nombreUsuario) {
        List<ScoreAmigo> sugerenciasDeAmigosBasadosEnEventos = usuarioService
                .sugerenciasDeAmigosBasadosEnEventos2(nombreUsuario);
        return Response.ok(sugerenciasDeAmigosBasadosEnEventos);
    }

    @GetMapping("/sugerenciasDeAmigosBasadosEnComunidades2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeAmigosBasadosEnComunidades2(@PathVariable String nombreUsuario) {
        List<ScoreAmigo> sugerenciasDeAmigosBasadosEnComunidades = usuarioService
                .sugerenciasDeAmigosBasadosEnComunidades2(nombreUsuario);
        return Response.ok(sugerenciasDeAmigosBasadosEnComunidades);
    }

    @GetMapping("/sugerencias-combinadas/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasCombinadas(@PathVariable String nombreUsuario) {
        try {
            return Response.ok(usuarioService.obtenerTodasLasSugerenciasDeAmigos(nombreUsuario));
        } catch (Exception e) {
            // Manejo del error
            return Response.error("", "Error al obtener las sugerencias: " + e.getMessage());
        }
    }
}
