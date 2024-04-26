/*package unpsjb.labprog.backend.model;

import java.sql.Time;
import java.util.Date;

import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class PartesMO {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(name = "fecha_turno_desde")
    private Date fechaTurnoDesde;
    
    @Column(name = "hora_desde")
    private Time horaDesde;

    @Column(name = "hora_hasta")
    private Time horaHasta;

    private Float horas;

    private String turno;

    @Column(name = "operario_legajo")
    @ManyToOne
    private Operario operario;

}
*/