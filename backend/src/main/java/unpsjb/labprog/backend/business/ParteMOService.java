package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;
import unpsjb.labprog.backend.model.Tarea;
import unpsjb.labprog.backend.model.ValidacionParteMO;
import unpsjb.labprog.backend.model.Estado;
import unpsjb.labprog.backend.model.LogValidacionParteMO;
import unpsjb.labprog.backend.model.Operario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.Optional;
import java.time.Duration;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

@Service
public class ParteMOService {

    @Autowired
    ParteMORepository repository;

    @Autowired
    EstadoService estadoService;

    @Autowired
    OperarioService operarioService;

    @Autowired
    ValidacionParteMOService validacionParteMOService;

    @Autowired
    LogValidacionParteMOService logValidacionParteMOService;

    public ParteMO findById(int id) {
        return repository.findById(id).orElse(null);
    }

    public List<ParteMO> findAll() {
        List<ParteMO> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }

    @Transactional
    public void delete(int id) {
        repository.deleteById(id);

    }

    public Page<ParteMO> findByPage(int page, int size) {
        return repository.findAll(PageRequest.of(page, size));
    }

    public Collection<ResumenParteMO> informePartesPorFecha(Optional<Date> fecha) {
        return repository.informePartesPorFecha(fecha);
    }

    public Object validar(Date fecha) {
        Collection<ResumenParteMO> resumen = repository.informePartesALaFecha(fecha);
        for (ResumenParteMO resPMO : resumen) {
            Operario operario = operarioService.findByLegajo(resPMO.getLegajo());
            List<ParteMO> partes = this.partesDeUnResumen(operario, resPMO.getFecha());
            for (ParteMO parteMO : partes) {
                parteMO.setEstado(estadoService.estadoValido());    //Seteo por defecto todos en valido, despues si son invalidos se cambia.
                if (resPMO.getHoras().isBefore(resPMO.getHorasPartes())) {
                    invalidarParte(parteMO);
                    ValidacionParteMO validacion = validacionParteMOService.superposicionHoraria();
                    agregarLog(resPMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacion);
                }
                if (resPMO.getIngreso().isBefore(operario.getHoraDesde())
                        || (resPMO.getEgreso().isAfter(operario.getHoraHasta()))) {
                    invalidarParte(parteMO);
                    ValidacionParteMO validacion = validacionParteMOService.fueraDeTurno();
                    agregarLog(resPMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacion);
                } else {
                    if (resPMO.getIngreso().isAfter(operario.getHoraDesde())
                            || (resPMO.getEgreso().isBefore(operario.getHoraHasta()))) {
                        invalidarParte(parteMO);
                        ValidacionParteMO validacion = validacionParteMOService.incumpleHorario();
                        agregarLog(resPMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacion);
                    }
                }
                if (resPMO.getHoras().isAfter(resPMO.getHorasPartes())) {
                    invalidarParte(parteMO);
                    ValidacionParteMO validacion = validacionParteMOService.huecoHorario();
                    agregarLog(resPMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacion);
                }
            }
        }
        return resumen;
    }

    private void invalidarParte(ParteMO parteMO) {

        parteMO.setEstado(estadoService.estadoInvalido());
        repository.save(parteMO);

    }

    public void agregarLog(Date fecha, Estado estado, ParteMO parteMO, ValidacionParteMO validacion) {

        LogValidacionParteMO log = logValidacionParteMOService.agregarLog(fecha, estado, validacion);
        parteMO.getLogsValidacion().add(log);
        repository.save(parteMO);

    }

    public List<ParteMO> partesDeUnResumen(Operario operario, Date fecha) {
        return repository.partesDeUnResumen(operario, fecha);
    }

    @Transactional
    public ParteMO create(ParteMO parteMO) throws TareaNoDisponibleException {

        boolean tareaRepetida = validarTarea(parteMO.getOperario(), parteMO.getFecha(), parteMO.getTarea());

        if (tareaRepetida) {
            throw new TareaNoDisponibleException();
        }

        parteMO.setEstado(estadoService.estadoGenerado());
        long minutos = Duration.between(parteMO.getHoraDesde(), parteMO.getHoraHasta()).toMinutes();
        float horas = minutos / 60.0f; // Le indico que tiene que tener decimales
        parteMO.setHoras(horas);

        return repository.save(parteMO);

    }

    public boolean validarTarea(Operario operario, Date fecha, Tarea tarea) {
        List<ParteMO> partes = repository.partesDeUnResumen(operario, fecha);
        for (ParteMO parteMO : partes) {
            if (parteMO.getTarea().getCodigo().equals(tarea.getCodigo())) {
                return true;
            }
        }
        return false;

    }

    @Transactional
    public ParteMO update(ParteMO parteMO) {

        List<ParteMO> partes = partesDeUnResumen(parteMO.getOperario(), parteMO.getFecha());

        for (ParteMO parte : partes) {
            if (parte.getEstado() != estadoService.estadoCorregido()) {
                parte.setEstado(estadoService.estadoCorregido());
                repository.save(parte);
            }
        }

        return repository.save(parteMO);

    }

}
