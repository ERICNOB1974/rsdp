package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Empresa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.ArrayList;
import org.springframework.dao.DataIntegrityViolationException;

@Service
public class EmpresaService {
    
    @Autowired
    EmpresaRepository repository;

    public List<Empresa> search (String term){
        return repository.search("%" + term.toUpperCase() + "%");
    }

    public List<Empresa> findAll(){
        List<Empresa> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }
    
    public Empresa findById(int id){
        return repository.findById(id).orElse(null);
    }

    public Empresa findByCuit(String cuit){
        return repository.findByCuit(cuit).orElse(null);
    }

    @Transactional
    public Empresa create(Empresa aEmpresa){
        try {
            return repository.save(aEmpresa);
        } catch (DataIntegrityViolationException e){
            throw new RuntimeException("No se puede crear el cliente debido a que ya existe un cliente con ese cuit.");
        }
    }

    @Transactional
    public void delete(int id){
        try {
            repository.deleteById(id);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("No se puede eliminar el cliente (...)", e);
        }
    }

    public Page<Empresa> findByPage(int page, int size){
        return repository.findAll(PageRequest.of(page, size));
    }

    @Transactional
    public Empresa save(Empresa e){
        return repository.save(e);
    }

}