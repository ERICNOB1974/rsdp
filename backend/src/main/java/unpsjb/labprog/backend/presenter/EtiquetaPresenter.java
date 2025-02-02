package unpsjb.labprog.backend.presenter;

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
import unpsjb.labprog.backend.business.EtiquetaService;
import unpsjb.labprog.backend.model.Etiqueta;

@RestController
@RequestMapping("etiquetas")
public class EtiquetaPresenter {

    @Autowired
    EtiquetaService etiquetaService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll() {
        return Response.ok(etiquetaService.findAll());
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Etiqueta etiqueta) {
        return Response.ok(etiquetaService.save(etiqueta));
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> recomendarComunidadesPorAmigos(@PathVariable Long id) {
        return Response.ok(etiquetaService.findById(id));
    }

    @RequestMapping(value = "/search/{term}", method = RequestMethod.GET)
    public ResponseEntity<Object> search(@PathVariable("term") String term) {
        return Response.ok(etiquetaService.search(term));
    }

    @GetMapping("/existe")
    public boolean existeEtiqueta(@RequestParam String nombre) {
        return etiquetaService.existeEtiqueta(nombre);
    }

    @PostMapping
    public Etiqueta crearEtiqueta(@RequestBody Etiqueta etiqueta) {
        return etiquetaService.save(etiqueta);
    }

    @GetMapping("/etiquetasComunidad/{idComunidad}")
    public ResponseEntity<Object> etiquetasEnComunidad(@PathVariable Long idComunidad) {
        return Response.ok(etiquetaService.etiquetasEnComunidad(idComunidad));
    }

    @GetMapping("/etiquetasEvento/{idEvento}")
    public ResponseEntity<Object> etiquetasEnEvento(@PathVariable Long idEvento) {
        return Response.ok(etiquetaService.etiquetasEnEvento(idEvento));
    }

}
