package unpsjb.labprog.backend.business;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Comunidad;
import unpsjb.labprog.backend.model.Usuario;
import unpsjb.labprog.backend.model.DTO.ExpulsionDTO;


@Service
public class ComunidadService {

    @Autowired
    ComunidadRepository comunidadRepository;
    @Autowired
    UsuarioRepository usuarioRepository;
    @Autowired
    @Lazy
    UsuarioService usuarioService;
    @Autowired
    private NotificacionService notificacionService;
    @Autowired
    private LocationService locationService;

    public List<Comunidad> findAll() {
        return comunidadRepository.findAll();
    }

    public int miembrosDeComunidad(Long idComunidad) {
        return comunidadRepository.miembrosDeComunidad(idComunidad);
    }

    public List<Comunidad> sugerenciasDeComunidadesBasadasEnAmigos(String nombreDeUsuario) {
        return comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos(nombreDeUsuario);
    }

    public List<Comunidad> sugerenciasDeComunidadesBasadasEnComunidades(String nombreDeUsuario) {
        return comunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades(nombreDeUsuario);
    }

    public List<Comunidad> sugerenciasDeComunidadesBasadasEnEventos(String nombreDeUsuario) {
        return comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos(nombreDeUsuario);
    }

    @Transactional
    public Comunidad save(Comunidad comunidad) {

        String ubicacion = locationService.getCityAndCountry(comunidad.getLatitud(), comunidad.getLongitud());

        comunidad.setUbicacion(ubicacion);

        if (comunidad.getId() != null) {
            Comunidad comVieja = comunidadRepository.findById(comunidad.getId()).get();
            if (comVieja.isEsPrivada() && !comunidad.isEsPrivada()) {
                comunidadRepository.save(comunidad);
                cambioAPublico(comVieja.getId());
            }
        }
        return comunidadRepository.save(comunidad);
    }

    public void cambioAPublico(Long idComunidad) {
        int disponibilidad = comunidadRepository.cuposDisponibles(idComunidad);
        List<Usuario> solicitudes = this.usuarioRepository.solicititudesPendientes(idComunidad);
        int minimo = Math.min(disponibilidad, solicitudes.size());
        // ver aca que onda
        for (int i = 0; i < minimo; i++) {
            aceptarSolicitud(solicitudes.get(i).getId(), idComunidad);
        }
        if (disponibilidad < solicitudes.size()) {
            for (int i = disponibilidad; i < solicitudes.size(); i++) {
                comunidadRepository.eliminarSolicitudIngreso(solicitudes.get(i).getId(), idComunidad);
            }
        }
    }

    public void aceptarSolicitud(Long idUsuario, Long idComunidad) {
        comunidadRepository.eliminarSolicitudIngreso(idUsuario, idComunidad);
        comunidadRepository.nuevoMiembro(idComunidad, idUsuario, LocalDateTime.now());
        notificacionService.crearNotificacion(idUsuario, idComunidad, "ACEPTACION_PRIVADA", LocalDateTime.now());

    }

    @Transactional
    public void deleteById(Long id) {
        comunidadRepository.deleteById(id);
    }

    public Comunidad findById(Long id) {
        return comunidadRepository.findById(id).orElse(null);
    }

    public void etiquetarComunidad(Comunidad comunidad, Long etiqueta) {
        comunidadRepository.etiquetarComunidad(comunidad.getId(), etiqueta);
    }

    public String miembroSale(Long idComunidad, Long idUsuario) {
        if (!usuarioRepository.esMiembro(idUsuario, idComunidad)
                && !usuarioRepository.esAdministrador(idUsuario, idComunidad)
                && !usuarioRepository.esCreador(idUsuario, idComunidad)) {
            return "El usuario no pertenece a la comunidad.";
        }
        comunidadRepository.miembroSaliente(idComunidad, idUsuario);
        if (comunidadRepository.esFavorita(idComunidad, idUsuario)) {
            comunidadRepository.eliminarComoFavorita(idComunidad, idUsuario);
        }
        return "Exito al salir de la comunidad";
    }

    // Método para obtener comunidades con paginación
    public List<Comunidad> obtenerComunidadesDisponiblesPaginadas(String nombreUsuario, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        return comunidadRepository.disponibles(nombreUsuario, skip, size);
    }

