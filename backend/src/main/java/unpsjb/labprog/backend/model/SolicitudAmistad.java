package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.TargetNode;
import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.RelationshipProperties;
import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@RelationshipProperties
public class SolicitudAmistad {

    @Id
    @GeneratedValue
    private Long id;

    private EstadoSolicitud estado; // pendiente, aceptada, rechazada
    private LocalDateTime fechaEnvio;

    @TargetNode
    private Usuario receptor;


}