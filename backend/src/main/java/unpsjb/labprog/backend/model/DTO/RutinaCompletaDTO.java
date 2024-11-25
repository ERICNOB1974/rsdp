package unpsjb.labprog.backend.model.DTO;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RutinaCompletaDTO {
    private String nombre;
    private String descripcion;
    private List<EtiquetaDTO> etiquetas;
    private List<GuardarRutinaDiaDTO> dias;
}