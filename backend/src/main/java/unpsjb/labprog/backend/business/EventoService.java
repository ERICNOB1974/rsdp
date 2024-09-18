package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Evento;

import java.util.List;

@Service
public class EventoService {

    @Autowired
    EventoRepository eventoRepository;

    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    @Transactional
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    @Transactional
    public void deleteById(Long id) {
        eventoRepository.deleteById(id);
    }

    public Evento findById(Long id){
        return eventoRepository.findById(id).orElse(null);
    }

}
