package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.DTO.UsuarioEsAmigoDTO;

@Service
public class ArrobarService {
    
    @Autowired
    ComentarioRepository comentarioRepository;

    @Autowired
    ArrobarRepository arrobarRepository;

    @Autowired
    private NotificacionService notificacionService;


    public void etiquetarEnPublicacion(Long idUsuario, Long idEtiquetado, Long idPublicacion){
        arrobarRepository.etiquetarEnPublicacion(idUsuario, idEtiquetado, idPublicacion);
        notificacionService.crearNotificacionPublicacion(idEtiquetado, idUsuario, idPublicacion, "ARROBA_PUBLICACION",
                LocalDateTime.now());
    }

    public void etiquetarEnComentario(Long idUsuario, Long idEtiquetado, Long idComentario){
        Long idPublicacion=comentarioRepository.idPublicacionDadoComentario(idComentario);
        notificacionService.crearNotificacionPublicacion(idEtiquetado, idUsuario, idPublicacion, "ARROBA_COMENTARIO",
                LocalDateTime.now());
        arrobarRepository.etiquetarEnComentario(idUsuario, idEtiquetado, idComentario);
    }

        /**
     * Busca usuarios por un término, ordenados según amigos y cantidad de etiquetas.
     *
     * @param idUsuario El ID del usuario que realiza la búsqueda.
     * @param termino   El término de búsqueda.
     * @return Lista de usuarios ordenados.
     */
    public List<UsuarioEsAmigoDTO> buscarUsuariosPorTermino(Long idUsuario, String termino) {
        if (idUsuario == null || termino == null || termino.trim().isEmpty()) {
            throw new IllegalArgumentException("El ID del usuario y el término de búsqueda no pueden ser nulos o vacíos.");
        }

        return arrobarRepository.buscarUsuariosPorTerminoOrdenados(idUsuario, termino.trim());
    }

    public void eliminarArrobaPublicacion(Long idPublicacion){
        this.arrobarRepository.eliminarArrobaPublicacion(idPublicacion);
    }
    public void eliminarArrobaComentario(Long idComentario){
        this.arrobarRepository.eliminarArrobaComentario(idComentario);

    }
}
