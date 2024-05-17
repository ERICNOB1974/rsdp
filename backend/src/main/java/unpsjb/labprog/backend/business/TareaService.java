package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Operario;
import unpsjb.labprog.backend.model.Tarea;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import org.springframework.dao.DataIntegrityViolationException;

@Service
public class TareaService {
    
    @Autowired
    TareaRepository repository;

    public List<Tarea> search (String term){
        return repository.search("%" + term.toUpperCase() + "%");
    }

    public List<Tarea> findAll(){
        List<Tarea> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }

    public Tarea findById(int id){
        return repository.findById(id).orElse(null);
    }

    public Tarea findByCodigo(String codigo){
        return repository.findByCodigo(codigo);
    }

    @Transactional
    public void delete(int id){
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar la tarea (...)", e);
        }
    }

    public Page<Tarea> findByPage(int page, int size){
        return repository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public Tarea save(Tarea e){
        return repository.save(e);
    }

}
