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
    
    public Estado estadoValidado(){
        return repository.findById(4).orElse(null);
    }

    public Estado estadoCorregido(){
        return repository.findById(5).orElse(null);
    }

    public Estado estadoRechazado(){
        return repository.findById(6).orElse(null);
    }

    public Estado estadoAnulado(){
        return repository.findById(7).orElse(null);
    }
    
    public Estado estadoGeneradoLog(){
        return repository.findById(10).orElse(null);
    }

    public Estado estadoCaducadoLog(){
        return repository.findById(11).orElse(null);
    }

}
