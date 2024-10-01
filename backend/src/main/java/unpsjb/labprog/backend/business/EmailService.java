package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
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

    public void enviarMail(Email email) throws MessagingException {
        try {
            MimeMessage mensaje = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setSubject(email.getAsunto());
            Context context = new Context();
            List<Usuario> usuarios = usuariosNotificables();
            for (Usuario u : usuarios) {
                // email.setDestinatario(u.getCorreoElectronico());
                email.setMensaje("Hola " + u.getNombreReal() + ". \n Te recordamos que mañana sera el evento ");
                helper.setTo(u.getCorreoElectronico());
            }
            context.setVariable("mensaje", email.getMensaje());
            String contentHtml = templateEngine.process("email", context); // template es nombre del html
            helper.setText(contentHtml, true);
            javaMailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    public List<Usuario> usuariosNotificables() {
        List<Evento> eventos = eventoRepository.eventosProximos();
        List<Usuario> usuarios = new ArrayList<>();
        for (Evento e : eventos) {
            usuarios.addAll(usuarioRepository.inscriptosEvento(e.getId()));
        }
        return usuarios;
    }
}
