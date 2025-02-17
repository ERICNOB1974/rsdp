package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Node("Dia")
@Getter
@Setter
@NoArgsConstructor
public class Dia {

    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private String descripcion;
    private String tipo; // 'trabajo' o 'descanso'

}
