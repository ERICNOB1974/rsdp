package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ValidacionParteMO;

import java.util.List;
import java.util.ArrayList;
import org.springframework.dao.DataIntegrityViolationException;

@Service
public class ValidacionParteMOService {
    
    @Autowired
    ValidacionParteMORepository repository;

    @Autowired
    EstadoService estadoService;

    public List<ValidacionParteMO> findAll(){
        List<ValidacionParteMO> resultado = new ArrayList<>();
        repository.findAll().forEach(e -> resultado.add(e));
        return resultado;
    }

    public ValidacionParteMO incumpleHorario(){
        return repository.findById(1).orElse(null);
    }
    
    
    public ValidacionParteMO superposicionHoraria(){
        return repository.findById(2).orElse(null);
    }
    
    public ValidacionParteMO huecoHorario(){
        return repository.findById(3).orElse(null);
    }
    
    public ValidacionParteMO fueraDeTurno(){
        return repository.findById(4).orElse(null);
    }

    public ValidacionParteMO valido(){
        return repository.findById(5).orElse(null);
    }

    public ValidacionParteMO validado(){
        return repository.findById(6).orElse(null);
    }

    public ValidacionParteMO rechazado(){
        return repository.findById(7).orElse(null);
    }

    public ValidacionParteMO franco(){
        return repository.findById(8).orElse(null);
    }

    public ValidacionParteMO noExisteTurno(){
        return repository.findById(9).orElse(null);
    }
    
    public ValidacionParteMO findById(int id){
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

    @Transactional
    public ValidacionParteMO save(ValidacionParteMO validacionParteMO){
        return repository.save(validacionParteMO);
    }

}