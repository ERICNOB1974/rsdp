package unpsjb.labprog.backend.model;

import org.springframework.data.neo4j.core.schema.*;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private String descripcion;
    private int cantidadMaximaMiembros;

    @Relationship(type = "POSTEOS")
    private List<Publicacion> publicaciones;

    @Relationship(type = "CREADO_POR")
    private Usuario creador;

    @Relationship(type = "ADMINISTRADO_POR")
    private List<Usuario> administradores;

    @Relationship(type = "MIEMBRO")
    private List<Usuario> miembros;

    @Relationship(type = "ORGANIZA")
    private List<Evento> eventos;

    @Relationship(type = "ETIQUETADA_CON")
    private List<Etiqueta> etiquetas;

}
