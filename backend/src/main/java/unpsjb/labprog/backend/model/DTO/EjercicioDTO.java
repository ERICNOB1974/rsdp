package unpsjb.labprog.backend.model.DTO;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EjercicioDTO {
    private String nombre;
    private String descripcion;
    private String imagen;
    private String tipo; // resistencia o series
    private int orden;
    private String tiempo; // Para resistencia
    private Integer series; // Para series
    private Integer repeticiones; // Para series
}
