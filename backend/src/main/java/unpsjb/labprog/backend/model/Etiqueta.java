package unpsjb.labprog.backend.model;

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

}
