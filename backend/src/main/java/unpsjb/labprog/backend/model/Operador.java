package unpsjb.labprog.backend.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Operador {

    @Id 
    private int legajo;
    
    private String nombre;

    private String categoria;
}

