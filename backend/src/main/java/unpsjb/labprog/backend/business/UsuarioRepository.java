package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Usuario;

import java.util.List;

@Repository
public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {


}
