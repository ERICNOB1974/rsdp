package unpsjb.labprog.backend.business;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.exceptions.EventoException;
import unpsjb.labprog.backend.model.Evento;

@Service
public class EventoService {

    @Autowired
    EventoRepository eventoRepository;

    @Autowired
    UsuarioService usuarioService;
    @Autowired
    EmailService emailService;

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
    public Evento save(Evento evento) throws MessagingException, EventoException {
        Optional<Evento> eventoViejo = eventoRepository.findById(evento.getId());
        if (!eventoViejo.isEmpty()) {
            boolean cambioFecha = evento.getFechaHora() != eventoViejo.get().getFechaHora();
            boolean cambioUbicacion = (evento.getLatitud() != eventoViejo.get().getLatitud())
                    || (evento.getLongitud() != eventoViejo.get().getLongitud());
            emailService.enviarMailCambio(cambioFecha, cambioUbicacion, evento);
        }
        if (eventoViejo.isEmpty() && evento.isEsPrivadoParaLaComunidad()) {
            emailService.enviarMail();
        }

        // suponiendo que se crea ahora mismo
        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) ||
                evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");

        }
        // falta considerar cuando recien lo crea
        if (eventoRepository.esOrganizadoPorComunidad(evento) && !evento.isEsPrivadoParaLaComunidad()) {
            throw new EventoException("El evento no puede ser publico si se crea dentro de una comunidad");
        }
        if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
            throw new EventoException("El evento no puede crearse en el futuro");

        }
        // que el creador no sea nulo
        /*
         * if (evento){
         * 
         * }
         */

        // opciones para cuando hay una relacion
        /*
         * 1. establecer la relacion aca obligatoriamente si es nuevo el evento.
         * si es viejo la busco. si quiero actualizar esa relacion no permitir que la
         * actualice mal
         * 
         */
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

    public int participantesDeEvento(Long idEvento) {
        return eventoRepository.participantesDeEvento(idEvento);
    }

}
