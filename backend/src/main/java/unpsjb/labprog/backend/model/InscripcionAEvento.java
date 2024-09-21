package unpsjb.labprog.backend.model;

import java.util.*;

import org.springframework.data.annotation.Id;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@RelationshipProperties
@Data
@Getter
@Setter
@NoArgsConstructor
public class InscripcionAEvento {

    @Id
    @GeneratedValue
    private Long id;

    @TargetNode
    private Evento evento;
    private Date fechaInscripcion;
}
