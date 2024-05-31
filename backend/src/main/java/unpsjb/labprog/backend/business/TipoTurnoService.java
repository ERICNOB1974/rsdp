package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Horario;
import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.TipoTurno;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.Date;

@Service
public class TipoTurnoService {
    
    @Autowired
    TipoTurnoRepository repository;

    @Autowired
    OperarioService operarioService;

    public TipoTurno findById(int id){
        return repository.findById(id).orElse(null);
    }

    public TipoTurno obtenerTurno(Operario operario, Date fecha){
        return repository.obtenerTurno(operario,fecha);
    }

    public LocalTime obtenerHoraDesde(Operario operario, Date fecha) {
        TipoTurno tipoTurno = obtenerTurno(operario, fecha);
        return this.getTurnoActual(tipoTurno, fecha).getHoraDesde();
    }

    public LocalTime obtenerHoraHasta(Operario operario, Date fecha) {
        TipoTurno tipoTurno = obtenerTurno(operario, fecha);
        return this.getTurnoActual(tipoTurno, fecha).getHoraHasta();
    }

    public Horario obtenerHorario(int operarioLegajo, Date fecha) {
        TipoTurno tipoTurno = obtenerTurno(operarioService.findByLegajo(operarioLegajo), fecha);
        return this.getTurnoActual(tipoTurno, fecha);
    }

    private Horario getTurnoActual(TipoTurno tipoTurno, Date fecha) {
        LocalDate fechaConsulta = fecha.toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        
        LocalDate fechaInicioTurno = tipoTurno.getFechaArranque().toInstant().atZone(ZoneId.systemDefault()).toLocalDate();
        
        long diasDesdeInicio = ChronoUnit.DAYS.between(fechaInicioTurno, fechaConsulta);

        List<Horario> horarios = tipoTurno.getHorarios();

        int cantidadHorarios = horarios.size();

        int ciclo = tipoTurno.getDiasTrabajo() + tipoTurno.getDiasFranco();

        int indice = (int) (diasDesdeInicio / ciclo) % cantidadHorarios;

        int diaEnElCiclo = (int) (diasDesdeInicio % ciclo);

        if (diaEnElCiclo >= tipoTurno.getDiasTrabajo()){
            return null; //Esta en franco
        }
        
        return horarios.get(indice);

    }    

    @Transactional
    public TipoTurno save(TipoTurno e){
        return repository.save(e);
    }

    public List<TipoTurno> findAll() {
        return repository.findAll();
    }

}
