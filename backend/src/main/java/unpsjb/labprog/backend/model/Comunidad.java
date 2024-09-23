package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Data
@Getter
@Setter
@Node("Comunidad")
@NoArgsConstructor
public class Comunidad {
    
    @Id
    @GeneratedValue
    private Long id;

    private String nombre;
    private LocalDate fechaDeCreacion;
    private String descripcion;
    private int cantidadMaximaMiembros;
    private String ubicacion;

    @Relationship(type = "POSTEA")
    private List<Publicacion> publicaciones;

    @Relationship(type = "CREADO_POR")
    private Usuario creador;

    @Relationship(type = "ADMINISTRADO_POR")
    private List<MiembroDeComunidad> administradores;

    @Relationship(type = "MIEMBRO")
    private List<MiembroDeComunidad> miembros;

    @Relationship(type = "ETIQUETADA_CON")
    private List<Etiqueta> etiquetas;

}
