package unpsjb.labprog.backend.config;

import java.io.IOException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.Collections;

public class JWTAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;

    public JWTAuthenticationFilter(JwtUtils jwtUtils) {
        this.jwtUtils = jwtUtils;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String token = jwtUtils.getTokenFromRequest(request);

        if (token != null && jwtUtils.validarJwtToken(token)) {
            String correo = jwtUtils.obtenerCorreoDesdeToken(token);
            String nombreUsuario = jwtUtils.obtenerClaim(token, "nombreUsuario");
        
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(correo, null, 
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));
        
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("Autenticación exitosa para: " + nombreUsuario);
        } else {
            System.out.println("Token inválido o ausente");
        }
        

        filterChain.doFilter(request, response);
    }

}
