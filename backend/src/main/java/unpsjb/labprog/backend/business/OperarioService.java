package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Operario;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
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

    public Operario create(Operario aOperario) {
        try {
            /*String turno = aOperario.getTurno();
            String[] turnoParts = turno.split("a");

            // Parsear la hora desde y hasta el turno
            LocalTime horaDesde = parseHora(turnoParts[0]);
            LocalTime horaHasta = parseHora(turnoParts[1]);

            // Establecer las horas en el objeto Operario
            aOperario.setHoraDesde(horaDesde);
            aOperario.setHoraHasta(horaHasta);
*/
            // Guardar el operario
            return repository.save(aOperario);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Error");
        }
    }

    private LocalTime parseHora(String horaStr) {
        // Agregar un 0 si la hora tiene un solo dígito y luego formatear
        if (horaStr.length() == 1) {
            horaStr = "0" + horaStr;
        }
        String horaFormateada = horaStr + ":00:00";
        return LocalTime.parse(horaFormateada, DateTimeFormatter.ofPattern("HH:mm:ss"));
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
    public Operario save(Operario e){
        return repository.save(e);
    }

}