package unpsjb.labprog.backend.business;

import java.time.ZonedDateTime;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import unpsjb.labprog.backend.model.Usuario;

@Getter
@Setter
@NoArgsConstructor
public class Comentario {

    @Id
    @GeneratedValue
    private Long id;

    private String texto;

    private ZonedDateTime fecha;

    private Usuario usuario;

}
