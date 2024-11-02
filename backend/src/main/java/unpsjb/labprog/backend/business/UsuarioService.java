package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Usuario;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    NotificacionService notificacionService;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> amigos(String nombreUsuario) {
        return usuarioRepository.amigos(nombreUsuario);
    }

    public List<Usuario> solicitudes(String nombreUsuario) {
        return usuarioRepository.solicitudesDeAmistad(nombreUsuario);
    }

    public List<Usuario> amigosDeAmigos(String nombreUsuario) {
        return usuarioRepository.amigosDeAmigos(nombreUsuario);
    }

    public List<Usuario> sugerenciaDeAmigosBasadasEnAmigos(String nombreUsuario) {
        return usuarioRepository.sugerenciaDeAmigosBasadaEnAmigos(nombreUsuario);
    }

    public List<Usuario> sugerenciaDeAmigosBasadosEnEventos(String nombreUsuario) {
        return usuarioRepository.sugerenciasDeAmigosBasadosEnEventos(nombreUsuario);
    }

    public List<Usuario> sugerenciasDeAmigosBasadosEnComunidades(String nombreUsuario) {
        return usuarioRepository.sugerenciasDeAmigosBasadosEnComunidades(nombreUsuario);
    }

    public List<Usuario> todasLasSugerencias(String nombreUsuario) {
        List<Usuario> sugerencias = usuarioRepository.sugerenciasDeAmigosBasadosEnComunidades(nombreUsuario);
        sugerencias.addAll(usuarioRepository.sugerenciasDeAmigosBasadosEnEventos(nombreUsuario));
        sugerencias.addAll(usuarioRepository.sugerenciaDeAmigosBasadaEnAmigos(nombreUsuario));
        Set<Usuario> setUsuarios = new HashSet<Usuario>();
        setUsuarios.addAll(sugerencias);
        sugerencias.removeAll(sugerencias);
        sugerencias.addAll(setUsuarios);
        return sugerencias;
    }

    @Transactional
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }

    public Usuario findById(Long id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario findByNombreUsuario(String nombre) {
        return usuarioRepository.findByNombreUsuario(nombre).orElse(null);
    }

    public boolean existeMail(String correoElectronico) {
        return usuarioRepository.existeMail(correoElectronico);
    }

    public boolean existeNombreUsuario(String nombreUsuario) {
        return usuarioRepository.existeNombreUsuario(nombreUsuario);
    }

    public List<Usuario> buscarUsuarios(String term) {
        return usuarioRepository.buscarUsuarios(term);
    }

    public boolean sonAmigos(Long idEmisor, Long idReceptor) {
        return usuarioRepository.sonAmigos(idEmisor, idReceptor);
    }

    public String eliminarAmigo(Long idEmisor, Long idReceptor) {
        usuarioRepository.eliminarAmigo(idEmisor, idReceptor);
        return "Amigo eliminado Correctamente";
    }

    public String cancelarSolicitudAmistad(Long idUsuario, Long idReceptor) {
        usuarioRepository.rechazarSolicitudAmistad(idUsuario, idReceptor);
        notificacionService.eliminarNotificacionSolicitudEntrante(idUsuario, idReceptor);
        return "solicitud cancelada correctamente";
    }

    public boolean solicitudAmistadExiste(Long idEmisor, Long idReceptor) {
        return usuarioRepository.solicitudAmistadExiste(idEmisor, idReceptor);
    }

    public boolean esCreador(Long idUsuario, Long idComunidad) {
        return usuarioRepository.esCreador(idUsuario, idComunidad);
    }

    public List<Usuario> miembrosComunidad(Long idComunidad) {
        return usuarioRepository.miembros(idComunidad);
    }

    public List<Usuario> administradoresComunidad(Long idComunidad) {
        return usuarioRepository.administradores(idComunidad);
    }

    public List<ScoreAmigo> sugerenciaDeAmigosBasadaEnAmigos2(String nombreUsuario) {
        List<ScoreAmigo> sugerencias = usuarioRepository.sugerenciaDeAmigosBasadaEnAmigos2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getUsuario().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreAmigo> sugerenciasDeAmigosBasadosEnEventos2(String nombreUsuario) {
        List<ScoreAmigo> sugerencias = usuarioRepository.sugerenciasDeAmigosBasadosEnEventos2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getUsuario().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreAmigo> sugerenciasDeAmigosBasadosEnComunidades2(String nombreUsuario) {
        List<ScoreAmigo> sugerencias = usuarioRepository.sugerenciasDeAmigosBasadosEnComunidades2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getUsuario().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreAmigo> obtenerTodasLasSugerenciasDeAmigos(String nombreUsuario) {
        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreAmigo> sugerenciasAmigos = usuarioRepository.sugerenciaDeAmigosBasadaEnAmigos2(nombreUsuario);
        List<ScoreAmigo> sugerenciasEventos = usuarioRepository.sugerenciasDeAmigosBasadosEnEventos2(nombreUsuario);
        List<ScoreAmigo> sugerenciasComunidades = usuarioRepository
                .sugerenciasDeAmigosBasadosEnComunidades2(nombreUsuario);

        // Imprimir la cantidad de sugerencias para depuración
        System.out.println("Sugerencias amigos: " + sugerenciasAmigos.size());
        System.out.println("Sugerencias eventos: " + sugerenciasEventos.size());
        System.out.println("Sugerencias comunidades: " + sugerenciasComunidades.size());

        // Combinar todas las sugerencias en una sola lista
        List<ScoreAmigo> todasLasSugerencias = new ArrayList<>();
        todasLasSugerencias.addAll(sugerenciasAmigos);
        todasLasSugerencias.addAll(sugerenciasEventos);
        todasLasSugerencias.addAll(sugerenciasComunidades);

        // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
        Map<Long, ScoreAmigo> mapaSugerencias = new HashMap<>();

        for (ScoreAmigo scoreAmigo : todasLasSugerencias) {
            // Si la comunidad ya existe en el mapa, sumar los scores
            mapaSugerencias.merge(scoreAmigo.getUsuario().getId(),
                    new ScoreAmigo(scoreAmigo.getUsuario(), scoreAmigo.getScore()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        return existente; // Retornar el objeto existente actualizado
                    });
        }

        // Obtener la lista de ScoreComunidad sin duplicados con los scores sumados
        List<ScoreAmigo> listaSugerenciasSinDuplicados = new ArrayList<>(mapaSugerencias.values());

        // Ordenar la lista por score en orden descendente
        listaSugerenciasSinDuplicados.sort((a, b) -> Double.compare(b.getScore(), a.getScore())); // Orden descendente

        // Retornar la lista ordenada
        return listaSugerenciasSinDuplicados;
    }

    public void actualizarUbicacion(Long idUsuario, Double latitud, Double longitud) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuario.setLatitud(latitud);
        usuario.setLongitud(longitud);
        usuarioRepository.save(usuario);
    }

    public List<Usuario> inscriptosEvento(Long idEvento) {
        return usuarioRepository.inscriptosEvento(idEvento);
    }

}
