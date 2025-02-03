package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Comparator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
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
    @Autowired
    private ArrobarService arrobarService;
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Publicacion save(Publicacion publicacion, Long idUsuario) {
        Publicacion p = publicacionRepository.save(publicacion);
        if (p.getId() != null) {
            publicacionRepository.establecerCreador(idUsuario, p.getId());
        }
        // Enviar notificación al frontend

        if (usuarioRepository.findById(idUsuario).get().getPrivacidadPerfil().equals("Privada")) {
            return p; // No se envía notificación
        }
        // Obtener la lista de amigos del usuario
        List<Long> amigosIds = usuarioRepository.amigos(
                usuarioRepository.findById(idUsuario).get().getNombreUsuario()).stream()
                .map(Usuario::getId) // Suponiendo que getId() devuelve el ID de tipo Long
                .collect(Collectors.toList());

        // Enviar la publicación solo a los amigos
        amigosIds.forEach(amigoId -> messagingTemplate.convertAndSend("/queue/publicaciones/" + amigoId, publicacion));

        messagingTemplate.convertAndSend("/topic/publicaciones", publicacion);
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
        arrobarService.eliminarArrobaPublicacion(idPublicacion);
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

    public Long cantidadLikes(Long idPublicacion) {
        return publicacionRepository.cantidadLikes(idPublicacion);
    }

    public Long findPublicacionIdByComentarioId(Long idComentarioPadre) {
        return publicacionRepository.findPublicacionIdByComentarioId(idComentarioPadre);
    }

    public Publicacion publicarEnComunidad(Long idComunidad, Long idUsuario, Publicacion publicacion) {
        Publicacion p = publicacionRepository.save(publicacion);
        Comunidad c = comunidadRepository.findById(idComunidad).orElse(null);
        boolean aprobada = !c.isEsModerada();

        String estado;
        if (c.isEsModerada()) {
            estado = "Pendiente";
        } else {
            estado = "Aprobada";
        }

        if (usuarioRepository.esCreador(idUsuario, idComunidad)
                || usuarioRepository.esAdministrador(idUsuario, idComunidad)) {
            estado = "Aprobada";
        }

        publicacionRepository.publicarEnComunidad(publicacion.getId(), idComunidad, estado);
        if (p.getId() != null) {
            publicacionRepository.establecerCreador(idUsuario, p.getId());
        }
        // Obtener la lista de participantes de la comunidad
        List<Long> participantes = usuarioRepository.miembros(idComunidad).stream()
                .map(Usuario::getId) // Suponiendo que getId() devuelve el ID de tipo Long
                .collect(Collectors.toList());

        // Enviar la publicación solo a los participantes
        if (aprobada) {

            participantes
                    .forEach(amigoId -> messagingTemplate.convertAndSend("/queue/publicaciones/" + amigoId,
                            publicacion));
            messagingTemplate.convertAndSend("/topic/publicaciones", publicacion);
        }
        return p;
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

    public List<Publicacion> publicacionesComunidadPorAprobar(Long comunidadId, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        return publicacionRepository.publicacionesParaAprobar(comunidadId, skip, size);
    }

    public List<Publicacion> publicacionesRechazadasUsuarioComunidad(Long comunidadId, Long idUsuario, int page,
            int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        return publicacionRepository.publicacionesRechazadasUsuarioComunidad(comunidadId, idUsuario, skip, size);
    }

    public List<Publicacion> publicacionesPendientesUsuarioComunidad(Long comunidadId, Long idUsuario, int page,
            int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        return publicacionRepository.publicacionesPendientesUsuarioComunidad(comunidadId, idUsuario, skip, size);
    }

    public Publicacion actualizarEstado(Long idComunidad, Long idPublicacion, String nuevoEstado) {
        return publicacionRepository.actualizarEstado(idComunidad, idPublicacion, nuevoEstado, ZonedDateTime.now());
    }
}
