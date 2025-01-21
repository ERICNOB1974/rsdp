package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Publicacion;
import unpsjb.labprog.backend.model.Usuario;
import unpsjb.labprog.backend.model.DTO.PublicacionesDTO;

@Service
public class PublicacionService {
    @Autowired
    PublicacionRepository publicacionRepository;
    @Autowired
    ComunidadRepository comunidadRepository;
    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    private NotificacionService notificacionService;

    @Transactional
    public Publicacion save(Publicacion publicacion, Long idUsuario) {
        Publicacion p = publicacionRepository.save(publicacion);
        if (p.getId() != null) {
            publicacionRepository.establecerCreador(idUsuario, p.getId());
        }
        return p;
    }

    public Publicacion findById(Long id) {
        return publicacionRepository.findById(id).orElse(null);
    }

    public void likear(Long usuarioId, Long publicacionId) {
        Long idCreador = this.obtenerCreadorPublicacion(publicacionId).getId();
        notificacionService.crearNotificacionPublicacion(idCreador, usuarioId, publicacionId, "LIKE",
                LocalDateTime.now());
        publicacionRepository.likear(usuarioId, publicacionId);
    }

    public void eliminar(Long idPublicacion) {
        publicacionRepository.delete(publicacionRepository.findById(idPublicacion).get());
    }

    public void sacarLike(Long usuarioId, Long publicacionId) {
        publicacionRepository.sacarLike(usuarioId, publicacionId);
    }

    public boolean estaLikeada(Long usuarioId, Long publicacionId) {
        return publicacionRepository.estaLikeada(usuarioId, publicacionId);
    }

 
    public Usuario obtenerCreadorPublicacion(Long idPublicacion) {
        return usuarioRepository.publicadoPor(idPublicacion);
    }

    public List<Publicacion> publicacionesUsuario(Long usuarioId, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        return publicacionRepository.publicacionesUsuario(usuarioId, skip, size);
    }

    public List<Publicacion> publicacionesAmigos(Long usuarioId) {
        return publicacionRepository.publicacionesAmigosUsuario(usuarioId);
    }

    public List<Publicacion> publicacionesHome(Long usuarioId, int page, int size) {
        // Obtener las publicaciones del usuario y de sus amigos
        int skip = page * size; // Cálculo de los resultados a omitir
        List<Publicacion> publicaciones = publicacionRepository.publicacionesUsuarioYAmigos(usuarioId, skip, size);
        // Ordenar las publicaciones por fechaDeCreacion en orden descendente

        publicaciones.sort(Comparator.comparing(Publicacion::getFechaDeCreacion).reversed());

        return publicaciones;
    }

    public List<Publicacion> publicacionesComunidad(Long comunidadId, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir

        return publicacionRepository.publicacionesComunidad(comunidadId, skip, size);
    }

/*     public List<Comentario> obtenerComentariosPorPublicacion(Long idPublicacion) throws Exception {
        List<Long> comentariosId = publicacionRepository.idComentarios(idPublicacion);

        List<Comentario> comentarios = new ArrayList<>();
        for (Long id : comentariosId) {
            Comentario comentario = obtenerComentariosPorId(id);
            if (comentario != null) {
                comentarios.add(comentario);
            }
        }
        // Collections.sort(comentarios, Collections.reverseOrder());

        return comentarios;
    }

    private Comentario obtenerComentariosPorId(Long id) throws Exception {
        String texto = publicacionRepository.findTextoById(id);
        ZonedDateTime fecha = publicacionRepository.findFechaById(id);
        Usuario usuario = usuarioRepository.findUsuarioById(id);
        if (texto == null || fecha == null || usuario == null) {
            throw new Exception("Comentario no encontrado con ID: " + id);
        }

        Comentario comentario = new Comentario();
        comentario.setTexto(texto);
        comentario.setFecha(fecha);
        comentario.setUsuario(usuario);

        return comentario;
    } */

    public Long cantidadLikes(Long idPublicacion) {
        return publicacionRepository.cantidadLikes(idPublicacion);
    }

    public void publicarEnComunidad(Long idComunidad, Long idUsuario, Publicacion publicacion) {
        this.save(publicacion, idUsuario);
        publicacionRepository.publicarEnComunidad(publicacion.getId(), idComunidad);
    }

    public List<PublicacionesDTO> obtenerTodasLasPublicaciones(Long idUsuario, int page, int size) {

        int skip = page * size; // Cálculo de los resultados a omitir
        List<Publicacion> publicaciones = publicacionRepository.publicacionesUsuarioYAmigos(idUsuario, skip, size);
        
        return publicaciones.stream()
                .sorted(Comparator.comparing(Publicacion::getFechaDeCreacion).reversed())
                .map(publicacion -> {
                    Long idPublicacion = publicacion.getId();

                    // Obtener datos adicionales para construir el DTO
                    Usuario creador = usuarioRepository.publicadoPor(idPublicacion);
                    Long likes = publicacionRepository.cantidadLikes(idPublicacion);
                    boolean estaLikeada = publicacionRepository.estaLikeada(idUsuario, idPublicacion);
                    Comunidad esEnComunidad = comunidadRepository.comunidadDePublicacion(idPublicacion).orElse(null);
                    // Construir el DTO
                    PublicacionesDTO dto = new PublicacionesDTO();
                    dto.setPublicacion(publicacion);
                    dto.setCreador(creador);
                    dto.setLikes(likes);
                    dto.setEstaLikeada(estaLikeada);
                    dto.setComunidad(esEnComunidad);

                    return dto;
                })
                .collect(Collectors.toList());
    }

}
