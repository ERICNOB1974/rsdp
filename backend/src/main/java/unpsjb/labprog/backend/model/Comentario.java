package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;
import org.springframework.data.neo4j.core.schema.Relationship;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Node("Comentario")
@NoArgsConstructor
public class Comentario {

    @Id
    @GeneratedValue
    private Long id;

    private String descripcionComentario;

    @Relationship(type = "COMENTADO_POR")
    private Usuario usuario;

}
