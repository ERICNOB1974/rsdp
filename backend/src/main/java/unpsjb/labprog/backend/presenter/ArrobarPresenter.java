package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.ArrobarService;

@RestController
@RequestMapping("etiquetar")
public class ArrobarPresenter {

    @Autowired
    ArrobarService arrobarService;
    
    @RequestMapping(path = "/etiquetar/{idUsuario}/{idEtiquetado}/{idPublicacion}", method = RequestMethod.PUT)
    public ResponseEntity<Object> etiquetarEnPublicacion(@PathVariable Long idEtiquetado, @PathVariable Long idUsuario, @PathVariable Long idPublicacion)
            throws Exception {
        return null;
    }
}
