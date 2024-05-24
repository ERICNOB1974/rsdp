/*package unpsjb.labprog.backend.model;

import java.time.LocalTime;
import java.util.Collection;
import java.util.Date;
import jakarta.persistence.Column;
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
public class Operario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(unique = true)
    private int legajo;
    
    private String nombre;

    private String categoria;

    @OneToMany
    private Collection<HistoricoTurno> historicoTurnos;

}*/
package unpsjb.labprog.backend.model;

import java.time.LocalTime;
import java.util.Collection;
import java.util.Date;

import jakarta.persistence.Column;
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
public class Operario {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @Column(unique = true)
    private int legajo;
    
    private String nombre;

    private String turno;

    private String categoria;
    
    private Date fechaTurnoDesde;

    private Date fechaTurnoHasta;

    private LocalTime horaDesde;

    private LocalTime horaHasta;


}
