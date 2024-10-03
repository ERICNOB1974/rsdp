package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EmailService;
import unpsjb.labprog.backend.business.UsuarioService;

@RestController
@RequestMapping("email")
public class EmailPresenter {
    @Autowired
    EmailService emailService;
    @Autowired
    UsuarioService usuarioService;

    @PostMapping("/enviar")
    public ResponseEntity<Object> sendEmail() throws MessagingException {
        emailService.enviarMail();
        return Response.ok("Correo enviado exitosamente");
    }

}
