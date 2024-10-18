package unpsjb.labprog.backend.config;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import jakarta.servlet.http.HttpServletRequest;
import unpsjb.labprog.backend.model.Usuario;

import java.util.Date;

import org.springframework.stereotype.Component;
@Component
public class JwtUtils {

    private final String SECRET_KEY = "RSDP";
    private final long EXPIRATION_TIME = 86400000; // 24 horas

    public String generateJwtToken(Usuario user) {
        return Jwts.builder()
                .setSubject(user.getCorreoElectronico()) // Email como subject
                .claim("id", user.getId()) // Agregar ID
                .claim("nombreUsuario", user.getNombreUsuario()) // Agregar nombre de usuario
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }
    
    public String obtenerCorreoDesdeToken(String token) {
        return Jwts.parser().setSigningKey(SECRET_KEY)
                .parseClaimsJws(token).getBody().getSubject();
    }    

    public String obtenerClaim(String token, String claimName) {
        return Jwts.parser()
                .setSigningKey(SECRET_KEY)
                .parseClaimsJws(token)
                .getBody()
                .get(claimName, String.class);
    }

    public boolean validarJwtToken(String token) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getTokenFromRequest(HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");
    if (headerAuth != null && headerAuth.startsWith("Bearer ")) {
        return headerAuth.substring(7); // Quita el prefijo "Bearer "
    }
    return null;
}


}
