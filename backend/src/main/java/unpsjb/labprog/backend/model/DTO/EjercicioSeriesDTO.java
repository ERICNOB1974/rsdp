package unpsjb.labprog.backend.model.DTO;

import lombok.Getter;
import lombok.Setter;
import unpsjb.labprog.backend.model.Ejercicio;

@Getter
@Setter
public class EjercicioSeriesDTO {
    private Ejercicio ejercicio;   
    private int orden;  
    private int series;
    private int repeticiones;
}
