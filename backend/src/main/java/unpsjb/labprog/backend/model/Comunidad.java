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
@Node("Comunidad")
@NoArgsConstructor
public class Comunidad {
    
    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private LocalDate fechaDeCreacion;
    private String descripcion;
    private int cantidadMaximaMiembros;
    private boolean esPrivada;
    private double latitud;
    private double longitud;
    private String imagen;
    
    private String ubicacion;
    
}
