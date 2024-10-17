package unpsjb.labprog.backend.model;

import java.time.ZonedDateTime;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;
import org.springframework.data.neo4j.core.schema.Node;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@Node("Publicacion")
@NoArgsConstructor
public class Publicacion {

    @Id
    @GeneratedValue
    private Long id;

    private String texto;

    private ZonedDateTime fechaDeCreacion;
    
    private String file;

}
