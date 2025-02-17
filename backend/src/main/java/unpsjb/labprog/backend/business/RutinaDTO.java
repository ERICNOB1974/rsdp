package unpsjb.labprog.backend.business;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RutinaDTO {

    private Long id;
    private String nombre;
    private String descripcion;
    private List<DiaDTO> dias;
    private boolean hizoUltimoDiaHoy;

    public RutinaDTO(String nombre, String descripcion, List<DiaDTO> dias) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.dias = dias;
    }

}
