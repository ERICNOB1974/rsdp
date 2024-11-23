package unpsjb.labprog.backend.presenter;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
import unpsjb.labprog.backend.model.VerificacionRequest;
import unpsjb.labprog.backend.model.DTO.EnvioNotificacionRequest;

@RestController
@RequestMapping("email")
public class EmailPresenter {

    Map<String, String> verificationCodes = new HashMap<>();

    @Autowired
    EmailService emailService;

    @Autowired
    UsuarioService usuarioService;

    @GetMapping("/enviar")
    public ResponseEntity<Object> sendEmail() throws MessagingException {
        emailService.recordatorioEvento();
        return Response.ok("Correo enviado exitosamente");
    }

    @PostMapping("/enviar-codigo")
    public ResponseEntity<Object> enviarCodigoVerificacion(@RequestBody String email) {
        String codigo = generarCodigo();
        verificationCodes.put(email, codigo);

        Email emailObj = new Email();
        emailObj.setDestinatario(email);
        emailObj.setAsunto("Código de verificación");
        emailObj.setMensaje("Su código de verificación es: " + codigo);

        emailService.enviarMailGenerico(emailObj);
        return Response.ok("Código enviado al correo: " + email);
    }

    @PostMapping("/verificar-codigo")
    public ResponseEntity<Object> verificarCodigo(@RequestBody VerificacionRequest request) {
        String email = request.getEmail();
        String codigoIngresado = request.getCodigoIngresado();
    
        String codigoCorrecto = verificationCodes.get(email);
        if (codigoCorrecto != null && codigoCorrecto.equals(codigoIngresado)) {
            verificationCodes.remove(email);
            return Response.ok("Correo verificado exitosamente.");
        } else {
            return Response.error(null, "El código es incorrecto o expiró.");
        }
    }

    private String generarCodigo() {
        return String.format("%06d", (int) (Math.random() * 1_000_000)); // Código de 6 dígitos
    }

    @GetMapping("/invitacionEvento/{idUsuarioEmisor}/{idUsuarioReceptor}/{idEvento}")
    public ResponseEntity<Object> invitacionEvento(@PathVariable Long idUsuarioEmisor, @PathVariable Long idUsuarioReceptor, @PathVariable Long idEvento) throws MessagingException {
        emailService.invitacionEvento(idUsuarioEmisor,idUsuarioReceptor,idEvento);
        return Response.ok("Correo enviado exitosamente");
    }

    @GetMapping("/invitacionComunidad/{idUsuarioEmisor}/{idUsuarioReceptor}/{idComunidad}")
    public ResponseEntity<Object> invitacionComunidad(@PathVariable Long idUsuarioEmisor, @PathVariable Long idUsuarioReceptor, @PathVariable Long idComunidad) throws MessagingException {
        emailService.invitacionComunidad(idUsuarioEmisor,idUsuarioReceptor,idComunidad);
        return Response.ok("Correo enviado exitosamente");
    }

    @PostMapping("/enviar-notificacion")
    public ResponseEntity<Object> enviarNotificacionEvento(@RequestBody EnvioNotificacionRequest request) throws MessagingException {
        String mensaje = request.getMensaje();
        String asunto = request.getAsunto();
        String nombreUsuario = request.getNombreUsuario();
        String nombreActividad = request.getNombreActividad();
        List<Usuario> usuarios = request.getUsuarios();

        // Crear el objeto email
        Email email = new Email();
        email.setAsunto(asunto);
        email.setMensaje(mensaje);

        // Llamar al método del service para enviar los correos a todos los usuarios
        emailService.enviarMailNotificacionEvento(email, nombreUsuario, usuarios, nombreActividad);

        return Response.ok("Correos enviados exitosamente.");
    }

}
