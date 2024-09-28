package unpsjb.labprog.backend.model;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Email {
    private String destinatario;
    private String asunto;
    private String mensaje;

}
