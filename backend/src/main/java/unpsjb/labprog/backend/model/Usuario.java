package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
import java.util.List;

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
    private Date fechaNacimiento;
    private Date fechaDeCreacion;
    private String correoElectronico;
    private String contrasena;
    private String descripcion;

    @Relationship(type = "POSTEO")
    private List<Publicacion> publicaciones;    

    @Relationship(type = "PERTENECE_A")
    private List<Comunidad> comunidades;

    @Relationship(type = "PARTICIPA_EN")
    private List<InscripcionAEvento> inscripciones;

    @Relationship(type = "REALIZA")
    private List<Rutina> rutinas;

    @Relationship(type = "AMIGO_DE")
    private List<Usuario> amigos;
    
}
