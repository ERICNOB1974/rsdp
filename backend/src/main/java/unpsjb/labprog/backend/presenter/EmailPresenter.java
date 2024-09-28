package unpsjb.labprog.backend.presenter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EmailService;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.model.Email;
import unpsjb.labprog.backend.model.Usuario;

@RestController
@RequestMapping("email")
public class EmailPresenter {
    @Autowired
    EmailService emailService;
    @Autowired
    UsuarioService usuarioService;

    @PostMapping("/enviar")
    public ResponseEntity<Object> sendEmail(@RequestBody Email email) throws MessagingException {
        emailService.enviarMail(email);
        return Response.ok("Correo enviado exitosamente");
    }

    @PostMapping("/enviarUsuario/{nombreUsuario}")
    public ResponseEntity<Object> enviarAUsuario(@PathVariable String nombreUsuario) throws MessagingException {
        Email email = new Email();
        Usuario u = usuarioService.findByNombreUsuario(nombreUsuario);
        // email.setDestinatario("facuespaniol@gmail.com");
        email.setDestinatario(u.getCorreoElectronico());
        email.setMensaje("hola "+ u.getNombreReal() + " te queremos recordar sobre  un evento");
        email.setAsunto("Probando!");
        emailService.enviarMail(email);
        return Response.ok("Correo enviado exitosamente");
    }

}
