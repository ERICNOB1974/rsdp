package unpsjb.labprog.backend.business;

import java.time.LocalDate;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ScoreAmigo {
        @Id  // Añadir la anotación @Id para indicar que este es el campo identificador
    @GeneratedValue // Puedes agregar esta anotación si quieres que se genere automáticamente
    private Long id;  // Este campo debe estar presente
    
    Long usuarioId;
    String nombreUsuario;
    String nombreReal;
    LocalDate fechaNacimiento;
    LocalDate fechaDeCreacion;
    String correoElectronico;
    String contrasena;
    String descripcion;
    double latitud;
    double longitud;
    int score;

    public ScoreAmigo(Long usuarioId, String nombreUsuario, String nombreReal, LocalDate fechaNacimiento, LocalDate fechaDeCreacion,
    String correoElectronico, String contrasena,String descripcion, double latitud, double longitud, int score) {
        this.usuarioId = usuarioId;
        this.nombreUsuario = nombreUsuario;
        this.nombreReal = nombreReal;
        this.fechaNacimiento = fechaNacimiento;
        this.fechaDeCreacion = fechaDeCreacion;
        this.correoElectronico = correoElectronico;
        this.contrasena = contrasena;
        this.descripcion = descripcion;
        this.latitud = latitud;
        this.longitud = longitud;
        this.score = score;
    }
}