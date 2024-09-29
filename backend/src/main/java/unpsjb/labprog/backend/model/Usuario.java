package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Data
@Getter
@Setter
@Node("Usuario")
@NoArgsConstructor
public class Usuario {

    @Id
    @GeneratedValue
    private Long id;

    private String nombreUsuario;   
    private String nombreReal;
    private LocalDate fechaNacimiento;
    private LocalDate fechaDeCreacion;
    private String correoElectronico;
    private String contrasena;
    private String descripcion;
}
