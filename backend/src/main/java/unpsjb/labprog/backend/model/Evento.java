package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;
import java.time.ZonedDateTime;

import jakarta.annotation.Nullable;

@Data
@Getter
@Setter
@Node("Evento")
@NoArgsConstructor
public class Evento {
    
    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private LocalDate fechaDeCreacion;
    private ZonedDateTime fechaHora; 
    private Coordenadas ubicacion;
    private String descripcion;
    private int cantidadMaximaParticipantes;
    private boolean esPrivadoParaLaComunidad;

    @Relationship(type = "CREADO_POR" )
    private Usuario creador;

    @Relationship(type = "PARTICIPA_EN")
    private List<InscriptoEnEvento> participantes;

    @Relationship(type = "ETIQUETADO_CON")
    private List<Etiqueta> etiquetas;

    @Nullable
    @Relationship(type = "ORGANIZADO_POR")
    private Comunidad organiza;


}
