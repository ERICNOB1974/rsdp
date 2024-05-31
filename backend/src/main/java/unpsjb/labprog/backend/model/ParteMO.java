package unpsjb.labprog.backend.model;

import java.time.LocalTime;
import java.util.Collection;
import java.util.Date;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ParteMO {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private Date fecha;

    private LocalTime horaDesde;

    private LocalTime horaHasta;

    private float horas;

    @ManyToOne
    private Operario operario;

    @ManyToOne
    private Proyecto proyecto;

    @ManyToOne
    private Tarea tarea;

    @ManyToOne
    private Estado estado;

    @OneToMany
    @OrderBy("tiempoCreacion DESC")
    private Collection<LogValidacionParteMO> logsValidacion;

}