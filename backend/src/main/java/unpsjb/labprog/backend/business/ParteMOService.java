package unpsjb.labprog.backend.business;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.ParteMO;
import unpsjb.labprog.backend.model.ResumenParteMO;
import unpsjb.labprog.backend.model.Estado;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import java.util.List;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;


@Service
public class ParteMOService {
    
    @Autowired
    ParteMORepository repository;
    
    @Autowired
    EstadoService estadoService;

    public ParteMO findById(int id){
        return repository.findById(id).orElse(null);
    }

    public List<ParteMO> findAll(){
        List<ParteMO> result = new ArrayList<>();
        repository.findAll().forEach(e -> result.add(e));
        return result;
    }

    @Transactional
    public void delete(int id){
        repository.deleteById(id);
        
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
        Estado estadoGenerado = estadoService.estadoGenerado();
        e.setEstado(estadoGenerado);
        return repository.save(e);
    }

}
