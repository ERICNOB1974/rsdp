package unpsjb.labprog.backend.presenter;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.mail.MessagingException;
import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.EmailService;
import unpsjb.labprog.backend.business.UsuarioService;
import unpsjb.labprog.backend.model.Email;
import unpsjb.labprog.backend.model.VerificacionRequest;

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

}
