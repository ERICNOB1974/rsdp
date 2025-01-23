package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.time.ZonedDateTime;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Comentario;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class ComentarioService {

    @Autowired
    ComentarioRepository comentarioRepository;

   @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    private NotificacionService notificacionService;

  public void comentar(Long usuarioId, Long publicacionId, String comentario) {
        Long idCreador = this.obtenerCreadorPublicacion(publicacionId).getId();
        notificacionService.crearNotificacionPublicacion(idCreador, usuarioId, publicacionId, "COMENTARIO",
                LocalDateTime.now());
        comentarioRepository.comentar(usuarioId, publicacionId, comentario, ZonedDateTime.now());
    }

public List<Comentario> obtenerComentariosPorPublicacion(Long idPublicacion) {
    List<Comentario> comentarios = comentarioRepository.findComentariosByPublicacionId(idPublicacion);

    // Asignar el usuario a cada comentario
    for (Comentario comentario : comentarios) {
        // Asignar el usuario manualmente
        Usuario usuario = usuarioRepository.findUsuarioByComentarioId(comentario.getId());
        comentario.setUsuario(usuario);
    }

    return comentarios;
}

   public Usuario obtenerCreadorPublicacion(Long idPublicacion) {
        return usuarioRepository.publicadoPor(idPublicacion);
    }

public Comentario responderComentario(Long comentarioPadreId, String texto, Long usuarioId) throws Exception {
    // Validación: Verificar que el comentario a responder no sea una respuesta.
    Optional<Comentario> comentarioPadre = comentarioRepository.findById(comentarioPadreId);
  if (comentarioPadre.isEmpty() ) {
            throw new Exception("Comentario no encontrado.");
        }

    // Crear la respuesta
    Comentario comentario = comentarioRepository.responderComentario(comentarioPadreId, texto, ZonedDateTime.now(), usuarioId);
comentario.setUsuario(usuarioRepository.findById(usuarioId).orElseThrow(() -> new Exception("Usuario no encontrado.")));
    return comentario;
}

   public List<Comentario> obtenerRespuestas(Long comentarioPadreId,int page, int size) {
       int skip = page * size;

        List<Comentario> respuestas = comentarioRepository.findRespuestasByComentarioPadreId(comentarioPadreId, skip, size);
           for (Comentario comentario : respuestas) {
        // Asignar el usuario manualmente
        Usuario usuario = usuarioRepository.findUsuarioByComentarioId(comentario.getId());
        comentario.setUsuario(usuario);
    }
   
   return respuestas;
    }

    public long contarRespuestas(Long comentarioPadreId) {
        // Consulta en el repositorio para contar respuestas
        return comentarioRepository.contarRespuestasPorComentarioPadreId(comentarioPadreId);
    }

    public void eliminar(Long idComentario) {
        this.comentarioRepository.eliminarComentario(idComentario);
    }


}