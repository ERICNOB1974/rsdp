package unpsjb.labprog.backend.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
    private TipoTurno tipoTurno;

}