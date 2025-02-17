package unpsjb.labprog.backend.model.DTO;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GuardarRutinaDiaDTO {
    private String nombre;
    private String descripcion;
    private int orden;
    private List<EjercicioDTO> ejercicios;
}