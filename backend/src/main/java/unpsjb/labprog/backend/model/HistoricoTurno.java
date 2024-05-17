/*package unpsjb.labprog.backend.model;

import java.time.LocalTime;
import java.util.Date;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class HistoricoTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private Date fechaTurnoDesde;

    private Date fechaTurnoHasta;

    @ManyToOne
    @JoinColumn(name = "turno_id")
    private Turno turno;

    @ManyToOne
    @JoinColumn(name = "operario_id")
    private Operario operario;
}*/