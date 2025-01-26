package unpsjb.labprog.backend.model.DTO;

import unpsjb.labprog.backend.model.Usuario;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UsuarioEsAmigoDTO{
    private Usuario usuario;
    private boolean esAmigo;

}
