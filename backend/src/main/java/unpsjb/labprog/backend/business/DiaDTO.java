package unpsjb.labprog.backend.business;

import java.util.List;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DiaDTO {
    private Long id;
    private String nombre;
    private String descripcion;
    private int orden;
    private List<EjercicioRepeticionesDTO> ejerciciosRepeticiones; // Lista de ejercicios de repeticiones
    private List<EjercicioTiempoDTO> ejerciciosTiempo; // Lista de ejercicios de tiempo

    public DiaDTO(String nombre, String descripcion, int orden, List<EjercicioRepeticionesDTO> ejerciciosRepeticiones, List<EjercicioTiempoDTO> ejerciciosTiempo) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.orden = orden;
        this.ejerciciosRepeticiones = ejerciciosRepeticiones;
        this.ejerciciosTiempo = ejerciciosTiempo;
    }
}
