package unpsjb.labprog.backend.business;

import java.time.LocalDate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Comparator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Dia;
import unpsjb.labprog.backend.model.Ejercicio;
import unpsjb.labprog.backend.model.Etiqueta;
import unpsjb.labprog.backend.model.Rutina;
import unpsjb.labprog.backend.model.DTO.EjercicioDTO;
import unpsjb.labprog.backend.model.DTO.EtiquetaDTO;
import unpsjb.labprog.backend.model.DTO.GuardarRutinaDiaDTO;
import unpsjb.labprog.backend.model.DTO.RutinaCompletaDTO;

@Service
public class RutinaService {

    @Autowired
    RutinaRepository rutinaRepository;

    @Autowired
    DiaRepository diaRepository;

    @Autowired
    EjercicioRepository ejercicioRepository;

    @Autowired
    EtiquetaRepository etiquetaRepository;

    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }

    public List<Rutina> sugerenciasDeRutinasBasadosEnAmigos(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos(nombreUsuario);
    }

    public Long saveConCreador(Rutina rutina, Long usuarioId) throws Exception {
        Long rutinaId = rutinaRepository.save(rutina).getId();
        rutinaRepository.crearRelacionCreador(rutinaId, usuarioId);
        return rutinaId;
    }

    public Long crearRelacionRealizaRutina(Long rutinaId, Long usuarioId) throws Exception {
        rutinaRepository.crearRelacionRealizaRutina(rutinaId, usuarioId);
        return rutinaId;
    }

    public Long crearRelacionDiaFinalizado(Long diaId, Long usuarioId) throws Exception {
        // Consulta si el día ya fue finalizado por el usuario y obtiene el intento
        // actual
        Integer intento = diaRepository.buscarMaxIntento(diaId, usuarioId);
        System.out.println("Intento obtenido de la base de datos: " + intento);

        // Si intento es null, significa que el día no ha sido finalizado antes,
        // entonces intento es 1
        if (intento == null) {
            intento = 1;
            System.out.println("El día no ha sido finalizado antes. Se establece intento en: " + intento);
        } else {
            // Si el día es de orden 1, incrementa el intento
            int numeroDia = diaRepository.buscarNumeroDia(diaId);
            System.out.println("Número de día obtenido: " + numeroDia);

            if (numeroDia == 1) {
                intento += 1;
                System.out.println("Día es de orden 1. Intento incrementado a: " + intento);
            } else {
                System.out.println("Día no es de orden 1. Intento se mantiene en: " + intento);
            }
        }

        // Crea la relación DIA_FINALIZADO con el intento calculado
        diaRepository.crearRelacionDiaFinalizado(diaId, usuarioId, intento);
        System.out.println("Relación DIA_FINALIZADO creada con intento: " + intento);

        return diaId;
    }

    public boolean verificarDiaFinalizado(Long diaId, Long usuarioId) throws Exception {
        return diaRepository.verificarDiaFinalizado(diaId, usuarioId);
    }

    public Long guardarRutina(Rutina rutina) {
        return rutinaRepository.save(rutina).getId();
    }

    @Transactional
    public Rutina save(Rutina rutina) throws Exception {
        if (rutina.getNombre() == null) {
            throw new Exception("La rutina debe tener nombre");
        }

        // if rutina no tiene ejercicios

        return rutinaRepository.save(rutina);
    }

    public List<Ejercicio> ejercicios(Long idRutina) {
        return ejercicioRepository.findEjerciciosByRutinaId(idRutina);
    }

    @Transactional
    public void deleteById(Long id) {
        rutinaRepository.deleteById(id);
    }

    public Rutina findById(Long id) {
        return rutinaRepository.findById(id).orElse(null);
    }

    public List<Rutina> sugerenciasDeRutinasBasadasEnRutinas(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadasEnRutinas(nombreUsuario);
    }

    public List<Rutina> sugerenciasDeRutinasBasadasEnComunidades(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadasEnComunidades(nombreUsuario);
    }

    public List<Rutina> sugerenciaDeRutinasBasadosEnEventos(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadosEnEventos(nombreUsuario);
    }

    public List<Rutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(nombreUsuario);
    }

    @Transactional
    public void guardarRutinaCompleta(RutinaCompletaDTO rutinaCompletaDTO, Long usuarioId) throws Exception {
        Rutina rutina = new Rutina();
        rutina.setNombre(rutinaCompletaDTO.getNombre());
        rutina.setDescripcion(rutinaCompletaDTO.getDescripcion());
        Long rutinaId = this.saveConCreador(rutina, usuarioId);

        for (EtiquetaDTO etiquetaDTO : rutinaCompletaDTO.getEtiquetas()) {
            Etiqueta etiqueta = etiquetaRepository.findByNombre(etiquetaDTO.getNombre()).orElse(null);
            if (etiqueta == null) {
                Etiqueta nuevaEtiqueta = new Etiqueta();
                nuevaEtiqueta.setNombre(etiquetaDTO.getNombre());
                etiqueta = etiquetaRepository.save(nuevaEtiqueta);
            }
            rutinaRepository.etiquetarRutina(rutinaId, etiqueta.getId());
        }

        for (GuardarRutinaDiaDTO diaDTO : rutinaCompletaDTO.getDias()) {
            Long diaId = diaRepository.crearDia(diaDTO.getNombre(), diaDTO.getDescripcion());
            rutinaRepository.relacionarRutinaDia(rutinaId, diaId, diaDTO.getOrden());

            for (EjercicioDTO ejercicioDTO : diaDTO.getEjercicios()) {

                if ("resistencia".equalsIgnoreCase(ejercicioDTO.getTipo())) {
                    Ejercicio ejercicio = new Ejercicio();
                    ejercicio.setNombre(ejercicioDTO.getNombre());
                    ejercicio.setImagen(ejercicioDTO.getImagen());
                    ejercicio.setDescripcion(ejercicioDTO.getDescripcion());
                    this.guardarEjercicioResistencia(diaId, ejercicio, ejercicioDTO.getOrden(), ejercicioDTO.getTiempo());
                } else {
                    Ejercicio ejercicio = new Ejercicio();
                    ejercicio.setNombre(ejercicioDTO.getNombre());
                    ejercicio.setImagen(ejercicioDTO.getImagen());
                    ejercicio.setDescripcion(ejercicioDTO.getDescripcion());
                    this.guardarEjercicioSeries(diaId, ejercicio, ejercicioDTO.getOrden(), ejercicioDTO.getSeries(), ejercicioDTO.getRepeticiones());
                }
            }
        }
    }

    @Transactional
    public Long guardarDia(Long rutinaId, Dia dia, int orden) {
        Long diaId = diaRepository.crearDia(dia.getNombre(), dia.getDescripcion());
        rutinaRepository.relacionarRutinaDia(rutinaId, diaId, orden);
        return diaId;
    }

    @Transactional
    public void guardarEjercicioResistencia(Long diaId, Ejercicio ejercicio, int orden, String tiempo) {
        Ejercicio ejercicioExistente = ejercicioRepository.findByNombreDescripcionImagen(
                ejercicio.getNombre(), ejercicio.getDescripcion(), ejercicio.getImagen());

        Long ejercicioId;
        if (ejercicioExistente == null) {
            ejercicioId = ejercicioRepository.crearEjercicio(ejercicio.getNombre(), ejercicio.getDescripcion(),
                    ejercicio.getImagen());
        } else {
            ejercicioId = ejercicioExistente.getId();
        }

        rutinaRepository.relacionarDiaEjercicioResistencia(diaId, ejercicioId, orden, tiempo);
    }

    @Transactional
    public void guardarEjercicioSeries(Long diaId, Ejercicio ejercicio, int orden, int series, int repeticiones) {
        Ejercicio ejercicioExistente = ejercicioRepository.findByNombreDescripcionImagen(
                ejercicio.getNombre(), ejercicio.getDescripcion(), ejercicio.getImagen());

        Long ejercicioId;
        if (ejercicioExistente == null) {
            ejercicioId = ejercicioRepository.crearEjercicio(ejercicio.getNombre(), ejercicio.getDescripcion(),
                    ejercicio.getImagen());
        } else {
            ejercicioId = ejercicioExistente.getId();
        }

        rutinaRepository.relacionarDiaEjercicioSeries(diaId, ejercicioId, orden, series, repeticiones);
    }

    public List<Ejercicio> search(String term) {
        return ejercicioRepository.search(term.toUpperCase());
    }

    public void etiquetarRutina(Rutina rutina, Long idEtiqueta) {
        rutinaRepository.etiquetarRutina(rutina.getId(), idEtiqueta);
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventos2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadosEnEventos2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadosEnAmigos2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository
                .sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadasEnRutinas2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadasEnRutinas2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public List<ScoreRutina> sugerenciasDeRutinasBasadasEnComunidades2(String nombreUsuario) {
        List<ScoreRutina> sugerencias = rutinaRepository.sugerenciasDeRutinasBasadasEnComunidades2(nombreUsuario);
        sugerencias
                .forEach(s -> System.out.println("Comunidad: " + s.getRutina().getId() + ", Score: " + s.getScore()));
        return sugerencias;
    }

    public Map<String, Object> obtenerTodasLasSugerenciasDeRutinasPaginadas(String nombreUsuario, int page,
            int pageSize) {
        // Obtener todas las sugerencias de comunidades desde las tres consultas
        List<ScoreRutina> sugerenciasEventos = rutinaRepository.sugerenciasDeRutinasBasadosEnEventos2(nombreUsuario);
        List<ScoreRutina> sugerenciasAmigos = rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos2(nombreUsuario);
        List<ScoreRutina> sugerenciasComunidades = rutinaRepository
                .sugerenciasDeRutinasBasadasEnComunidades2(nombreUsuario);
        List<ScoreRutina> sugerenciasRutinas = rutinaRepository.sugerenciasDeRutinasBasadasEnRutinas2(nombreUsuario);
        List<ScoreRutina> sugerenciasEventosPorEtiquetas = rutinaRepository
                .sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(nombreUsuario);

        // Combinar todas las sugerencias en una sola lista
        List<ScoreRutina> todasLasSugerencias = new ArrayList<>();
        todasLasSugerencias.addAll(sugerenciasAmigos);
        todasLasSugerencias.addAll(sugerenciasEventos);
        todasLasSugerencias.addAll(sugerenciasComunidades);
        todasLasSugerencias.addAll(sugerenciasRutinas);
        todasLasSugerencias.addAll(sugerenciasEventosPorEtiquetas);

        // Usar un Map para eliminar duplicados y sumar los scores de las comunidades
        Map<Long, ScoreRutina> mapaSugerencias = new HashMap<>();

        for (ScoreRutina scoreRutina : todasLasSugerencias) {
            // Si la comunidad ya existe en el mapa, sumar los scores
            mapaSugerencias.merge(scoreRutina.getRutina().getId(),
                    new ScoreRutina(scoreRutina.getRutina(), scoreRutina.getScore(), scoreRutina.getMotivo()),
                    (existente, nuevo) -> {
                        double nuevoScore = existente.getScore() + nuevo.getScore(); // Sumar scores
                        existente.setScore(nuevoScore); // Actualizar el score sumado
                        String nuevoMotivo = existente.getMotivo() + " --- " + nuevo.getMotivo();
                        existente.setMotivo(nuevoMotivo);
                        return existente; // Retornar el objeto existente actualizado
                    });
        }

        // Obtener la lista de ScoreComunidad sin duplicados con los scores sumados
        List<ScoreRutina> listaSugerenciasSinDuplicados = new ArrayList<>(mapaSugerencias.values());

        // Ordenar la lista por score en orden descendente
        listaSugerenciasSinDuplicados.sort((a, b) -> Double.compare(b.getScore(), a.getScore())); // Orden descendente
        int totalElementos = listaSugerenciasSinDuplicados.size();
        int totalPaginas = (int) Math.ceil((double) totalElementos / pageSize);
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

    public int obtenerDiasEnRutina(Long idRutina) {
        return rutinaRepository.obtenerDiasEnRutina(idRutina);
    }

    public List<Etiqueta> obtenerEtiquetasDeRutina(Long idRutina) {
        return etiquetaRepository.obtenerEtiquetasEnRutina(idRutina);
    }

    public Optional<RutinaDTO> getRutinaById(Long id) {
        Optional<Rutina> optionalRutina = rutinaRepository.findById(id);

        if (optionalRutina.isPresent()) {
            Rutina rutina = optionalRutina.get();
            RutinaDTO rutinaDTO = new RutinaDTO();
            rutinaDTO.setId(id);
            rutinaDTO.setNombre(rutina.getNombre());
            rutinaDTO.setDescripcion(rutina.getDescripcion());

            // Obtener los IDs de los días
            List<Long> diaIds = rutinaRepository.findDiasByRutina(id);
            List<DiaDTO> diasDTO = new ArrayList<>();

            for (Long diaId : diaIds) {
                // Crear un nuevo DiaDTO
                DiaDTO diaDTO = new DiaDTO();
                diaDTO.setId(diaId); // Establecer el ID del día

                // Obtener atributos del día
                String nombre = rutinaRepository.findNombreById(diaId);
                String descripcion = rutinaRepository.findDescripcionById(diaId);
                Integer orden = rutinaRepository.findOrdenById(diaId);

                // Establecer los atributos en el objeto DiaDTO
                diaDTO.setNombre(nombre);
                diaDTO.setDescripcion(descripcion);
                diaDTO.setOrden(orden);

                // Obtener los IDs de las relaciones "TIENE_EJERCICIO"
                List<Long> relacionIds = rutinaRepository.findRelacionEjercicioIdsByDia(diaId);

                // Inicializar listas para ejercicios de repeticiones y de tiempo
                List<EjercicioRepeticionesDTO> ejerciciosRepeticiones = new ArrayList<>();
                List<EjercicioTiempoDTO> ejerciciosTiempo = new ArrayList<>();

                for (Long relacionId : relacionIds) {
                    // Obtener el nombre y descripción del ejercicio
                    String ejercicioNombre = rutinaRepository.findEjercicioNombreByRelacionId(relacionId);
                    String ejercicioDescripcion = rutinaRepository.findEjercicioDescripcionByRelacionId(relacionId);
                    Integer ejercicioOrden = rutinaRepository.findEjercicioOrdenByRelacionId(relacionId);
                    String imagen = rutinaRepository.findImagenByRelacionId(relacionId);
                    // Obtener atributos adicionales
                    Integer repeticiones = rutinaRepository.findEjercicioRepeticionesByRelacionId(relacionId);
                    Integer series = rutinaRepository.findEjercicioSeriesByRelacionId(relacionId);
                    String tiempo = rutinaRepository.findEjercicioTiempoByRelacionId(relacionId);

                    // Diferenciar según el tipo de ejercicio
                    if (repeticiones != null) { // Ejercicio de repeticiones
                        EjercicioRepeticionesDTO ejercicioRepeticionesDTO = new EjercicioRepeticionesDTO();
                        ejercicioRepeticionesDTO.setNombre(ejercicioNombre);
                        ejercicioRepeticionesDTO.setDescripcion(ejercicioDescripcion);
                        ejercicioRepeticionesDTO.setOrden(ejercicioOrden);
                        ejercicioRepeticionesDTO.setRepeticiones(repeticiones);
                        ejercicioRepeticionesDTO.setSeries(series);
                        ejercicioRepeticionesDTO.setImagen(imagen);
                        ejerciciosRepeticiones.add(ejercicioRepeticionesDTO);
                    } else if (tiempo != null) { // Ejercicio de tiempo
                        EjercicioTiempoDTO ejercicioTiempoDTO = new EjercicioTiempoDTO();
                        ejercicioTiempoDTO.setNombre(ejercicioNombre);
                        ejercicioTiempoDTO.setDescripcion(ejercicioDescripcion);
                        ejercicioTiempoDTO.setOrden(ejercicioOrden);
                        ejercicioTiempoDTO.setTiempo(tiempo);
                        ejercicioTiempoDTO.setImagen(imagen);
                        ejerciciosTiempo.add(ejercicioTiempoDTO);
                    }
                }

                // Establecer las listas de ejercicios en el DiaDTO
                diaDTO.setEjerciciosRepeticiones(ejerciciosRepeticiones);
                diaDTO.setEjerciciosTiempo(ejerciciosTiempo);
                diasDTO.add(diaDTO);
            }

            rutinaDTO.setDias(diasDTO);
            return Optional.of(rutinaDTO);
        } else {
            return Optional.empty();
        }
    }

    public List<Rutina> rutinasEtiquetas(List<String> etiquetas, String tipo, Long usuarioId) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return rutinaRepository.rutinasEtiquetasDisponible(usuarioId, etiquetas);
        } else if ("realizaRutina".equalsIgnoreCase(tipo)) {
            return rutinaRepository.rutinasEtiquetasRealizaRutina(usuarioId, etiquetas);
        } else {
            return rutinaRepository.rutinasEtiquetas(etiquetas);
        }
    }

    public List<Rutina> rutinasNombre(String nombre, String tipo, Long usuarioId) {
        if ("disponibles".equalsIgnoreCase(tipo)) {
            return rutinaRepository.rutinasNombreDisponibles(nombre, usuarioId);
        } else if ("realizaRutina".equalsIgnoreCase(tipo)) {
            return rutinaRepository.rutinasNombreRealizaRutina(nombre, usuarioId);
        } else {
            return rutinaRepository.rutinasNombre(nombre);
        }
    }

    public List<Rutina> rutinasCreadasPorUsuario(Long idUsuario, int offset, int limit) {
        return rutinaRepository.rutinasCreadasPorUsuario(idUsuario, offset, limit);
    }

    public List<RutinaDTO> rutinasRealizaUsuarioSinPaginacion(Long idUsuario) {
        List<Rutina> rutinas = rutinaRepository.rutinasRealizaUsuarioSinPaginacion(idUsuario);

        // Filtrar rutinas que no cumplen las condiciones
        rutinas.removeIf(rutina -> {
            if (!diaRepository.verificarRelacionDiaFinalizado(rutina.getId(), idUsuario)) {
                return true;
            }
            Long idUltimoDia = diaRepository.obtenerUltimoDiaDeRutina(rutina.getId());
            Long idDiaActual = diaRepository.obtenerProgresoActual(rutina.getId(), idUsuario);
            return idUltimoDia.equals(idDiaActual);
        });

        // Convertir las rutinas filtradas en DTOs
        List<RutinaDTO> rutinaDTOs = new ArrayList<>();
        for (Rutina rutina : rutinas) {
            RutinaDTO rutinaDTO = new RutinaDTO();
            rutinaDTO.setId(rutina.getId());
            rutinaDTO.setNombre(rutina.getNombre());
            rutinaDTO.setDescripcion(rutina.getDescripcion());

            // Obtener el ID del día actual
            Long idDiaActual = diaRepository.obtenerProgresoActual(rutina.getId(), idUsuario);

            // Llamar al método obtenerFechaFinRelacionMayorOrden y procesar la fecha
            Optional<String> fechaFinOptional = rutinaRepository.obtenerFechaFinRelacionMayorOrden(idUsuario,
                    idDiaActual);
            boolean hizoUltimoDiaHoy = false;

            if (fechaFinOptional.isPresent()) {
                OffsetDateTime fechaFin = OffsetDateTime.parse(fechaFinOptional.get());
                LocalDate fechaFinLocalDate = fechaFin.toLocalDate();

                if (fechaFinLocalDate.equals(LocalDate.now())) {
                    hizoUltimoDiaHoy = true;
                }
            }

            // Asignar el valor booleano al DTO
            rutinaDTO.setHizoUltimoDiaHoy(hizoUltimoDiaHoy);

            // Obtener y procesar los días asociados a la rutina
            List<Long> diaIds = rutinaRepository.findDiasByRutina(rutina.getId());
            List<DiaDTO> diasDTO = new ArrayList<>();

            // Ordenar los días por el campo 'orden'
            diaIds.sort(Comparator.comparingLong(diaId -> rutinaRepository.findOrdenById(diaId)));

            // Filtrar la lista de días para que contenga solo los días desde el día
            // siguiente al día actual
            boolean diaActualEncontrado = false;
            for (Long diaId : diaIds) {
                if (diaActualEncontrado) {
                    DiaDTO diaDTO = new DiaDTO();
                    diaDTO.setId(diaId);

                    // Obtener atributos del día
                    String nombreDia = rutinaRepository.findNombreById(diaId);
                    String descripcionDia = rutinaRepository.findDescripcionById(diaId);
                    Integer ordenDia = rutinaRepository.findOrdenById(diaId);

                    diaDTO.setNombre(nombreDia);
                    diaDTO.setDescripcion(descripcionDia);
                    diaDTO.setOrden(ordenDia);

                    // Procesar ejercicios relacionados con el día
                    List<Long> relacionIds = rutinaRepository.findRelacionEjercicioIdsByDia(diaId);
                    List<EjercicioRepeticionesDTO> ejerciciosRepeticiones = new ArrayList<>();
                    List<EjercicioTiempoDTO> ejerciciosTiempo = new ArrayList<>();

                    // Ordenar los ejercicios dentro de cada día por el campo 'orden'
                    relacionIds.sort(Comparator
                            .comparingLong(relacionId -> rutinaRepository.findEjercicioOrdenByRelacionId(relacionId)));

                    for (Long relacionId : relacionIds) {
                        String ejercicioNombre = rutinaRepository.findEjercicioNombreByRelacionId(relacionId);
                        String ejercicioDescripcion = rutinaRepository.findEjercicioDescripcionByRelacionId(relacionId);
                        Integer ejercicioOrden = rutinaRepository.findEjercicioOrdenByRelacionId(relacionId);
                        String imagen = rutinaRepository.findImagenByRelacionId(relacionId);

                        Integer repeticiones = rutinaRepository.findEjercicioRepeticionesByRelacionId(relacionId);
                        Integer series = rutinaRepository.findEjercicioSeriesByRelacionId(relacionId);
                        String tiempo = rutinaRepository.findEjercicioTiempoByRelacionId(relacionId);

                        if (repeticiones != null) {
                            EjercicioRepeticionesDTO ejercicioRepeticionesDTO = new EjercicioRepeticionesDTO();
                            ejercicioRepeticionesDTO.setNombre(ejercicioNombre);
                            ejercicioRepeticionesDTO.setDescripcion(ejercicioDescripcion);
                            ejercicioRepeticionesDTO.setOrden(ejercicioOrden);
                            ejercicioRepeticionesDTO.setRepeticiones(repeticiones);
                            ejercicioRepeticionesDTO.setSeries(series);
                            ejercicioRepeticionesDTO.setImagen(imagen);
                            ejerciciosRepeticiones.add(ejercicioRepeticionesDTO);
                        } else if (tiempo != null) {
                            EjercicioTiempoDTO ejercicioTiempoDTO = new EjercicioTiempoDTO();
                            ejercicioTiempoDTO.setNombre(ejercicioNombre);
                            ejercicioTiempoDTO.setDescripcion(ejercicioDescripcion);
                            ejercicioTiempoDTO.setOrden(ejercicioOrden);
                            ejercicioTiempoDTO.setTiempo(tiempo);
                            ejercicioTiempoDTO.setImagen(imagen);
                            ejerciciosTiempo.add(ejercicioTiempoDTO);
                        }
                    }

                    diaDTO.setEjerciciosRepeticiones(ejerciciosRepeticiones);
                    diaDTO.setEjerciciosTiempo(ejerciciosTiempo);
                    diasDTO.add(diaDTO);
                } else if (diaId.equals(idDiaActual)) {
                    // Saltamos el día actual y comenzamos a agregar los días siguientes
                    diaActualEncontrado = true;
                }
            }

            rutinaDTO.setDias(diasDTO);
            rutinaDTOs.add(rutinaDTO);
        }

        return rutinaDTOs;
    }

    public List<Rutina> rutinasRealizaUsuario(Long idUsuario, String nombreRutina, int page, int size) {
        String filtroNombre = (nombreRutina == null || nombreRutina.trim().isEmpty()) ? "" : nombreRutina;
        List<Rutina> rutinas = rutinaRepository.rutinasRealizaUsuario(idUsuario, filtroNombre);

        for (Iterator<Rutina> iterator = rutinas.iterator(); iterator.hasNext();) {
            Rutina rutina = iterator.next();
            if (!diaRepository.verificarRelacionDiaFinalizado(rutina.getId(), idUsuario)) {
                iterator.remove();
            }
        }

        for (Iterator<Rutina> iterator = rutinas.iterator(); iterator.hasNext();) {
            Rutina rutina = iterator.next(); // Obtienes la rutina actual
            Long idUltimoDia = diaRepository.obtenerUltimoDiaDeRutina(rutina.getId());
            Long idDiaActual = diaRepository.obtenerProgresoActual(rutina.getId(), idUsuario);
            if (idUltimoDia.equals(idDiaActual)) {
                iterator.remove();
            }
        }

        // Paginar la lista
        int start = page * size;
        int end = Math.min(start + size, rutinas.size());

        if (start > end) {
            return Collections.emptyList(); // Si la página está fuera de rango
        }
        return rutinas.subList(start, end);
    }

    public List<Rutina> obtenerRutinasDisponiblesPaginadas(Long idUsuario, int page, int size) {
        List<Rutina> rutinas = rutinaRepository.findAll();

        // Filtrar las rutinas que no cumplen las condiciones
        rutinas.removeIf(rutina -> {
            if (diaRepository.verificarRelacionDiaFinalizado(rutina.getId(), idUsuario)) {
                Long idUltimoDia = diaRepository.obtenerUltimoDiaDeRutina(rutina.getId());
                Long idDiaActual = diaRepository.obtenerProgresoActual(rutina.getId(), idUsuario);
                return !idUltimoDia.equals(idDiaActual); // Eliminar si no coincide
            }
            return false; // Mantener si no cumple verificarRelacionDiaFinalizado
        });

        // Paginar la lista
        int start = page * size;
        int end = Math.min(start + size, rutinas.size());

        if (start >= rutinas.size()) {
            return Collections.emptyList(); // Si la página está fuera de rango
        }
        return rutinas.subList(start, end);
    }

    public Long obtenerProgresoActual(Long rutinaId, Long usuarioId) {
        if (!diaRepository.verificarRelacionDiaFinalizado(rutinaId, usuarioId)
                || !rutinaRepository.existeRelacionEntreUsuarioYRutina(rutinaId, usuarioId)) {
            return (long) -1;
        }
        return diaRepository.obtenerProgresoActual(rutinaId, usuarioId);
    }

    public void cambiarEstadoFavorita(Long idRutina, Long idUsuario) {
        if (rutinaRepository.esFavorita(idRutina, idUsuario)) {
            rutinaRepository.eliminarComoFavorita(idRutina, idUsuario);
        } else {
            rutinaRepository.marcarComoFavorita(idRutina, idUsuario);
        }
    }

    public boolean esFavorita(Long idRutina, Long idUsuario) {
        return rutinaRepository.esFavorita(idRutina, idUsuario);
    }

    public List<Rutina> rutinasFavoritas(Long idUsuario, String nombreRutina, int page, int size) {
        int skip = page * size; // Cálculo de los resultados a omitir
        String filtroNombre = (nombreRutina == null || nombreRutina.trim().isEmpty()) ? "" : nombreRutina;
        return rutinaRepository.listaFavoritas(idUsuario, filtroNombre, skip, size);
    }
}