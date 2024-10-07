package unpsjb.labprog.backend.business;

import java.time.ZonedDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Evento;

@Service
public class InscripcionEventoService {

    @Autowired
    private EventoRepository eventoRepository;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private EmailService emailService;

    public String inscribirse(Long idEvento, Long idUsuario) {
        Optional<Evento> evento = eventoRepository.findById(idEvento);
        if (evento.get().getCantidadMaximaParticipantes() == eventoRepository.participantesDeEvento(idEvento)) {
            return "No se registro la inscripcion debido a que no hay mas cupos.";
        }
        if (eventoRepository.participa(idUsuario, idEvento)) {
            return "El usuario ya participa en este evento.";
        }
        if (evento.get().getFechaHora().isBefore(ZonedDateTime.now()) || evento.get().getFechaHora().isEqual(ZonedDateTime.now())) {
            return "El evento ya ocurrio.";
        }

        usuarioRepository.inscribirse(idEvento, idUsuario);
        emailService.enviarMailInscripcion(evento.get(), usuarioRepository.findById(idUsuario).get());
        return "Inscripcion registrada con exito";
    }
}
