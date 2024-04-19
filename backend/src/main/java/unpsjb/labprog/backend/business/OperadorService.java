package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Operador;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.ArrayList;
import org.springframework.dao.DataIntegrityViolationException;

@Service
public class OperadorService {
    
    @Autowired
    OperadorRepository repository;

    public List<Operador> search (String term){
        return repository.search("%" + term.toUpperCase() + "%");
    }

    public List<Operador> findAll(){
        List<Operador> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }
    
    public Operador findById(int legajo){
        return repository.findById(legajo).orElse(null);
    }

    @Transactional
    public Operador create(Operador aOperador){
        try {
            return repository.save(aOperador);
        } catch (DataIntegrityViolationException e){
            throw new RuntimeException("No se puede crear el cliente debido a que ya existe un cliente con ese nombre.");
        }
    }

    @Transactional
    public void delete(int legajo){
        try {
            repository.deleteById(legajo);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el cliente debido a que pertenece a un bordero.", e);
        }
    }

    public Page<Operador> findByPage(int page, int size){
        return repository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public Operador save(Operador e){
        return repository.save(e);
    }

}