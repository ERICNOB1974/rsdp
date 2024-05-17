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
        List<ValidacionParteMO> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }

    public ValidacionParteMO fueraDeTurno(){
        return repository.findById(4).orElse(null);
    }

    public ValidacionParteMO incumpleHorario(){
        return repository.findById(1).orElse(null);
    }

    public ValidacionParteMO huecoHorario(){
        return repository.findById(3).orElse(null);
    }

    public ValidacionParteMO superposicionHoraria(){
        return repository.findById(2).orElse(null);
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
    public ValidacionParteMO save(ValidacionParteMO e){
        return repository.save(e);
    }

}