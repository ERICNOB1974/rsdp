package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Publicacion;

@Service
public class PublicacionService {
    @Autowired
    PublicacionRepository publicacionRepository;
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
        Long idCreador= this.obtenerCreadorPublicacion(publicacionId);
        notificacionService.crearNotificacionPublicacion(idCreador, usuarioId, publicacionId, "LIKE", LocalDateTime.now());
        publicacionRepository.likear(usuarioId, publicacionId);
    }

    public void sacarLike(Long usuarioId, Long publicacionId) {
        publicacionRepository.sacarLike(usuarioId, publicacionId);
    }

    public boolean estaLikeada(Long usuarioId, Long publicacionId) {
        return publicacionRepository.estaLikeada(usuarioId, publicacionId);
    }

    public void comentar(Long usuarioId, Long publicacionId, String comentario) {
        Long idCreador= this.obtenerCreadorPublicacion(publicacionId);
        notificacionService.crearNotificacionPublicacion(idCreador, usuarioId, publicacionId, "COMENTARIO", LocalDateTime.now());
        publicacionRepository.comentar(usuarioId, publicacionId, comentario, ZonedDateTime.now());
    }

    public Long obtenerCreadorPublicacion(Long idPublicacion){
        return publicacionRepository.obtenerCreadorPublicacion(idPublicacion);
      
    public List<Publicacion> publicacionesUsuario(Long usuarioId) {
        return publicacionRepository.publicacionesUsuario(usuarioId);
    }
}
