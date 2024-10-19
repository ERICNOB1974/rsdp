package unpsjb.labprog.backend.business;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.CambioContrasenaRequest;
import unpsjb.labprog.backend.model.Usuario;
import unpsjb.labprog.backend.config.JwtUtils;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

@Service
public class AuthService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsuarioRepository userRepository;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private JavaMailSender javaMailSender;

    public void registerUser(Usuario usuario) {
        usuario.setContrasena(passwordEncoder.encode(usuario.getContrasena()));
        usuario.setFechaDeCreacion(LocalDate.now());
        userRepository.save(usuario);
    }

    public String loginUser(Usuario usuario) throws Exception {
        // Buscar el usuario por correo electrónico
        Usuario user = userRepository.findByCorreoElectronico(usuario.getCorreoElectronico())
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        // Comparar la contraseña ingresada (texto plano) con la encriptada en la base
        // de datos
        if (passwordEncoder.matches(usuario.getContrasena(), user.getContrasena())) {
            // Si coincide, generar y devolver el token JWT
            return "Bearer " + jwtUtils.generateJwtToken(user);
        } else {
            // Si no coincide, lanzar excepción
            throw new Exception("Contraseña incorrecta.");
        }
    }

    public void cambiarContrasena(CambioContrasenaRequest request) throws Exception {

        Usuario usuario = userRepository.findByCorreoElectronico(request.getCorreoElectronico())
                .orElseThrow(() -> new Exception("Usuario no encontrado"));

        usuario.setContrasena(passwordEncoder.encode(request.getContrasenaNueva()));
        userRepository.save(usuario);
    }

    public String generarTokenRecuperacion(String correo) throws Exception {
        Usuario usuario = userRepository.findByCorreoElectronico(correo)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));
        return jwtUtils.generateJwtToken(usuario);
    }

    public void enviarEmailRecuperacion(String correo, String token) {
        SimpleMailMessage mensaje = new SimpleMailMessage();
        mensaje.setTo(correo);
        mensaje.setSubject("Recuperación de contraseña");
        mensaje.setText("Usa este enlace para cambiar tu contraseña: http://localhost:4200/recuperar?token=" + token);
        javaMailSender.send(mensaje);
    }

    public String generarTokenRecuperacion(Usuario usuario) {
        return jwtUtils.generateJwtToken(usuario);
    }

}
