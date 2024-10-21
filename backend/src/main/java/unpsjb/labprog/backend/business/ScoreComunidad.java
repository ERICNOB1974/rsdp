package unpsjb.labprog.backend.business;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Comunidad;

@Getter
@Setter
@NoArgsConstructor
public class ScoreComunidad {
    private Comunidad comunidad;
    private Double score;

    public ScoreComunidad(Comunidad comunidad, Double score) {
        this.comunidad = comunidad;
        this.score = score;
    }
}