package unpsjb.labprog.backend.model.DTO;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Publicacion;
import unpsjb.labprog.backend.model.Usuario;

@Getter
@Setter
public class PublicacionesDTO {
    public Publicacion publicacion;
    public Usuario creador;
    public Long likes;
    public boolean estaLikeada;
    public Comunidad comunidad;
}
