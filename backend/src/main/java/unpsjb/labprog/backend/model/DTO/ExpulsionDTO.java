package unpsjb.labprog.backend.model.DTO;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;


@Getter
@Setter
@NoArgsConstructor

public class ExpulsionDTO {

    public String motivoExpulsion;
    public String tipo;
    public LocalDateTime fechaHoraExpulsion;
    public boolean estaExpulsado;
}
