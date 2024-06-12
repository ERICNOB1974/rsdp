package unpsjb.labprog.backend.business.validar;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import unpsjb.labprog.backend.business.EstadoService;
import unpsjb.labprog.backend.business.ParteMOService;
import unpsjb.labprog.backend.business.TipoTurnoService;
import unpsjb.labprog.backend.business.ValidacionParteMOService;
import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;

@Component
public class IncumpleHorarioValidador extends ValidadorParteMO {

    @Autowired
    private TipoTurnoService tipoTurnoService;

    @Autowired
    private ValidacionParteMOService validacionParteMOService;

    @Autowired
    private EstadoService estadoService;

    @Lazy
    @Autowired
    private ParteMOService service;

    @Override
    public void validar(ResumenParteMO resPMO, ParteMO parteMO) {
        if (tipoTurnoService.obtenerTurno(parteMO.getOperario().getLegajo(), resPMO.getFecha()) == null){
            return;
        }
        if (tipoTurnoService.obtenerHorario(parteMO.getOperario().getLegajo(), resPMO.getFecha()) == null) {
            return;
        }
        if ((resPMO.getIngreso().isBefore(tipoTurnoService.obtenerHoraDesde(parteMO.getOperario(), resPMO.getFecha())) || (resPMO.getEgreso().isAfter(tipoTurnoService.obtenerHoraHasta(parteMO.getOperario(), resPMO.getFecha()))))) {
            return;
        }
        if (resPMO.getIngreso().isAfter(tipoTurnoService.obtenerHoraDesde(parteMO.getOperario(), resPMO.getFecha())) || (resPMO.getEgreso().isBefore(tipoTurnoService.obtenerHoraHasta(parteMO.getOperario(), resPMO.getFecha())))) {
            service.invalidarParte(parteMO);
            service.agregarLog(resPMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacionParteMOService.incumpleHorario());
        }
    }

}
