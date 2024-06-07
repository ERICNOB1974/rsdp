package unpsjb.labprog.backend.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
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
public class Operario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(unique = true)
    private int legajo;
    
    private String nombre;

    private String categoria;

    @OrderBy("fechaTurnoDesde DESC, fechaTurnoHasta DESC")
    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoricoTurno> historicoTurnos;


}
