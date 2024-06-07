package unpsjb.labprog.backend.model;

import java.util.Date;
import java.util.List;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class TipoTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    private String tipo;

    private String nombre;

    private int diasTrabajo;

    private int diasFranco;

    private Date fechaArranque;
    
    @OrderBy("orden ASC")
    @OneToMany
    private List<Horario> horarios;

}