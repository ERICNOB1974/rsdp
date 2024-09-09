package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EventoService;
import unpsjb.labprog.backend.model.Evento;

@RestController
@RequestMapping("eventos")
public class EventoPresenter {

    
    @Autowired
    EventoService eventoService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll(){
        return Response.ok(eventoService.findAll());
    }

    @RequestMapping(path = "/crear", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Evento evento){
        return Response.ok(eventoService.save(evento));
    }

}
