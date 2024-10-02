package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

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
            Map<Evento, List<Usuario>> usuarios = usuariosNotificables();
            for (Map.Entry<Evento, List<Usuario>> entry : usuarios.entrySet()) {
                Evento evento = entry.getKey();
                List<Usuario> listaUsuarios = entry.getValue();

                // Iterar sobre la lista de usuarios
                for (Usuario usuario : listaUsuarios) {
                    MimeMessage mensaje = javaMailSender.createMimeMessage();
                    MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");

                    // Configurar asunto y contexto
                    helper.setSubject(email.getAsunto());
                    Context context = new Context();

                    // Configurar mensaje del correo
                    String msj = "Hola " + usuario.getNombreReal() + ". \n Te recordamos que mañana a las "
                            + evento.getFechaHora().getHour() + ":" + evento.getFechaHora().getMinute() +
                            " será el evento "
                            + ".\n Descripción: "
                            + evento.getDescripcion();

                    // Configurar destinatario y mensaje
                    email.setMensaje(msj);
                    helper.setTo(usuario.getCorreoElectronico());

                    // Añadir el mensaje al contexto para el template HTML
                    context.setVariable("mensaje", msj);
                    String contentHtml = templateEngine.process("email", context); // 'email' es el nombre del archivo
                                                                                   // HTML
                    helper.setText(contentHtml, true); // El true indica que es un contenido HTML

                    // Enviar el correo
                    javaMailSender.send(mensaje);
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }

    public void enviarMailCambio(Email email) throws MessagingException {
    }

    private Map<Evento, List<Usuario>> usuariosNotificables() {
        List<Evento> eventos = eventoRepository.eventosProximos();
        Map<Evento, List<Usuario>> usuariosMapeados = new HashMap<>();
        for (Evento e : eventos) {
            List<Usuario> usuarios = new ArrayList<>();
            for (Usuario u : usuarioRepository.inscriptosEvento(e.getId())) {
                // usuarios.addAll(usuariosMapeados.get(e));
                usuarios.add(u);
                usuariosMapeados.put(e, usuarios);
            }
        }
        return usuariosMapeados;
    }
}
