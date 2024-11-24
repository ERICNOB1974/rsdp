package unpsjb.labprog.backend.presenter;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EventoService;
import unpsjb.labprog.backend.business.InscripcionEventoService;
import unpsjb.labprog.backend.business.ScoreEvento;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.exceptions.EventoException;
import unpsjb.labprog.backend.model.Etiqueta;
import unpsjb.labprog.backend.model.Evento;

@RestController
@RequestMapping("eventos")
public class EventoPresenter {

    @Autowired
    EventoService eventoService;
    @Autowired
    UsuarioService usuarioService;
    @Autowired
    InscripcionEventoService inscripcionEventoService;

    @RequestMapping(path = "/findAll", method = RequestMethod.GET)
    public ResponseEntity<Object> findAll() {
        return Response.ok(eventoService.findAll());
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        return Response.ok(eventoService.findById(id));
    }

    @GetMapping("/{id}/participantes")
    public ResponseEntity<Object> participantesDeEvento(@PathVariable Long id) {
        return Response.ok(eventoService.participantesDeEvento(id));
    }

    @GetMapping("/eventosDeUnaComunidad/{comunidadId}")
    public ResponseEntity<Object> eventosDeUnaComunidad(@PathVariable Long comunidadId) {
        return Response.ok(eventoService.eventosDeUnaComunidad(comunidadId));
    }

    @GetMapping("/buscarCreadorDeUnEventoInterno/{comunidadId}/{eventoId}")
    public ResponseEntity<Object> buscarCreadorDeUnEventoInterno(@PathVariable Long comunidadId,
            @PathVariable Long eventoId) {
        return Response.ok(usuarioService.buscarCreadorDeUnEventoInterno(comunidadId, eventoId));
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Evento evento) throws MessagingException, EventoException {
        return Response.ok(eventoService.crear(evento));
    }

    @RequestMapping(path = "/crear/{nombreUsuario}", method = RequestMethod.POST)
    public ResponseEntity<Object> createConCreador(@RequestBody Evento evento, @PathVariable String nombreUsuario)
            throws MessagingException, EventoException {
        return Response.ok(eventoService.crearConCreador(evento, nombreUsuario));
    }

    @RequestMapping(path = "/crearParaComunidad/{nombreUsuario}/{comunidadId}", method = RequestMethod.POST)
    public ResponseEntity<Object> crearConCreadorParaEventoInternoParaComunidad(@RequestBody Evento evento,
            @PathVariable String nombreUsuario, @PathVariable Long comunidadId)
            throws MessagingException, EventoException {
        return Response
                .ok(eventoService.crearConCreadorParaEventoInternoParaComunidad(evento, nombreUsuario, comunidadId));
    }

    @GetMapping("/sugerencias/{nombreUsuario}")
    public ResponseEntity<Object> sugerencias(@PathVariable String nombreUsuario) {
        return Response.ok(eventoService.todasLasSugerencias(nombreUsuario));
    }

