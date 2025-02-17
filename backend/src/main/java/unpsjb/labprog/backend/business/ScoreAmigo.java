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
    private String motivo;

    public ScoreAmigo(Usuario usuario, Double score, String motivo) {
        this.usuario = usuario;
        this.score = score;
        this.motivo = motivo;
    }
}