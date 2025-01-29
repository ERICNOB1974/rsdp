package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    @Autowired
    EventoRepository eventoRepository;

    @Autowired
    NotificacionRepository notificacionRepository;

    @Lazy
    @Autowired
    EmailService emailService;

    @Autowired
    NotificacionService notificacionService;

    @Autowired
    ComunidadService comunidadService;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> amigos(String nombreUsuario) {
        return usuarioRepository.amigos(nombreUsuario);
    }

    public List<Usuario> amigosPaginados(String nombreUsuario, String nombreUsuarioFiltrar, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir

        String filtroNombre = (nombreUsuarioFiltrar == null || nombreUsuarioFiltrar.trim().isEmpty()) ? ""
                : nombreUsuarioFiltrar;
        return usuarioRepository.amigosPaginados(nombreUsuario, filtroNombre, skip, size);
    }

    public List<Usuario> solicitudes(String nombreUsuario) {
        return usuarioRepository.solicitudesDeAmistad(nombreUsuario);
    }

    public List<Usuario> solicitudesPaginadas(String nombreUsuario, String nombreUsuarioFiltrar, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreUsuarioFiltrar == null || nombreUsuarioFiltrar.trim().isEmpty()) ? ""
                : nombreUsuarioFiltrar;
        return usuarioRepository.solicitudesPaginadas(nombreUsuario, filtroNombre, skip, size);
    }

    public List<Usuario> solicitudesEnviadas(String nombreUsuario) {
        return usuarioRepository.solicitudesDeAmistadEnviadas(nombreUsuario);
    }

    public List<Usuario> solicitudesEnviadasPaginadas(String nombreUsuario, String nombreUsuarioFiltrar, int page,
            int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreUsuarioFiltrar == null || nombreUsuarioFiltrar.trim().isEmpty()) ? ""
                : nombreUsuarioFiltrar;
        return usuarioRepository.solicitudesEnviadasPaginadas(nombreUsuario, filtroNombre, skip, size);
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

    public boolean existeNombreUsuarioMenosElActual(String nombreUsuarioIngresado, String nombreUsuarioActual) {
        return usuarioRepository.existeNombreUsuarioMenosElActual(nombreUsuarioIngresado, nombreUsuarioActual);
    }

    public void actualizarCorreo(Long idUsuario, String nuevoCorreo) throws Exception {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new Exception("Usuario no encontrado"));
        usuario.setCorreoElectronico(nuevoCorreo);
        usuarioRepository.save(usuario);
    }

    public List<Usuario> buscarUsuarios(String nombreUsuario, String term, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (term == null || term.trim().isEmpty()) ? "" : term;
        return usuarioRepository.buscarUsuarios(nombreUsuario, filtroNombre, skip, size);
    }

    public List<Usuario> buscarMiembrosComunidad(String nombreUsuario, Long idComunidad, String term, int page,
            int size) {
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Los parámetros de paginación no son válidos.");
        }

        int skip = page * size;
        String filtroNombre = (term == null || term.trim().isEmpty()) ? "" : term;
        List<Usuario> usuarios = new ArrayList<>();

        if (page == 0) {

            // Verificar si el solicitante es miembro de la comunidad
            Optional<Usuario> solicitante = usuarioRepository.findByNombreUsuario(nombreUsuario);
            solicitante.ifPresent(s -> {
                // Verificar si el solicitante ya está en los resultados
                boolean solicitanteYaIncluido = usuarios.stream()
                        .anyMatch(usuario -> usuario.getId().equals(s.getId()));

                // Si el solicitante no está en los resultados, agregarlo
                if (!solicitanteYaIncluido) {
                    // Verificar si es miembro de la comunidad
                    boolean esMiembro = usuarioRepository.esMiembro(s.getId(), idComunidad);
                    if (esMiembro) {
                        usuarios.add(s);
                    }
                }
            });
        }

        usuarios.addAll(
                usuarioRepository.buscarMiembrosComunidad(nombreUsuario, idComunidad, filtroNombre, skip, size));
        return usuarios;
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

    public Usuario creadorComunidad(Long idComunidad) {
        return usuarioRepository.creadorComunidad(idComunidad);
    }

    public Usuario creadorEvento(Long idEvento) {
        return usuarioRepository.creadorEvento(idEvento);
    }

    public List<Usuario> miembrosComunidad(Long idComunidad) {
        return usuarioRepository.miembros(idComunidad);
    }

    public List<Usuario> administradoresComunidad(Long idComunidad) {
        return usuarioRepository.administradores(idComunidad);
    }

    public List<ScoreAmigo> sugerenciaDeAmigosBasadaEnAmigos2(String nombreUsuario) {
        List<ScoreAmigo> sugerencias = usuarioRepository.sugerenciaDeAmigosBasadaEnAmigos2(nombreUsuario);
        return sugerencias;
    }

    public List<ScoreAmigo> sugerenciasDeAmigosBasadosEnEventos2(String nombreUsuario) {
        List<ScoreAmigo> sugerencias = usuarioRepository.sugerenciasDeAmigosBasadosEnEventos2(nombreUsuario);
        return sugerencias;
    }

    public List<ScoreAmigo> sugerenciasDeAmigosBasadosEnComunidades2(String nombreUsuario) {
        List<ScoreAmigo> sugerencias = usuarioRepository.sugerenciasDeAmigosBasadosEnComunidades2(nombreUsuario);
        return sugerencias;
    }

    public List<ScoreAmigo> obtenerTodasLasSugerenciasDeAmigos(String nombreUsuario) {
        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreAmigo> sugerenciasAmigos = usuarioRepository.sugerenciaDeAmigosBasadaEnAmigos2(nombreUsuario);
        List<ScoreAmigo> sugerenciasEventos = usuarioRepository.sugerenciasDeAmigosBasadosEnEventos2(nombreUsuario);
        List<ScoreAmigo> sugerenciasComunidades = usuarioRepository
                .sugerenciasDeAmigosBasadosEnComunidades2(nombreUsuario);

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
                    new ScoreAmigo(scoreAmigo.getUsuario(), scoreAmigo.getScore(), scoreAmigo.getMotivo()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        String nuevoMotivo = existente.getMotivo() + " --- " + nuevo.getMotivo();
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        existente.setMotivo(nuevoMotivo);
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

    public Long enviarInvitacionEvento(Long idUsuarioEmisor, Long idUsuarioReceptor, Long idEvento) {
        usuarioRepository.enviarInvitacionEvento(idUsuarioEmisor, idUsuarioReceptor, idEvento);
        notificacionRepository.crearNotificacionInvitacionEvento(idUsuarioReceptor, idUsuarioEmisor, idEvento,
                LocalDateTime.now());
        return idEvento;
    }

    public Long enviarInvitacionComunidad(Long idUsuarioEmisor, Long idUsuarioReceptor, Long idComunidad) {
        usuarioRepository.enviarInvitacionComunidad(idUsuarioEmisor, idUsuarioReceptor, idComunidad);
        notificacionRepository.crearNotificacionInvitacionComunidad(idUsuarioReceptor, idUsuarioEmisor, idComunidad,
                LocalDateTime.now());
        return idComunidad;
    }

    public List<Usuario> todosLosAmigosDeUnUsuarioPertenecientesAUnEvento(Long idUsuario, Long idEvento) {
        return usuarioRepository.todosLosAmigosDeUnUsuarioPertenecientesAUnEvento(idUsuario, idEvento);
    }

    public List<Usuario> todosLosAmigosDeUnUsuarioPertenecientesAUnaComunidad(Long idUsuario, Long idComunidad) {
        return usuarioRepository.todosLosAmigosDeUnUsuarioPertenecientesAUnaComunidad(idUsuario, idComunidad);
    }

    public List<Usuario> todosLosAmigosDeUnUsuarioNoPertenecientesAUnEvento(Long idUsuario, Long idEvento) {
        return usuarioRepository.todosLosAmigosDeUnUsuarioNoPertenecientesAUnEvento(idUsuario, idEvento);
    }

    public List<Usuario> todosLosAmigosDeUnUsuarioNoPertenecientesAUnEventoPrivadoPeroSiALaComunidad(Long idUsuario,
            Long idEvento) {
        Comunidad comunidad = comunidadService.buscarComunidadPorEventoInterno(idEvento);
        return usuarioRepository.todosLosAmigosDeUnUsuarioNoPertenecientesAUnEventoPrivadoPeroSiALaComunidad(idUsuario,
                idEvento, comunidad.getId());
    }

    public List<Usuario> todosLosAmigosDeUnUsuarioNoPertenecientesAUnaComunidad(Long idUsuario, Long idComunidad) {
        return usuarioRepository.todosLosAmigosDeUnUsuarioNoPertenecientesAUnaComunidad(idUsuario, idComunidad);
    }

    public List<Usuario> todosLosAmigosDeUnUsuarioYaInvitadosAUnEventoPorElUsuario(Long idUsuario, Long idEvento) {
        return usuarioRepository.todosLosAmigosDeUnUsuarioYaInvitadosAUnEventoPorElUsuario(idUsuario, idEvento);
    }

    public List<Usuario> todosLosAmigosDeUnUsuarioYaInvitadosAUnaComunidadPorElUsuario(Long idUsuario,
            Long idComunidad) {
        return usuarioRepository.todosLosAmigosDeUnUsuarioYaInvitadosAUnaComunidadPorElUsuario(idUsuario, idComunidad);
    }

    public List<Usuario> usuariosConMasInteracciones(Long idUsuario) {
        return usuarioRepository.usuariosConMasInteracciones(idUsuario);
    }

    public Usuario buscarCreadorDeUnEventoInterno(Long comunidadId, Long eventoId) {
        return usuarioRepository.buscarCreadorDeUnEventoInterno(comunidadId, eventoId);
    }

    public List<Usuario> likesPublicacion(Long idPublicacion, int page,
            int size) {
        int skip = page * size; // Cálculo de los resultados a omitir

        return usuarioRepository.likesPublicacion(idPublicacion, skip, size);
    }

    public Long contarUsuariosAnonimos(String nombreUsuario, Long idComunidad) {
        Long usuariosAnonimos = usuarioRepository.contarUsuariosAnonimos(nombreUsuario, idComunidad);
        if (usuariosAnonimos != 0) {
            usuariosAnonimos--;
        }
        return usuariosAnonimos;
    }

    public List<Usuario> buscarParticipantesEvento(String nombreUsuario, Long idEvento, String term, int page,
            int size) {
        if (page < 0 || size <= 0) {
            throw new IllegalArgumentException("Los parámetros de paginación no son válidos.");
        }

        int skip = page * size;
        String filtroNombre = (term == null || term.trim().isEmpty()) ? "" : term;
        List<Usuario> usuarios = new ArrayList<>();

        if (page == 0) {

            // Verificar si el solicitante es miembro de la comunidad
            Optional<Usuario> solicitante = usuarioRepository.findByNombreUsuario(nombreUsuario);
            solicitante.ifPresent(s -> {
                // Verificar si el solicitante ya está en los resultados
                boolean solicitanteYaIncluido = usuarios.stream()
                        .anyMatch(usuario -> usuario.getId().equals(s.getId()));

                // Si el solicitante no está en los resultados, agregarlo
                if (!solicitanteYaIncluido) {
                    // Verificar si es miembro de la comunidad
                    boolean esMiembro = eventoRepository.participa(s.getId(), idEvento);
                    if (esMiembro) {
                        usuarios.add(s);
                    }
                }
            });
        }

        usuarios.addAll(usuarioRepository.buscarParticipanteEvento(nombreUsuario, idEvento, filtroNombre, skip, size));
        return usuarios;
    }

    public Long contarParticipantesAnonimos(String nombreUsuario, Long idEvento) {
        Long usuariosAnonimos = usuarioRepository.contarParticipantesAnonimos(nombreUsuario, idEvento);
        if (usuariosAnonimos != 0) {
            usuariosAnonimos--;
        }
        return usuariosAnonimos;
    }

}
