package unpsjb.labprog.backend.business;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EjercicioRepeticionesDTO {
    private String nombre;
    private String descripcion;
    private int orden;
    private int repeticiones;
    private int series;
    private String imagen;

    public EjercicioRepeticionesDTO(String nombre, String descripcion, int orden, int repeticiones, int series, String imagen) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.orden = orden;
        this.repeticiones = repeticiones;
        this.series = series;
        this.imagen = imagen;
    }
}