    public List<Comunidad> miembroUsuario(Long idUsuario, String nombreComunidad, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreComunidad == null || nombreComunidad.trim().isEmpty()) ? "" : nombreComunidad;
        return comunidadRepository.miembroUsuario(idUsuario, filtroNombre, skip, size);
    }

    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnAmigos2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreComunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos2(nombreUsuario,
                generoUsuario);
        sugerencias.forEach(
                s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnAmigosSinEtiquetas2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreComunidad> sugerencias = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnAmigos2SinEtiquetas(nombreUsuario, generoUsuario);
        sugerencias.forEach(
                s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreComunidad> obtenerSugerenciasDeComunidadesBasadasEnEventos2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreComunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos2(nombreUsuario,
                generoUsuario);
        sugerencias.forEach(
                s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreComunidad> sugerenciasDeComunidadesBasadasEnComunidades2(String nombreUsuario) {
        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        List<ScoreComunidad> sugerencias = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnComunidades2(nombreUsuario, generoUsuario);
        sugerencias.forEach(
                s -> System.out.println("Comunidad: " + s.getComunidad().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public Map<String, Object> obtenerSugerenciasComunidadesConTotalPaginas(String nombreUsuario, int page,
            int pageSize) {

        Usuario usuario = usuarioService.findByNombreUsuario(nombreUsuario);

        String generoUsuario = usuario.getGenero();

        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreComunidad> sugerenciasAmigos = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnAmigos2(nombreUsuario, generoUsuario);
        List<ScoreComunidad> sugerenciasEventos = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnEventos2(nombreUsuario, generoUsuario);
        List<ScoreComunidad> sugerenciasComunidades = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnComunidades2(nombreUsuario, generoUsuario);
        List<ScoreComunidad> sugerenciasAmigosSinEtiquetas = comunidadRepository
                .sugerenciasDeComunidadesBasadasEnAmigos2SinEtiquetas(nombreUsuario, generoUsuario);

        // Combinar todas las sugerencias en una sola lista
        List<ScoreComunidad> todasLasSugerencias = new ArrayList<>();
        todasLasSugerencias.addAll(sugerenciasAmigos);
        todasLasSugerencias.addAll(sugerenciasEventos);
        todasLasSugerencias.addAll(sugerenciasComunidades);
        todasLasSugerencias.addAll(sugerenciasAmigosSinEtiquetas);

        // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
        Map<Long, ScoreComunidad> mapaSugerencias = new HashMap<>();

        for (ScoreComunidad scoreComunidad : todasLasSugerencias) {
            // Si la comunidad ya existe en el mapa, sumar los scores
            mapaSugerencias.merge(scoreComunidad.getComunidad().getId(),
                    new ScoreComunidad(scoreComunidad.getComunidad(), scoreComunidad.getScore(),
                            scoreComunidad.getMotivo()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        String nuevoMotivo = existente.getMotivo() + " --- " + nuevo.getMotivo();
                        existente.setMotivo(nuevoMotivo); // Actualizar el motivo
                        return existente; // Retornar el objeto existente actualizado
                    });
        }

        for (ScoreComunidad scoreComunidad : mapaSugerencias.values()) {
            String motivo = scoreComunidad.getMotivo();
            if (!motivo.contains("Está adecuado a tus preferencias de género")) {
                motivo += " --- Está adecuado a tus preferencias de género";
                scoreComunidad.setMotivo(motivo);
            }
        }

        // Obtener la lista de ScoreComunidad sin duplicados con los scores sumados
        List<ScoreComunidad> listaSugerenciasSinDuplicados = new ArrayList<>(mapaSugerencias.values());

        // Ordenar la lista por score en orden descendente
        listaSugerenciasSinDuplicados.sort((a, b) -> Double.compare(b.getScore(), a.getScore())); // Orden descendente

        // Calcular el total de páginas
        int totalElementos = listaSugerenciasSinDuplicados.size();
        int totalPaginas = (int) Math.ceil((double) totalElementos / pageSize);

        // Paginar la lista
        int start = page * pageSize;
        int end = Math.min(start + pageSize, listaSugerenciasSinDuplicados.size());

        if (start > end) {
            return Collections.emptyMap(); // Si la página está fuera de rango
        }

        // Crear el mapa con los datos de eventos y el total de páginas
        Map<String, Object> result = new HashMap<>();
        result.put("data", listaSugerenciasSinDuplicados.subList(start, end)); // Eventos de la página
        result.put("totalPaginas", totalPaginas); // Total de páginas

        return result;
    }

    public List<Comunidad> comunidadesEtiquetas(List<String> etiquetas, String tipo, Long usuarioId) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return comunidadRepository.comunidadesEtiquetasDisponibles(usuarioId, etiquetas);
        } else if ("miembro".equalsIgnoreCase(tipo)) {
            return comunidadRepository.comunidadesEtiquetasMiembro(usuarioId, etiquetas);
        } else {
            return comunidadRepository.comunidadesEtiquetas(etiquetas);
        }
    }

    public List<Comunidad> comunidadesPorNombreYTipo(String nombre, String tipo, Long usuarioId) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return comunidadRepository.comunidadesNombreDisponibles(nombre, usuarioId);
        } else if ("miembro".equalsIgnoreCase(tipo)) {
            return comunidadRepository.comunidadesNombreMiembro(nombre, usuarioId);
        } else {
            return comunidadRepository.comunidadesNombre(nombre);
        }
    }

    public List<Comunidad> comunidadesParticipantes(String tipo, Long usuarioId, int min, int max) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return comunidadRepository.comunidadesCantidadParticipantesDisponibles(usuarioId, min, max);
        } else if ("miembro".equalsIgnoreCase(tipo)) {
            return comunidadRepository.comunidadesCantidadParticipantesMiembro(usuarioId, min, max);
        } else {
            return comunidadRepository.comunidadesCantidadParticipantes(min, max);
        }
    }

    public List<Comunidad> comunidadesCreadasPorUsuario(Long idUsuario, int offset, int limit) {
        return comunidadRepository.comunidadesCreadasPorUsuario(idUsuario, offset, limit);
    }

    public boolean puedeVer(Long idComunidad, Long idUsuario) {
        Comunidad c = comunidadRepository.findById(idComunidad).orElse(null);
        if (c == null) {
            return false;
        }
        if (!c.isEsPrivada()) {
            return true;
        }
        if (c.isEsPrivada()) {
            if (comunidadRepository.esMiembro(idUsuario, idComunidad)) {
                return true;
            }
            if (usuarioRepository.esAdministrador(idUsuario, idComunidad)) {
                return true;
            }
            if (usuarioRepository.esCreador(idUsuario, idComunidad)) {
                return true;
            }

            return false;
        }

        return true;
    }

    public void cambiarEstadoFavorita(Long idComunidad, Long idUsuario) {
        if (comunidadRepository.esFavorita(idComunidad, idUsuario)) {
            comunidadRepository.eliminarComoFavorita(idComunidad, idUsuario);
        } else {
            comunidadRepository.marcarComoFavorita(idComunidad, idUsuario);
        }
    }

    public boolean esFavorita(Long idComunidad, Long idUsuario) {
        return comunidadRepository.esFavorita(idComunidad, idUsuario);
    }

    public List<Comunidad> comunidadesFavoritas(Long idUsuario, String nombreComunidad, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreComunidad == null || nombreComunidad.trim().isEmpty()) ? "" : nombreComunidad;
        return comunidadRepository.listaFavoritas(idUsuario, filtroNombre, skip, size);
    }

    public Comunidad buscarComunidadPorEventoInterno(Long idEvento) {
        return comunidadRepository.buscarComunidadPorEventoInterno(idEvento);
    }

