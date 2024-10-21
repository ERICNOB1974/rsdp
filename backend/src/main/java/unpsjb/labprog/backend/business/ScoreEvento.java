package unpsjb.labprog.backend.business;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Evento;

@Getter
@Setter
@NoArgsConstructor
public class ScoreEvento {
    private Evento evento;
    private Double score;

    public ScoreEvento(Evento evento, Double score) {
        this.evento = evento;
        this.score = score;
    }
}