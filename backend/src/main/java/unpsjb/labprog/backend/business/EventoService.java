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

    // Obtener todos los eventos
    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    // // Buscar eventos por nombre
    // public List<Evento> getEventosByNombreReal(String nombre) {
    //     return eventoRepository.findByNombreReal(nombre);
    // }

    // // Buscar eventos por ubicación
    // public List<Evento> getEventosByNombreUsuario(String ubicacion) {
    //     return eventoRepository.findByNombreUsuario(ubicacion);
    // }

    // Crear o actualizar un evento
    @Transactional
    public Evento save(Evento evento) {
        return eventoRepository.save(evento);
    }

    // Eliminar un evento por ID
    @Transactional
    public void deleteEventoById(Long id) {
        eventoRepository.deleteById(id);
    }
    
}
