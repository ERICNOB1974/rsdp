package unpsjb.labprog.backend.model;

import java.util.List;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Node("Etiqueta")
@NoArgsConstructor
public class Etiqueta {
    
    @Id
    @GeneratedValue
    private Long id;

    private String nombre;

    @Relationship(type = "ETIQUETADO_CON")
    private List<Comunidad> comunidades;

    @Relationship(type = "ASOCIADA_CON")
    private List<Rutina> rutinas;

    @Relationship(type = "RELACIONADO_A")
    private List<Evento> eventos;

}
