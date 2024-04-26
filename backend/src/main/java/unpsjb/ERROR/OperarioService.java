/*package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Operario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
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
    
    public Operario findById(int legajo){
        return repository.findById(legajo).orElse(null);
    }

    @Transactional
    public Operario create(Operario aOperario){
        try {
            return repository.save(aOperario);
        } catch (DataIntegrityViolationException e){
            throw new RuntimeException("No se puede crear el cliente debido a que ya existe un cliente con ese nombre.");
        }
    }

    @Transactional
    public void delete(int legajo){
        try {
            repository.deleteByLegajo(legajo);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el cliente debido a que pertenece a un bordero.", e);
        }
    }

    public Page<Operario> findByPage(int page, int size){
        return repository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public Operario save(Operario e){
        return repository.save(e);
    }

}*/