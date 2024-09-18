package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Rutina;

@Service
public class RutinaService {

    @Autowired
    RutinaRepository rutinaRepository;

    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }

    @Transactional
    public Rutina save(Rutina rutina) {
        return rutinaRepository.save(rutina);
    }

    @Transactional
    public void deleteById(Long id) {
        rutinaRepository.deleteById(id);
    }

    public Rutina findById(Long id){
        return rutinaRepository.findById(id).orElse(null);
    }

}