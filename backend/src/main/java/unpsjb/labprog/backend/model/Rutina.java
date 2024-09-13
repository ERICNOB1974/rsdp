package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Data
@Getter
@Setter
@Node("Rutina")
@NoArgsConstructor
public class Rutina {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private String descripcion;
    private int duracionMinutosPorDia;
    private Dificultad dificultad;

    @Relationship(type = "TIENE")
    private List<Ejercicio> ejercicios;

    @Relationship(type = "ETIQUETADA_CON")
    private List<Etiqueta> etiquetas;

}