package unpsjb.labprog.backend.model;

import java.time.LocalDate;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import org.springframework.data.neo4j.core.schema.TargetNode;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@RelationshipProperties
public class InscriptoEnEvento {
    
    @Id
    @GeneratedValue
    private Long id;

    @TargetNode
    private Usuario usuario;

    private LocalDate fechaDeInscripcion;

}
