package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.data.neo4j.core.schema.GeneratedValue;
import org.springframework.data.neo4j.core.schema.Id;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class Notificacion implements Comparable<Notificacion>{
    @Id // Añadir la anotación @Id para indicar que este es el campo identificador
    @GeneratedValue // Puedes agregar esta anotación si quieres que se genere automáticamente
    private Long id; // Este campo debe estar presente
    String tipo;
    String mensaje;
    LocalDateTime fecha;
    Long entidadId;

    // Constructor
    public Notificacion(String tipo, String mensaje, LocalDateTime fecha, long entidadId) {
        this.tipo = tipo;
        this.mensaje = mensaje;
        this.fecha = fecha;
        this.entidadId = entidadId;    
    }

    @Override
    public int compareTo(Notificacion o) {
        return this.fecha.compareTo(o.fecha); // Ordenar de forma ascendente
    }
}