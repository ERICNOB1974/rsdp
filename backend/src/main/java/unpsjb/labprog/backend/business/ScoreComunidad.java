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
public class ScoreComunidad {
        @Id  // Añadir la anotación @Id para indicar que este es el campo identificador
    @GeneratedValue // Puedes agregar esta anotación si quieres que se genere automáticamente
    private Long id;  // Este campo debe estar presente
    
    private int comunidadId;
    private String nombre;
    private LocalDate fechaDeCreacion;
    private String descripcion;
    private int cantidadMaximaMiembros;
    private boolean esPrivada;
    private double latitud;
    private double longitud;
    private double score;

    public ScoreComunidad(int comunidadId, String nombre, LocalDate fechaDeCreacion,
            String descripcion, int cantidadMaximaMiembros,
            boolean esPrivada, double latitud,
            double longitud, double score) {
        this.comunidadId = comunidadId;
        this.nombre = nombre;
        this.fechaDeCreacion = fechaDeCreacion;
        this.descripcion = descripcion;
        this.cantidadMaximaMiembros = cantidadMaximaMiembros;
        this.esPrivada = esPrivada;
        this.latitud = latitud;
        this.longitud = longitud;
        this.score = score;
    }
}
