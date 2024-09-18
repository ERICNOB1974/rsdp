package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Etiqueta;

@Service
public class EtiquetaService {
    
    @Autowired
    EtiquetaRepository etiquetaRepository;

    public List<Etiqueta> findAll() {
        return etiquetaRepository.findAll();
    }

    @Transactional
    public Etiqueta save(Etiqueta etiqueta) {
        return etiquetaRepository.save(etiqueta);
    }

    @Transactional
    public void deleteById(Long id) {
        etiquetaRepository.deleteById(id);
    }

    public Etiqueta findById(Long id){
        return etiquetaRepository.findById(id).orElse(null);
    }

}
