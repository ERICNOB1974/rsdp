package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Proyecto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.ArrayList;
import org.springframework.dao.DataIntegrityViolationException;

@Service
public class ProyectoService {
    
    @Autowired
    ProyectoRepository repository;

    public List<Proyecto> search (String term){
        return repository.search("%" + term.toUpperCase() + "%");
    }

    public List<Proyecto> findAll(){
        List<Proyecto> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }
    
    public Proyecto findById(int id){
        return repository.findById(id).orElse(null);
    }

    public Proyecto findByCodigo(String codigo){
        return repository.findByCodigo(codigo);
    }

    @Transactional
    public void delete(int id){
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el proyecto (...)", e);
        }
    }

    public Page<Proyecto> findByPage(int page, int size){
        return repository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public Proyecto save(Proyecto e){
        return repository.save(e);
    }

}