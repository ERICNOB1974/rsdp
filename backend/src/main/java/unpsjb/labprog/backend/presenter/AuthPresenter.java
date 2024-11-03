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

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.AuthService;
import unpsjb.labprog.backend.model.CambioContrasenaRequest;
import unpsjb.labprog.backend.model.Usuario;

@RestController
@RequestMapping("/autenticacion")
public class AuthPresenter {

    Map<String, String> verificationCodes = new HashMap<>();

    @Autowired
    private AuthService authService;

    // Registro de usuario
    @PostMapping("/registro")
    public ResponseEntity<Object> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            authService.registerUser(usuario);
            return Response.ok("Usuario registrado correctamente. Revisa tu correo para verificar tu cuenta.");
        } catch (Exception e) {
            return Response.error(null, "Error durante el registro: " + e.getMessage());
        }
    }

    // Inicio de sesión
    @PostMapping("/login")
    public ResponseEntity<Object> login(@RequestBody Usuario usuario) {
        try {
            String token = authService.loginUser(usuario);
            return Response.ok(token);
        } catch (Exception e) {
            return Response.error(null, "Error de inicio de sesión: " + e.getMessage());
        }
    }

    @PostMapping("/verificar-contrasena")
    public ResponseEntity<Object> verificarContrasena(@RequestBody Map<String, String> request) {
        try {
            String correoElectronico = request.get("correoElectronico");
            String contrasena = request.get("contrasena");

            boolean esValida = authService.verificarContrasena(correoElectronico, contrasena);

            if (esValida) {
                return Response.ok("Contraseña válida");
            } else {
                return Response.error(null, "Contraseña incorrecta");
            }
        } catch (Exception e) {
            return Response.error(null, "Error al verificar la contraseña: " + e.getMessage());
        }
    }

    @PostMapping("/recuperar")
    public ResponseEntity<Object> recuperarContraseña(@RequestBody String correo) {
        try {
            String token = authService.generarTokenRecuperacion(correo);
            authService.enviarEmailRecuperacion(correo, token);
            return Response.ok("Correo de recuperación enviado.");
        } catch (Exception e) {
            return Response.error(null, "Error durante la recuperación de contraseña: " + e.getMessage());
        }
    }

    @PostMapping("/cambiar-contrasena")
    public ResponseEntity<Object> cambiarContrasena(@RequestBody CambioContrasenaRequest request) {
        try {
            authService.cambiarContrasena(request);
            return Response.ok("Contraseña cambiada correctamente.");
        } catch (Exception e) {
            return Response.error(null, "Error al cambiar la contraseña: " + e.getMessage());
        }
    }

    // Endpoint protegido (requiere autenticación)
    @GetMapping("/protegido")
    public ResponseEntity<Object> endpointProtegido() {
        return Response.ok("Acceso permitido. Usuario autenticado.");
    }

}
