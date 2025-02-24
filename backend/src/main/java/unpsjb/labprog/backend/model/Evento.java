package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.ZonedDateTime;

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

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSXXX")
    private ZonedDateTime fechaHora;

    private double latitud;
    private double longitud;

    private String genero;
    private String descripcion;
    private boolean eliminado;
    private int cantidadMaximaParticipantes;
    private boolean esPrivadoParaLaComunidad;

    private String imagen;

    private String ubicacion;

}
