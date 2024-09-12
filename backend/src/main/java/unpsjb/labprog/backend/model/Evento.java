package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
@Node("Evento")
@NoArgsConstructor
public class Evento {
    
    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private LocalDate fechaDeCreacion;
    private LocalDate fechaHora; 
    private String ubicacion;
    private String descripcion;
    private int cantidadMaximaParticipantes;

    @Relationship(type = "CREADO_POR")
    private Usuario creador;

    @Relationship(type = "PARTICIPA")
    private List<InscriptoEnEvento> participantes;

    @Relationship(type = "ETIQUETADO_CON")
    private List<Etiqueta> etiquetas;

}
