/*package unpsjb.labprog.backend.model;

import java.time.LocalTime;
import java.util.Collection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Turno {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;
    
    private String nombre;

    private LocalTime horaDesde;

    private LocalTime horaHasta;

    @OneToMany(mappedBy = "turno")
    private Collection<HistoricoTurno> operarios;
}*/