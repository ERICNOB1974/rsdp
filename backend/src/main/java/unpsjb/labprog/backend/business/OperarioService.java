package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.HistoricoTurno;
import unpsjb.labprog.backend.model.Operario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import org.springframework.dao.DataIntegrityViolationException;

@Service
public class OperarioService {
    
    @Autowired
    OperarioRepository repository;

    public List<Operario> search (String term){
        return repository.search("%" + term.toUpperCase() + "%");
    }

    public List<Operario> findAll(){
        List<Operario> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }
    
    public Operario findById(int id){
        return repository.findById(id).orElse(null);
    }

    public Operario findByLegajo(int legajo){
        return repository.findByLegajo(legajo).orElse(null);
    }

    @Transactional
    public void delete(int id){
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el operario (...).", e);
        }
    }

    public Page<Operario> findByPage(int page, int size){
        return repository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public Operario save(Operario aOperario) throws SuperposicionDeFechasException, NoExisteTurnoException {
        if (haySuperposicionDeFechas(aOperario)) {
            throw new SuperposicionDeFechasException();
        }

        for (HistoricoTurno historicoTurno : aOperario.getHistoricoTurnos()){
            if (historicoTurno.getFechaTurnoDesde().before(historicoTurno.getTipoTurno().getFechaArranque())){
                throw new NoExisteTurnoException();
            }
        }

        return repository.save(aOperario);
    }
    
    private boolean haySuperposicionDeFechas(Operario aOperario) {
        List<HistoricoTurno> historicoTurnos = aOperario.getHistoricoTurnos();
    
        if (historicoTurnos.size() == 1 && historicoTurnos.get(0).getFechaTurnoHasta() == null) {
            return false; // Solo hay un historial de turno con fechaHasta nula, no hay superposición
        }
    
        for (int i = 0; i < historicoTurnos.size(); i++) {
    
            for (int j = i + 1; j < historicoTurnos.size(); j++) {
    
                // Verificamos si hay superposición entre el turno actual y el siguiente
                if (seSuperponen(historicoTurnos.get(i).getFechaTurnoDesde(), historicoTurnos.get(i).getFechaTurnoHasta(), historicoTurnos.get(j).getFechaTurnoDesde(), historicoTurnos.get(j).getFechaTurnoHasta())) {
                    return true;
                }
    
                // Verificamos si hay superposición del turno siguiente con un turno vigente
                if (historicoTurnos.get(i).getFechaTurnoHasta() == null && seSuperponen(historicoTurnos.get(i).getFechaTurnoDesde(), null, historicoTurnos.get(j).getFechaTurnoDesde(), historicoTurnos.get(j).getFechaTurnoHasta())) {
                    return true;
                }
    
                // Verificamos si hay superposición del turno actual con un turno vigente
                if (historicoTurnos.get(j).getFechaTurnoHasta() == null && seSuperponen(historicoTurnos.get(j).getFechaTurnoDesde(), null, historicoTurnos.get(i).getFechaTurnoDesde(), historicoTurnos.get(i).getFechaTurnoHasta())) {
                    return true;
                }
            }
        }
        return false; 
    }
    
    private boolean seSuperponen(Date fechaDesdeActual, Date fechaHastaActual, Date fechaDesdeSiguiente, Date fechaHastaSiguiente) {
        if (fechaDesdeActual == null || fechaDesdeSiguiente == null) {
            return false;
        }
    
        if (fechaHastaActual == null) {
            fechaHastaActual = new Date(Long.MAX_VALUE); // Consideramos como una fecha en el futuro lejano
        }
    
        if (fechaHastaSiguiente == null) {
            fechaHastaSiguiente = new Date(Long.MAX_VALUE); // Consideramos como una fecha en el futuro lejano
        }
    
        // Verificamos si los rangos se superponen
        return fechaDesdeActual.getTime()<=(fechaHastaSiguiente.getTime()) && fechaDesdeSiguiente.getTime()<=(fechaHastaActual.getTime());
    }
    
}