/*     public void eliminarUsuario(String mensaje, Long idComunidad, Long idUsuario) {
        Comunidad c = comunidadRepository.findById(idComunidad).get();
        String notificacion = "Has sido eliminado de la comunidad " + c.getNombre();
        this.notificacionService.notificarExpulsionComunidad(notificacion, idComunidad, idUsuario);
        this.comunidadRepository.eliminarUsuario(idComunidad, idUsuario, mensaje);
    } */
public void eliminarUsuario(String motivo, String tipo, String fechaHoraExpulsion, Long idComunidad, Long idUsuario) {
    // Convertir la fechaHoraExpulsion en un objeto LocalDateTime
    DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    LocalDateTime fechaExpulsion = LocalDateTime.parse(fechaHoraExpulsion, formatter);
    
    Comunidad c = comunidadRepository.findById(idComunidad).get();
    String notificacion = "Has sido eliminado de la comunidad " + c.getNombre();
    
    // Aquí, notificar la expulsión
    this.notificacionService.notificarExpulsionComunidad(notificacion, idComunidad, idUsuario);
    
    // Eliminar el usuario con el mensaje y la fecha de expulsión
    this.comunidadRepository.eliminarUsuario(idComunidad, idUsuario, motivo, tipo, fechaExpulsion, LocalDateTime.now());
}

