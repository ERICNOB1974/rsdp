package unpsjb.labprog.backend.model;

import lombok.Setter;
import lombok.Getter;

@Getter
@Setter
public class VerificacionRequest {
    
    private String email;
    private String codigoIngresado;

}
