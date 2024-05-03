package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;

import org.springframework.dao.DataIntegrityViolationException;

@Service
public class ParteMOService {
    
    @Autowired
    ParteMORepository repository;
    
    public ParteMO findById(int id){
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

    public Page<ParteMO> findByPage(int page, int size){
        return repository.findAll(PageRequest.of(page, size));
    }

    public Collection<ResumenParteMO> informePartesPorFecha(Date fecha){
        return repository.informePartesPorFecha(fecha);
    }

    public Collection<ResumenParteMO> informePartesGeneral(){
        return repository.informePartesGeneral();
    }

    @Transactional
    public ParteMO save(ParteMO e){
        return repository.save(e);
    }

}