public void editarExpulsion(String motivo, String tipo, String fechaHoraExpulsion, Long idComunidad, Long idUsuario) {
    // Lógica para editar la expulsión
    // 1. Recuperar el usuario y la comunidad
    Usuario usuario = usuarioRepository.findById(idUsuario).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    Comunidad comunidad = comunidadRepository.findById(idComunidad).orElseThrow(() -> new RuntimeException("Comunidad no encontrada"));
    String expulsado = comunidadRepository.findTipoExpulsion(idUsuario,idComunidad);  // Asegúrate de que este valor se obtiene correctamente
    if (expulsado != null) {
        // Si la expulsión ya existe, actualizar los datos
  DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
    LocalDateTime fechaExpulsion = LocalDateTime.parse(fechaHoraExpulsion, formatter);
        comunidadRepository.actualizarExpulsion(idUsuario,idComunidad,motivo,tipo,fechaExpulsion);
    } else {
        eliminarUsuario(motivo,tipo,fechaHoraExpulsion,idComunidad,idUsuario);
    }
}

   

public ExpulsionDTO obtenerExpulsionDTO(Long idUsuario, Long idComunidad) {
    // Crear un nuevo objeto ExpulsionDTO
    ExpulsionDTO expulsionDTO = new ExpulsionDTO();
    
    // Obtener los atributos de la base de datos o lógica
    String motivoExpulsion = comunidadRepository.findMotivoExpulsion(idUsuario, idComunidad);  // Suponiendo que esta es la lógica correcta
    String tipo = comunidadRepository.findTipoExpulsion(idUsuario,idComunidad);  // Asegúrate de que este valor se obtiene correctamente
    if(tipo.equals("temporal")){
    LocalDateTime fechaHoraExpulsion = comunidadRepository.findFechaHoraExpulsion(idUsuario,idComunidad);  // Verifica que esto devuelva la fecha correcta
    expulsionDTO.setFechaHoraExpulsion(fechaHoraExpulsion);  // Establecer la fecha de expulsión
    }

    // Comprobar si el tipo no es null y si es así, marcar como expulsado
    if (tipo != null) {
        expulsionDTO.setEstaExpulsado(true);  // Usar el setter correcto
    } else {
        expulsionDTO.setEstaExpulsado(false); // Opcional: Establecer en falso si tipo es null
    }

    // Establecer los valores obtenidos en el DTO
    expulsionDTO.setMotivoExpulsion(motivoExpulsion);  // Establecer el motivo de expulsión
    expulsionDTO.setTipo(tipo);  // Establecer el tipo

    return expulsionDTO;  // Retornar el DTO con los datos establecidos
}


    @Transactional
    public void agregarUbicacionAComunidadesSinUbicacion() {
        List<Comunidad> comunidades = comunidadRepository.findAll();

        for (Comunidad comunidad : comunidades) {
            if (comunidad.getUbicacion() == null || comunidad.getUbicacion().isEmpty()) {
                try {
                    // Obtener latitud y longitud del evento
                    Double latitud = comunidad.getLatitud();
                    Double longitud = comunidad.getLongitud();

                    if (latitud != null && longitud != null) {
                        String ubicacion = locationService.getCityAndCountry(latitud, longitud);

                        comunidad.setUbicacion(ubicacion);

                        comunidadRepository.save(comunidad);
                    }
                } catch (Exception e) {
                    System.err
                            .println("Error al procesar la comunidad con ID: " + comunidad.getId() + " - "
                                    + e.getMessage());
                }
            }
        }

    }

    public void eliminarBan(Long idComunidad, Long idUsuario){
        comunidadRepository.eliminarBan(idComunidad,idUsuario);
    }
}