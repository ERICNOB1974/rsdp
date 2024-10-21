package unpsjb.labprog.backend.business;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Usuario;

@Getter
@Setter
@NoArgsConstructor
public class ScoreAmigo {
    private Usuario usuario;
    private Double score;

    public ScoreAmigo(Usuario usuario, Double score) {
        this.usuario = usuario;
        this.score = score;
    }
}