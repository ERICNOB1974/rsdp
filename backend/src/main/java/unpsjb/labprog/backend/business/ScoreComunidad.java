package unpsjb.labprog.backend.business;

import java.time.LocalDate;

import org.springframework.data.neo4j.core.schema.Id;

import lombok.Data;
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
