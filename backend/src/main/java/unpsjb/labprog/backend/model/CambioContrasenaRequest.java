package unpsjb.labprog.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CambioContrasenaRequest {
    private String correoElectronico;
    private String contrasenaNueva;
}
