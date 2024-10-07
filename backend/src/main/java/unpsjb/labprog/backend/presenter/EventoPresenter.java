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

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EventoService;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.model.Evento;

@RestController
@RequestMapping("eventos")
public class EventoPresenter {

    @Autowired
    EventoService eventoService;
    @Autowired
    UsuarioService usuarioService;

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

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Evento evento) throws MessagingException {
        return Response.ok(eventoService.save(evento));
    }

    @RequestMapping(path = "/actualizar", method = RequestMethod.POST)
    public ResponseEntity<Object> actualizar(@RequestBody Evento evento) throws MessagingException {
        return Response.ok(eventoService.save(evento));
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

  

}
