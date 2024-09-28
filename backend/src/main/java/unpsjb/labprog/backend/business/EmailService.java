package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import unpsjb.labprog.backend.model.Email;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private TemplateEngine templateEngine;

    public void enviarMail(Email email) throws MessagingException {
        try {

            MimeMessage mensaje = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mensaje, true, "UTF-8");
            helper.setTo(email.getDestinatario());
            helper.setSubject(email.getAsunto());
            // helper.setText("Holis");
            // helper.setText("email.getMensaje()");
            Context context = new Context();

            context.setVariable("mensaje", email.getMensaje());
            String contentHtml = templateEngine.process("email", context); // template es nombre del html
            helper.setText(contentHtml, true);
            javaMailSender.send(mensaje);
        } catch (Exception e) {
            throw new RuntimeException("Error al enviar el correo: " + e.getMessage());
        }
    }
}
