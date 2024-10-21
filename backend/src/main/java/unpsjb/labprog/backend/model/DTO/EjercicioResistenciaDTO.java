package unpsjb.labprog.backend.model.DTO;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Ejercicio;

@Getter
@Setter
public class EjercicioResistenciaDTO {
    private Ejercicio ejercicio;
    private int orden;
    private String tiempo;
}
