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

    public Estado estadoValido(){
        return repository.findById(2).orElse(null);
    }

    public Estado estadoInvalido(){
        return repository.findById(3).orElse(null);
    }
    
    public Estado estadoCorregido(){
        return repository.findById(5).orElse(null);
    }
    
    public Estado estadoGeneradoLog(){
        return repository.findById(10).orElse(null);
    }

}
