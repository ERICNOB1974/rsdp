package unpsjb.labprog.backend.business;

import java.util.List;
import java.util.Optional;

import java.util.Comparator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import unpsjb.labprog.backend.model.Evento;

@Service
public class EventoService {

    @Autowired
    EventoRepository eventoRepository;

    @Autowired
    UsuarioService usuarioService; // Suponiendo que tengas este servicio para acceder al usuario

    public List<Evento> findAll() {
        return eventoRepository.findAll();
    }

    public List<Evento> sugerenciaDeEventosBasadosEnEventos(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnEventos(nombreUsuario);
    }

    public List<Evento> sugerenciaDeEventosBasadosEnRutinas(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnRutinas(nombreUsuario);
    }

    public List<Evento> sugerenciaDeEventosBasadosEnComunidades(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnComunidades(nombreUsuario);
    }

    public List<Evento> sugerenciasDeEventosBasadosEnAmigos(String nombreUsuario) {
        return eventoRepository.sugerenciasDeEventosBasadosEnAmigos(nombreUsuario);
    }

    @Transactional
    public Evento save(Evento evento) {
       Optional<Evento> eventoViejo= eventoRepository.findById(evento.getId());
        if (!eventoViejo.isEmpty()){
            boolean cambioFecha=evento.getFechaHora()!=eventoViejo.get().getFechaHora();
            //boolean cambioLatitud=evento.getFechaHora()!=eventoViejo.get().getFechaHora();
            //boolean cambioLongitud=evento.getFechaHora()!=eventoViejo.get().get;

            //ver si cambio la ubicacion
            //ver si cambio la fecha
        }
        return eventoRepository.save(evento);
    }

    @Transactional
    public void deleteById(Long id) {
        eventoRepository.deleteById(id);
    }

    public Evento findById(Long id) {
        return eventoRepository.findById(id).orElse(null);
    }

    public List<Evento> eventosProximos() {
        return eventoRepository.eventosProximos();
    }

    public List<Evento> eventosNuevosComunidad(Usuario u) {
        return eventoRepository.eventosNuevosComunidad(u);
      
    public int participantesDeEvento(Long idEvento) {
     return eventoRepository.panticipantesDeEvento(idEvento);
    }

}
