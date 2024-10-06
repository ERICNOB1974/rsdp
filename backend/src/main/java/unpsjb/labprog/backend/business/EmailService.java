package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Email;
import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private EventoRepository eventoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ComunidadRepository comunidadRepository;

    @Autowired
    private LocationService locationService;

    public void enviarMail() throws MessagingException {
        try {
            Map<Evento, List<Usuario>> usuarios = usuariosNotificables();
            for (Map.Entry<Evento, List<Usuario>> entry : usuarios.entrySet()) {
                Evento evento = entry.getKey();
                List<Usuario> listaUsuarios = entry.getValue();
                Email email = new Email();
                email.setAsunto("Recordatorio de un evento");
                for (Usuario usuario : listaUsuarios) {
                    String msj = "Hola " + usuario.getNombreReal() + ". \n Te recordamos que mañana a las "
                            + evento.getFechaHora().getHour() + ":" + evento.getFechaHora().getMinute() +
                            " será el evento "
                            + ".\n Descripción: "
                            + evento.getDescripcion();

                    email.setMensaje(msj);
                    email.setDestinatario(usuario.getCorreoElectronico());
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    public void enviarMailCambio(boolean cambioFecha, boolean cambioUbicacion, Evento evento)
            throws MessagingException {
        Email email = new Email();
        email.setAsunto("Cambio en un evento");
        List<Usuario> listaUsuarios = eventoRepository.inscriptosEvento(evento.getId());
        String mensajeParte1 = "El evento " + evento.getNombre() + ", al que estás inscripto, sufrió un cambio en ";

        StringBuilder mensajeParte2 = new StringBuilder();

       String ubicacion= locationService.getDisplayName(evento.getLatitud(), evento.getLongitud());
        if (cambioFecha && cambioUbicacion) {
            mensajeParte2.append("la fecha y la ubicación.");
            mensajeParte2.append("\nNueva fecha: ").append(evento.getFechaHora());
            mensajeParte2.append("\nNueva ubicación: ").append(ubicacion);
        } else if (cambioFecha) {
            mensajeParte2.append("la fecha.");
            mensajeParte2.append("\nNueva fecha: ").append(evento.getFechaHora());
        } else if (cambioUbicacion) {
            mensajeParte2.append("la ubicación.");
            mensajeParte2.append("\nNueva ubicación: ").append(ubicacion);
        }
        try {
            for (Usuario usuario : listaUsuarios) {
                String msj = "Hola " + usuario.getNombreReal();
                String mensajeFinal = msj + mensajeParte1 + mensajeParte2.toString();
                email.setMensaje(mensajeFinal);
                email.setDestinatario(usuario.getCorreoElectronico());
                enviarMailGenerico(email);
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    public void enviarMailCreacionEvento(Evento evento)
            throws MessagingException {
        Email email = new Email();
        email.setAsunto("Creacion de un evento");
        Comunidad organizadora = comunidadRepository.comunidadOrganizadora(evento);
        List<Usuario> listaUsuarios = usuarioRepository.miembros(organizadora.getId());
        String mensajeParte1 = "La comunidad " + organizadora.getNombre() + ", en la que participas, creo el evento "
                + evento.getNombre();
        try {
            for (Usuario usuario : listaUsuarios) {
                String msj = "Hola " + usuario.getNombreReal();
                String mensajeFinal = msj + mensajeParte1;
                email.setMensaje(mensajeFinal);
                email.setDestinatario(usuario.getCorreoElectronico());
                enviarMailGenerico(email);
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    private void enviarMailGenerico(Email email) {
        try {
            MimeMessage mensaje = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

            helper.setSubject(email.getAsunto());
            Context context = new Context();
            helper.setTo(email.getDestinatario());

            // Añadir el mensaje al contexto para el template HTML
            context.setVariable("mensaje", email.getMensaje());
            String contentHtml = templateEngine.process("email", context); // 'email' es el nombre del archivo .html
            // HTML
            helper.setText(contentHtml, true); 

            // Enviar el correo
            javaMailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    private Map<Evento, List<Usuario>> usuariosNotificables() {
        List<Evento> eventos = eventoRepository.eventosProximos();
        Map<Evento, List<Usuario>> usuariosMapeados = new HashMap<>();
        for (Evento e : eventos) {
            List<Usuario> usuarios = new ArrayList<>();
            for (Usuario u : usuarioRepository.inscriptosEvento(e.getId())) {
                usuarios.add(u);
            }
            usuariosMapeados.put(e, usuarios);
        }
        return usuariosMapeados;
    }

    public void enviarMailInscripcion(Evento evento, Usuario usuario) {
        Email email = new Email();
        email.setAsunto("Inscripcion a evento");

        String mensaje = "Hola " + usuario.getNombreReal() + ". Se registro tu inscripcion al evento "
                + evento.getNombre();

        try {
            email.setMensaje(mensaje);
            email.setDestinatario(usuario.getCorreoElectronico());
            enviarMailGenerico(email);
        } catch (
        Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }
}
