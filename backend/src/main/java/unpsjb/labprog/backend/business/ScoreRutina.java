package unpsjb.labprog.backend.business;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Rutina;

@Getter
@Setter
@NoArgsConstructor
public class ScoreRutina {
    private Rutina rutina;
    private Double score;

    public ScoreRutina(Rutina rutina, Double score) {
        this.rutina = rutina;
        this.score = score;
    }
}