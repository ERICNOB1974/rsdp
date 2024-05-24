package unpsjb.labprog.backend.model;

import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class LogValidacionParteMO {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private Date fecha;

    @ManyToOne
    private Estado estado;

    @ManyToOne
    private ValidacionParteMO validacionParteMO;

    private Date tiempoCreacion;

    @PrePersist
    protected void onCreate() {
        tiempoCreacion = new Date();
    }

}