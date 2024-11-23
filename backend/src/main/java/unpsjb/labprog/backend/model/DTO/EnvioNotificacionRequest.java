package unpsjb.labprog.backend.model.DTO;

import java.util.List;

import unpsjb.labprog.backend.model.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EnvioNotificacionRequest {
    private List<Usuario> usuarios;
    private String mensaje;
    private String asunto;
    private String nombreActividad;
    private String nombreUsuario;
}