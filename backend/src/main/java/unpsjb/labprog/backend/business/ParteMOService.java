package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;
import unpsjb.labprog.backend.model.TipoTurno;
import unpsjb.labprog.backend.model.ValidacionParteMO;
import unpsjb.labprog.backend.business.validar.ValidadorParteMO;
import unpsjb.labprog.backend.model.Estado;
import unpsjb.labprog.backend.model.LogValidacionParteMO;
import unpsjb.labprog.backend.model.Operario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

import java.util.List;
import java.util.Optional;
import java.time.Duration;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
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
    ProyectoService proyectoService;

    @Autowired
    TareaService tareaService;

    @Autowired
    TipoTurnoService tipoTurnoService;

    @Autowired
    ValidacionParteMOService validacionParteMOService;

    @Autowired
    LogValidacionParteMOService logValidacionParteMOService;

    @Autowired
    private List<ValidadorParteMO> validadores;

    public ParteMO findById(int id) {
        return repository.findById(id).orElse(null);
    }

    public List<ParteMO> findAll() {
        return repository.findAll();
    }

    public Page<ResumenParteMO> getInvalidosPage(Optional<Date> fecha, int page, int size) {
        return repository.getInvalidos(fecha, PageRequest.of(page, size));
    }

    public Page<ResumenParteMO> getValidosPage(Optional<Date> fecha, int page, int size) {
        return repository.getValidos(fecha, PageRequest.of(page, size));
    }

    public Page<ResumenParteMO> getTodosPage(Optional<Date> fecha, int page, int size) {
        return repository.getTodos(fecha, PageRequest.of(page, size));
    }

    public Object anularParte(int id) {
        ParteMO parteMO = repository.findById(id).orElse(null);
        List<ParteMO> partes = partesDeUnResumen(parteMO.getOperario(), parteMO.getFecha());
        parteMO.setEstado(estadoService.estadoAnulado());
        for (ParteMO parte : partes) {
            if (parte.getEstado() != estadoService.estadoAnulado()) {
                parte.setEstado(estadoService.estadoCorregido());
                repository.save(parte);
            }
        }
        return repository.save(parteMO);
    }

    public Page<ParteMO> findByPage(int page, int size) {
        return repository.findAll(PageRequest.of(page, size));
    }

    public Page<ResumenParteMO> informePartesPorFecha(Optional<Date> fecha,int page, int size) {
        return repository.informePartesPorFecha(fecha,PageRequest.of(page,size));
    }

    public Object validar(Optional<Date> fecha) {
        for (ResumenParteMO resPMO : repository.informePartesALaFecha(fecha)) {
            this.invalidarLogs(
                    this.partesDeUnResumen(operarioService.findByLegajo(resPMO.getLegajo()), resPMO.getFecha()));
            for (ParteMO parteMO : this.partesDeUnResumen(operarioService.findByLegajo(resPMO.getLegajo()),
                    resPMO.getFecha())) {
                parteMO.setEstado(estadoService.estadoValido()); // Todos empiezan en valido
                for (ValidadorParteMO validador : validadores) {
                    if (!validador.validar(resPMO, parteMO)) {
                        break;
                    }
                }
                if (parteMO.getEstado().equals(estadoService.estadoValido())) {
                    agregarLog(resPMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacionParteMOService.valido());
                }
            }
        }
        return repository.informePartesALaFecha(fecha);
    }
    

    public Object validarComoSupervisor(String legajoOperario, Date fecha) {
        List<ParteMO> partes = this.partesDeUnResumen(operarioService.findByLegajo(Integer.parseInt(legajoOperario)),
                fecha);
        this.invalidarLogs(partes);
        for (ParteMO parteMO : partes) {
            parteMO.setEstado(estadoService.estadoValidado());
            ValidacionParteMO validacion = validacionParteMOService.validado();
            this.agregarLog(parteMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacion);
            repository.save(parteMO);
        }
        return partes;
    }

    public Object rechazarComoSupervisor(String legajoOperario, Date fecha) {
        List<ParteMO> partes = this.partesDeUnResumen(operarioService.findByLegajo(Integer.parseInt(legajoOperario)),
                fecha);
        this.invalidarLogs(partes);
        for (ParteMO parteMO : partes) {
            parteMO.setEstado(estadoService.estadoRechazado());
            ValidacionParteMO validacion = validacionParteMOService.rechazado();
            this.agregarLog(parteMO.getFecha(), estadoService.estadoGeneradoLog(), parteMO, validacion);
            repository.save(parteMO);
        }
        return partes;
    }

    private void invalidarLogs(List<ParteMO> partes) {
        Estado estadoCaducado = estadoService.estadoCaducadoLog();

        for (ParteMO parte : partes) {
            Collection<LogValidacionParteMO> logsValidacion = parte.getLogsValidacion();
            for (LogValidacionParteMO log : logsValidacion) {
                log.setEstado(estadoCaducado);
            }
        }
    }

    public void invalidarParte(ParteMO parteMO) {

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
    public ParteMO create(ParteMO parteMO) throws NoExisteTurnoException {

        parteMO.setEstado(estadoService.estadoGenerado());
        List<ParteMO> partes = this.partesDeUnResumen(operarioService.findByLegajo(parteMO.getOperario().getLegajo()),
                parteMO.getFecha());
        for (ParteMO parte : partes) {
            if (parte.getEstado() != estadoService.estadoCorregido()
                    && parte.getEstado() != estadoService.estadoGenerado()) {
                parte.setEstado(estadoService.estadoCorregido());
                repository.save(parte);
            }
        }
        long minutos = Duration.between(parteMO.getHoraDesde(), parteMO.getHoraHasta()).toMinutes();
        float horas = minutos / 60.0f; // Le indico que tiene que tener decimales
        parteMO.setHoras(horas);

        if (tipoTurnoService.obtenerTurno(parteMO.getOperario().getLegajo(), parteMO.getFecha()) == null) {
            throw new NoExisteTurnoException();
        }

        return repository.save(parteMO);

    }

    public List<ParteMO> partesDeUnResumen(String legajoOperario, Date fecha) {
        return repository.partesDeUnResumen(operarioService.findByLegajo(Integer.parseInt(legajoOperario)), fecha);
    }

    public ParteMO parteDadoProyectoYTarea(Date fecha, String legajoOperario, String codigoProyecto,
            String codigoTarea) {
        return repository.parteDadoProyectoYTarea(fecha, operarioService.findByLegajo(Integer.parseInt(legajoOperario)),
                proyectoService.findByCodigo(codigoProyecto), tareaService.findByCodigo(codigoTarea));
    }

    public List<ParteMO> partesConEstadoInvalido() {
        return repository.partesConEstadoInvalido();
    }

    public List<ParteMO> partesConEstadoCorregido() {
        return repository.partesConEstadoCorregido();
    }

    @Transactional
    public ParteMO update(ParteMO parteMO) {

        long minutos = Duration.between(parteMO.getHoraDesde(), parteMO.getHoraHasta()).toMinutes();
        float horas = minutos / 60.0f; // Le indico que tiene que tener decimales
        parteMO.setHoras(horas);

        parteMO.setEstado(estadoService.estadoCorregido());
        List<ParteMO> partes = partesDeUnResumen(parteMO.getOperario(), parteMO.getFecha());
        for (ParteMO parte : partes) {
            if (parte.getEstado() != estadoService.estadoCorregido()) {
                parte.setEstado(estadoService.estadoCorregido());
                repository.save(parte);
            }
        }

        return repository.save(parteMO);

    }

    public String obtenerEstadoTrabajo(Operario operario, Date fecha) {

        // Convertir Date a LocalDate para utilizar ChronoUnit.DAYS.between
        LocalDate fechaConsulta = fecha.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();

        TipoTurno tipoTurno = tipoTurnoService.obtenerTurno(operario.getLegajo(), fecha);

        // Convertir la fecha de inicio del turno a LocalDate
        LocalDate fechaInicioTurno = tipoTurno.getFechaArranque().toInstant().atZone(ZoneId.systemDefault())
                .toLocalDate();

        long diasTrabajados = ChronoUnit.DAYS.between(fechaInicioTurno, fechaConsulta);
        int ciclo = tipoTurno.getDiasTrabajo() + tipoTurno.getDiasFranco();
        int diaEnElCiclo = (int) (diasTrabajados % ciclo);

        if (diaEnElCiclo < tipoTurno.getDiasTrabajo()) {
            return "Trabajando";
        } else {
            return "Franco";
        }
    }

}