    @RequestMapping(path = "/actualizar", method = RequestMethod.PUT)
    public ResponseEntity<Object> actualizar(@RequestBody Evento evento) throws MessagingException, EventoException {
        return Response.ok(eventoService.actualizar(evento));
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnEventos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeEventosBasadosEnEventos(@PathVariable String nombreUsuario) {
        List<Evento> eventosDeEventos = eventoService.sugerenciaDeEventosBasadosEnEventos(nombreUsuario);
        return Response.ok(eventosDeEventos);
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnRutinas/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeEventosBasadosEnRutinas(@PathVariable String nombreUsuario) {
        List<Evento> eventosDeRutinas = eventoService.sugerenciaDeEventosBasadosEnRutinas(nombreUsuario);
        return Response.ok(eventosDeRutinas);
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnComunidades/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeEventosBasadosEnComunidades(@PathVariable String nombreUsuario) {
        List<Evento> eventosDeRutinas = eventoService.sugerenciaDeEventosBasadosEnComunidades(nombreUsuario);
        return Response.ok(eventosDeRutinas);
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnAmigos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeEventosBasadosEnAmigos(@PathVariable String nombreUsuario) {
        List<Evento> eventosDeRutinas = eventoService.sugerenciasDeEventosBasadosEnAmigos(nombreUsuario);
        return Response.ok(eventosDeRutinas);
    }

    @GetMapping("/proximos")
    public ResponseEntity<Object> eventosProximos() {
        List<Evento> eventosDeRutinas = eventoService.eventosProximos();
        return Response.ok(eventosDeRutinas);
    }

    @GetMapping("/eventosCreadosPorUsuario/{idUsuario}")
    public ResponseEntity<Object> eventosCreadosPorUsuario(@PathVariable Long idUsuario, @RequestParam int offset,
            @RequestParam int limit) {
        List<Evento> eventosCreadosPorUsuario = eventoService.eventosCreadosPorUsuario(idUsuario, offset, limit);
        return Response.ok(eventosCreadosPorUsuario);
    }

    @GetMapping("/esCreadoPor/{idUsuario}/{idEvento}")
    public ResponseEntity<Object> esCreadoPor(@PathVariable Long idUsuario, @PathVariable Long idEvento) {
        boolean eventosCreadosPorUsuario = eventoService.esCreadoPor(idUsuario, idEvento);
        return Response.ok(eventosCreadosPorUsuario);
    }

    @PostMapping("/etiquetar/{idEtiqueta}")
    public ResponseEntity<Object> etiquetarEvento(@RequestBody Evento evento, @PathVariable Long idEtiqueta) {
        eventoService.etiquetarEvento(evento, idEtiqueta);
        return Response.ok("ok");
    }

    @PostMapping("/inscribirse/{idEvento}/{idUsuario}")
    public ResponseEntity<Object> inscribirse(@PathVariable Long idEvento, @PathVariable Long idUsuario) {
        inscripcionEventoService.inscribirse(idEvento, idUsuario);
        return Response.ok("ok");
    }

    @GetMapping("/estaInscripto/{nombreUsuario}/{idEvento}")
    public ResponseEntity<Object> estaInscripto(@PathVariable String nombreUsuario, @PathVariable Long idEvento) {
        return Response.ok(eventoService.participa(nombreUsuario, idEvento));
    }

    @GetMapping("/desinscribirse/{idEvento}/{idUsuario}")
    public ResponseEntity<Object> salir(@PathVariable Long idEvento, @PathVariable Long idUsuario) {
        return Response.ok(null, eventoService.desinscribirse(idEvento, idUsuario));
    }

    @GetMapping("/filtrar/etiquetas")
    public ResponseEntity<Object> eventosPorEtiquetas(@RequestParam List<String> etiquetas,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long usuarioId) {
        return Response.ok(eventoService.eventosEtiquetas(etiquetas, tipo, usuarioId));
    }

    @GetMapping("/filtrar/nombre")
    public ResponseEntity<Object> eventosPorNombre(
            @RequestParam String nombre,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long usuarioId) {
        return Response.ok(eventoService.eventosNombre(nombre, tipo, usuarioId));
    }

    @GetMapping("/filtrar/fecha")
    public ResponseEntity<Object> eventosPorFecha(@RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long usuarioId, @RequestParam ZonedDateTime min,
            @RequestParam ZonedDateTime max) {
        return Response.ok(eventoService.eventosFecha(tipo, usuarioId, min, max));
    }

    @GetMapping("/filtrar/participantes")
    public ResponseEntity<Object> eventosPorParticipantes(@RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long usuarioId,
            @RequestParam int min, @RequestParam int max) {
        return Response.ok(eventoService.eventosParticipantes(tipo, usuarioId, min, max));
    }

    @RequestMapping(path = "/{nombreUsuario}/disponibles", method = RequestMethod.GET)
    public ResponseEntity<Object> eventosDisponibles(@PathVariable String nombreUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Response.ok(eventoService.eventosDisponibles(nombreUsuario, page, size));
    }

    @RequestMapping(path = "/participa/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> participaUsuario(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String nombreEvento) {
        return Response.ok(eventoService.participaUsuario(idUsuario, nombreEvento, page, size));
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnEventos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeEventosBasadosEnEventos2(@PathVariable String nombreUsuario) {
        List<ScoreEvento> sugerenciasDeEventosBasadosEnEventos = eventoService
                .sugerenciasDeEventosBasadosEnEventos2(nombreUsuario);
        return Response.ok(sugerenciasDeEventosBasadosEnEventos);
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnAmigos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeEventosBasadosEnAmigos2(@PathVariable String nombreUsuario) {
        List<ScoreEvento> sugerenciasDeEventosBasadosEnAmigos = eventoService
                .sugerenciasDeEventosBasadosEnAmigos2(nombreUsuario);
        return Response.ok(sugerenciasDeEventosBasadosEnAmigos);
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnComunidades2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeEventosBasadosEnComunidades2(@PathVariable String nombreUsuario) {
        List<ScoreEvento> sugerenciasDeEventosBasadosEnComunidades = eventoService
                .sugerenciasDeEventosBasadosEnComunidades2(nombreUsuario);
        return Response.ok(sugerenciasDeEventosBasadosEnComunidades);
    }

    @GetMapping("/sugerenciasDeEventosBasadosEnRutinas2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeEventosBasadosEnRutinas2(@PathVariable String nombreUsuario) {
        List<ScoreEvento> sugerenciasDeEventosBasadosEnRutinas = eventoService
                .sugerenciasDeEventosBasadosEnRutinas2(nombreUsuario);
        return Response.ok(sugerenciasDeEventosBasadosEnRutinas);
    }

    @GetMapping("/sugerencias-combinadas/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasCombinadas(
            @PathVariable String nombreUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        try {
            // Llamar al servicio que devuelve los eventos y el total de páginas
            Map<String, Object> result = eventoService.obtenerSugerenciasEventosConTotalPaginas(nombreUsuario, page,
                    size);

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

    @GetMapping("/etiquetas/{idEvento}")
    public ResponseEntity<Object> etiquetasEvento(@PathVariable Long idEvento) {
        List<Etiqueta> etiquetas = eventoService.etiquetasEvento(idEvento);
        return Response.ok(etiquetas);
    }

    @DeleteMapping("/eliminar/{idEvento}")
    public ResponseEntity<Object> eliminar(@PathVariable Long idEvento) {
        eventoService.eliminar(idEvento);
        return Response.ok("OK");
    }

    @PutMapping("/eliminarParticipante/{idEvento}/{idUsuario}")
    public ResponseEntity<Object> eliminarParticipante(@PathVariable Long idEvento, @PathVariable Long idUsuario,
            @RequestBody String motivo) {
        eventoService.eliminarUsuario(motivo, idEvento, idUsuario);
        return Response.ok("OK");
    }

    @GetMapping("/listaParticipantes/{idEvento}")
    public ResponseEntity<Object> todosLosParticipantes(@PathVariable Long idEvento) {
        return Response.ok(eventoService.todosLosParticipantes(idEvento));
    }

    @GetMapping("/eventosFuturosPertenecientesAUnUsuario/{nombreUsuario}")
    public ResponseEntity<Object> eventosFuturosPertenecientesAUnUsuario(@PathVariable String nombreUsuario) {
        List<Evento> eventosDeRutinas = eventoService.eventosFuturosPertenecientesAUnUsuario(nombreUsuario);
        return Response.ok(eventosDeRutinas);
    }

    @GetMapping("/estaExpulsado/{idUsuario}/{idEvento}")
    public ResponseEntity<Object> eventosFuturosPertenecientesAUnUsuario(@PathVariable Long idUsuario,
            @PathVariable Long idEvento) {
        boolean estado = eventoService.estaExpulsado(idUsuario, idEvento);
        String mensaje = eventoService.motivoExpulsion(idUsuario, idEvento);

        return Response.ok(estado, mensaje);
    }

}
