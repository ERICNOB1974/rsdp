package unpsjb.labprog.backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class ValidacionParteMO {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    private String nombre;

    private String descripcion;

    @Column
    private Tipo tipo;

}