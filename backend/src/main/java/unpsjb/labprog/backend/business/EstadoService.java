package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Estado;

@Service
public class EstadoService {
    
    @Autowired
    EstadoRepository repository;

    public Estado estadoGenerado(){
        return repository.findById(1).orElse(null);
    }

}
