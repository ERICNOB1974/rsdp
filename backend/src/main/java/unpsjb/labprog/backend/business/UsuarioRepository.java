package unpsjb.labprog.backend.business;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import org.springframework.stereotype.Repository;

import unpsjb.labprog.backend.model.Usuario;
import java.util.List;

@Repository
public interface UsuarioRepository extends Neo4jRepository<Usuario, Long> {

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigos)" +
            "RETURN amigos")
    List<Usuario> amigos(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
            "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
            "RETURN DISTINCT amigosDeAmigos")
    List<Usuario> amigosDeAmigos(String nombreUsuario);

    @Query("MATCH (u:Usuario {nombreUsuario: $nombreUsuario})-[:ES_AMIGO_DE]-(amigo)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
            "WHERE amigosDeAmigos <> u AND NOT (u)-[:ES_AMIGO_DE]-(amigosDeAmigos) " +
            "WITH amigosDeAmigos, COUNT(amigo) AS amigosEnComun " +
            "RETURN amigosDeAmigos " +
            "ORDER BY amigosEnComun DESC")
    List<Usuario> sugerenciaDeAmigosBasadaEnAmigos(String nombreUsuario);

    @Query("MATCH (lucas:Usuario {nombreUsuario: $nombreUsuario})-[:PARTICIPA_EN]->(evento:Evento) " +
            "MATCH (participante:Usuario)-[:PARTICIPA_EN]->(evento) " +
            "WHERE participante <> lucas " +
            "WITH participante, COUNT(evento) AS eventosCompartidos " +
            "WHERE eventosCompartidos >= 2 " +
            "RETURN participante, eventosCompartidos " +
            "ORDER BY eventosCompartidos DESC")
    List<Usuario> sugerenciasDeAmigosBasadosEnEventos(String nombreUsuario);

}
