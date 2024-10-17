package unpsjb.labprog.backend.business;

import java.time.LocalDate;
import java.time.ZonedDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.exceptions.EventoException;
import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

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
    public Evento crear(Evento evento) throws MessagingException, EventoException {
        // Validar fecha y hora del evento
        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) || evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
            throw new EventoException("El evento no puede crearse en el futuro");
        }
        if (evento.getFechaHora().toLocalDate().isBefore(evento.getFechaDeCreacion()) ||
                evento.getFechaHora().toLocalDate().isEqual(evento.getFechaDeCreacion())) {
            throw new EventoException("El evento no puede tener una fecha anterior a la fecha de creacion");
        }

    
        // Validar latitud y longitud
        if (evento.getLatitud() < -90 || evento.getLatitud() > 90) {
            throw new EventoException("La latitud debe estar entre -90 y 90 grados");
        }
        if (evento.getLongitud() < -180 || evento.getLongitud() > 180) {
            throw new EventoException("La longitud debe estar entre -180 y 180 grados");
        }
    

        /*
         * if (eventoRepository.enComunidad() && !evento.isEsPrivadoParaLaComunidad()) {
         * exception
         * }
         */
    
        return eventoRepository.save(evento);
    }
    

    @Transactional
    public Evento crearConCreador(Evento evento, String nombreUsuario) throws MessagingException, EventoException {
        // suponiendo que se crea ahora mismo
        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) ||
                evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
            throw new EventoException("El evento no puede crearse en el futuro");
        }
        /*
         * if (evento.isEsPrivadoParaLaComunidad()) {
         * // enviar mail a todos los usuarios de la comunidad
         * }
         */
        Evento c = eventoRepository.save(evento);
        eventoRepository.establecerCreador(c.getId(), usuarioService.findByNombreUsuario(nombreUsuario).getId());
        return c;
    }

    public List<Evento> todasLasSugerencias(String nombreUsuario) {
        List<Evento> sugerencias = eventoRepository.sugerenciasDeEventosBasadosEnAmigos(nombreUsuario);
        sugerencias.addAll(eventoRepository.sugerenciasDeEventosBasadosEnComunidades(nombreUsuario));
        sugerencias.addAll(eventoRepository.sugerenciasDeEventosBasadosEnEventos(nombreUsuario));
        Set<Evento> setUsuarios = new HashSet<Evento>();
        setUsuarios.addAll(sugerencias);
        sugerencias.removeAll(sugerencias);
        sugerencias.addAll(setUsuarios);
        return sugerencias;
    }

    public void mail(Evento evento) throws MessagingException {
        Optional<Evento> eventoViejo = eventoRepository.findById(evento.getId());
        if (!eventoViejo.isEmpty()) {
            boolean cambioFecha = evento.getFechaHora() != eventoViejo.get().getFechaHora();
            boolean cambioUbicacion = (evento.getLatitud() != eventoViejo.get().getLatitud())
                    || (evento.getLongitud() != eventoViejo.get().getLongitud());
            emailService.enviarMailCambio(cambioFecha, cambioUbicacion, evento);
        }
        if (eventoViejo.isEmpty() && evento.isEsPrivadoParaLaComunidad()) {
            // emailService.enviarMail();
        }
    }

    @Transactional
    public Evento actualizar(Evento evento) throws MessagingException, EventoException {
        mail(evento);

        if (evento.getFechaHora().isBefore(ZonedDateTime.now()) ||
                evento.getFechaHora().isEqual(ZonedDateTime.now())) {
            throw new EventoException("El evento no puede tener una fecha anterior a ahora");
        }
        return eventoRepository.save(evento);
        // suponiendo que se crea ahora mismo
        /*
         * // falta considerar cuando recien lo crea
         * if (eventoRepository.esOrganizadoPorComunidad(evento) &&
         * !evento.isEsPrivadoParaLaComunidad()) {
         * throw new
         * EventoException("El evento no puede ser publico si se crea dentro de una comunidad"
         * );
         * }
         * if (evento.getFechaDeCreacion().isAfter(LocalDate.now())) {
         * throw new EventoException("El evento no puede crearse en el futuro");
         * 
         * }
         */

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
    }

    public int participantesDeEvento(Long idEvento) {
        return eventoRepository.participantesDeEvento(idEvento);
    }

    public void etiquetarEvento(Evento evento, Long etiqueta) {
        eventoRepository.etiquetarEvento(evento.getId(), etiqueta);
    }

    public boolean participa(String nombreUsuario, Long idEvento) {
        Usuario u = usuarioService.findByNombreUsuario(nombreUsuario);
        return eventoRepository.participa(u.getId(), idEvento);
    }

    public List<Evento> disponibles() {
        return eventoRepository.disponibles();
    }

    public List<Evento> participaUsuario(Long idUsuario){
        return eventoRepository.participaUsuario(idUsuario);
    }

}
