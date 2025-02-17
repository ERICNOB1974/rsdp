package unpsjb.labprog.backend.business;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class EjercicioTiempoDTO {
    private String nombre;
    private String descripcion;
    private int orden;
    private String tiempo; // Solo tiene tiempo
    private String imagen;

    public EjercicioTiempoDTO(String nombre, String descripcion, int orden, String tiempo,String imagen) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.orden = orden;
        this.tiempo = tiempo;
        this.imagen = imagen;
    }
}