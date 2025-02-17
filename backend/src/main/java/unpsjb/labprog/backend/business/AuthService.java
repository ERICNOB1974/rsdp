package unpsjb.labprog.backend.business;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.CambioContrasenaRequest;
import unpsjb.labprog.backend.model.Usuario;
import unpsjb.labprog.backend.config.JwtUtils;

import java.time.LocalDate;
import java.util.Optional;

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
        Optional<Usuario> userOpt;
    
        // Verifica si es un correo electrónico usando una expresión regular simple
        if (usuario.getCorreoElectronico().matches("^[\\w-.]+@([\\w-]+\\.)+[\\w-]{2,4}$")) {
            // Si es un correo electrónico, busca por correo
            userOpt = userRepository.findByCorreoElectronico(usuario.getCorreoElectronico());
        } else {
            // Si no, busca por nombre de usuario
            userOpt = userRepository.findByNombreUsuario(usuario.getCorreoElectronico());
        }
    
        Usuario user = userOpt.orElseThrow(() -> new Exception("Usuario no encontrado"));
    
        // Compara la contraseña ingresada con la encriptada en la base de datos
        if (passwordEncoder.matches(usuario.getContrasena(), user.getContrasena())) {
            // Si coincide, generar y devolver el token JWT
            return "Bearer " + jwtUtils.generateJwtToken(user);
        } else {
            // Si no coincide, lanzar excepción
            throw new Exception("Contraseña incorrecta.");
        }
    }
    
    public boolean verificarContrasena(String correoElectronico, String contrasena) throws Exception {
        // Buscar el usuario por correo electrónico
        Usuario usuario = userRepository.findByCorreoElectronico(correoElectronico)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));
    
        // Verificar si la contraseña coincide
        return passwordEncoder.matches(contrasena, usuario.getContrasena());
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
