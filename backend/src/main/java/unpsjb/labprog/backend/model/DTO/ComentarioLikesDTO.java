package unpsjb.labprog.backend.model.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Comentario;

@Getter
@Setter
@AllArgsConstructor
public class ComentarioLikesDTO {
    public Comentario comentario;
    public Long cantidadLikes;
    public boolean estaLikeado;
}
