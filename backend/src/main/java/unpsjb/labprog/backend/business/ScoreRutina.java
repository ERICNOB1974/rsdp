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
    private String motivo;

    public ScoreRutina(Rutina rutina, Double score, String motivo) {
        this.rutina = rutina;
        this.score = score;
        this.motivo = motivo;
    }
}