package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Estado;
import unpsjb.labprog.backend.model.LogValidacionParteMO;
import unpsjb.labprog.backend.model.ValidacionParteMO;
import java.util.List;
import java.util.ArrayList;
import java.util.Date;

import org.springframework.dao.DataIntegrityViolationException;

@Service
public class LogValidacionParteMOService {
    
    @Autowired
    LogValidacionParteMORepository repository;

    @Autowired
    EstadoService estadoService;

    public List<LogValidacionParteMO> findAll(){
        List<LogValidacionParteMO> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }
    
    public LogValidacionParteMO findById(int id){
        return repository.findById(id).orElse(null);
    }

    @Transactional
    public void delete(int id){
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el proyecto (...)", e);
        }
    }

    public LogValidacionParteMO agregarLog(Date fecha,Estado estado, ValidacionParteMO validacion){
       
        LogValidacionParteMO log = new LogValidacionParteMO();
        log.setFecha(fecha);
        log.setEstado(estado);
        log.setValidacionParteMO(validacion);
        this.save(log);
        return log;
        
    }

    @Transactional
    public LogValidacionParteMO save(LogValidacionParteMO e){
        return repository.save(e);
    }

}