package unpsjb.labprog.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.neo4j.core.schema.CompositeProperty;

@Data
@NoArgsConstructor
public class Coordenadas {

    @CompositeProperty
    private double latitud;
    @CompositeProperty
    private double longitud;

    public Coordenadas(double latitud, double longitud) {
        this.latitud = latitud;
        this.longitud = longitud;
    }
}
