package unpsjb.labprog.backend.business.validar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.EstadoService;
import unpsjb.labprog.backend.business.ParteMOService;
import unpsjb.labprog.backend.business.ValidacionParteMOService;
import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;

@Component
public class SuperposicionHorariaValidador extends ValidadorParteMO {

    @Autowired
    private ValidacionParteMOService validacionParteMOService;

    @Autowired
    private EstadoService estadoService;

    @Lazy
    @Autowired
    private ParteMOService service;

    @Override
    public boolean validar(ResumenParteMO resPMO, ParteMO parteMO) {
        if (resPMO.getHoras().isBefore(resPMO.getHorasPartes())) {
            service.invalidarParte(parteMO);
            service.agregarLog(resPMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacionParteMOService.superposicionHoraria());
        }
        return true;
    }

}
