package unpsjb.labprog.backend.presenter;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import unpsjb.labprog.backend.Response;
import unpsjb.labprog.backend.business.RutinaDTO;
import unpsjb.labprog.backend.business.RutinaService;
import unpsjb.labprog.backend.business.ScoreRutina;
import unpsjb.labprog.backend.model.Rutina;
import unpsjb.labprog.backend.model.DTO.EjercicioResistenciaDTO;
import unpsjb.labprog.backend.model.DTO.EjercicioSeriesDTO;
import unpsjb.labprog.backend.model.DTO.RutinaCompletaDTO;

@RestController
@RequestMapping("rutinas")
public class RutinaPresenter {

    @Autowired
    RutinaService rutinaService;

    @GetMapping("/findAll")
    public ResponseEntity<Object> findAll() {
        return Response.ok(rutinaService.findAll());
    }

    @GetMapping("/sugerenciasDeRutinasBasadosEnAmigos/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasDeRutinasBasadosEnAmigos(@PathVariable String nombreUsuario) {
        List<Rutina> rutinasDeAmigos = rutinaService.sugerenciasDeRutinasBasadosEnAmigos(nombreUsuario);
        return Response.ok(rutinasDeAmigos);
    }

    @RequestMapping(path = "/create/{usuarioId}", method = RequestMethod.POST)
    public Long createConCreador(@RequestBody Rutina rutina, @PathVariable Long usuarioId) throws Exception {
        return rutinaService.saveConCreador(rutina, usuarioId);
    }

    @RequestMapping(path = "/crearRelacionRealizaRutina/{rutinaId}/{usuarioId}", method = RequestMethod.POST)
    public Long crearRelacionRealizaRutina(@PathVariable Long rutinaId, @PathVariable Long usuarioId) throws Exception {
        return rutinaService.crearRelacionRealizaRutina(rutinaId, usuarioId);
    }

    @RequestMapping(path = "/crearRelacionDiaFinalizado/{diaId}/{usuarioId}", method = RequestMethod.POST)
    public Long crearRelacionDiaFinalizado(@PathVariable Long diaId, @PathVariable Long usuarioId) throws Exception {
        return rutinaService.crearRelacionDiaFinalizado(diaId, usuarioId);
    }

    @RequestMapping(path = "/verificarDiaFinalizado/{diaId}/{usuarioId}", method = RequestMethod.GET)
    public boolean verificarDiaFinalizado(@PathVariable Long diaId, @PathVariable Long usuarioId) throws Exception {
        return rutinaService.verificarDiaFinalizado(diaId, usuarioId);
    }

    @RequestMapping(path = "/create", method = RequestMethod.POST)
    public ResponseEntity<Object> create(@RequestBody Rutina rutina) throws Exception {
        return Response.ok(rutinaService.save(rutina));
    }

    @PostMapping
    public Long guardarRutina(@RequestBody Rutina rutina) {
        return rutinaService.guardarRutina(rutina);
    }

    @GetMapping("/findById/{id}")
    public ResponseEntity<Object> findById(@PathVariable Long id) {
        return Response.ok(rutinaService.findById(id));
    }

    @GetMapping("/{id}/ejercicios")
    public ResponseEntity<Object> ejercicios(@PathVariable Long id) {
        return Response.ok(rutinaService.ejercicios(id));
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnRutinas/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnRutinas(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciasDeRutinasBasadasEnRutinas(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnComunidades/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnComunidades(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciasDeRutinasBasadasEnComunidades(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnEventos/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnEventos(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciaDeRutinasBasadosEnEventos(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    @GetMapping("/sugerenciasDeRutinasBasadosEnEventosPorEtiqueta/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(@PathVariable String nombreUsuario) {
        List<Rutina> amigosDeAmigos = rutinaService.sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(nombreUsuario);
        return Response.ok(amigosDeAmigos);
    }

    // @PostMapping("/dias/{rutinaId}")
    // public Long guardarDia(@PathVariable Long rutinaId, @RequestBody DiaDTO
    // diaDTO) {
    // return rutinaService.guardarDia(rutinaId, diaDTO.getDia(),
    // diaDTO.getOrden());
    // }

    @PostMapping("/guardarRutinaCompleta/{usuarioId}")
    public ResponseEntity<Object> guardarRutinaCompleta(@PathVariable Long usuarioId,
            @RequestBody RutinaCompletaDTO rutinaCompletaDTO) {
        try {
            return Response.ok(rutinaService.guardarRutinaCompleta(rutinaCompletaDTO, usuarioId));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error al guardar la rutina"));
        }
    }

    @PostMapping("/dias/ejerciciosResistencia/{diaId}")
    public void guardarEjercicioResistencia(@PathVariable Long diaId,
            @RequestBody EjercicioResistenciaDTO ejercicioResistenciaDTO) {
        rutinaService.guardarEjercicioResistencia(diaId, ejercicioResistenciaDTO.getEjercicio(),
                ejercicioResistenciaDTO.getOrden(), ejercicioResistenciaDTO.getTiempo());
    }

    @PostMapping("/dias/ejerciciosSeries/{diaId}")
    public void guardarEjercicioSeries(@PathVariable Long diaId, @RequestBody EjercicioSeriesDTO ejercicioSeriesDTO) {
        rutinaService.guardarEjercicioSeries(diaId, ejercicioSeriesDTO.getEjercicio(), ejercicioSeriesDTO.getOrden(),
                ejercicioSeriesDTO.getSeries(), ejercicioSeriesDTO.getRepeticiones());
    }

    @RequestMapping(value = "/search/{term}", method = RequestMethod.GET)
    public ResponseEntity<Object> search(@PathVariable("term") String term) {
        return Response.ok(rutinaService.search(term));
    }

    @PostMapping("/etiquetar/{idEtiqueta}")
    public ResponseEntity<Object> etiquetarRutina(@RequestBody Rutina rutina, @PathVariable Long idEtiqueta) {
        if (rutina == null || idEtiqueta == null) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("error", "Rutina o idEtiqueta no pueden ser nulos"));
        }
        try {
            rutinaService.etiquetarRutina(rutina, idEtiqueta);
            return ResponseEntity.ok(Collections.singletonMap("message", "ok"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.singletonMap("error", "Error al etiquetar la rutina"));
        }
    }

    @GetMapping("/sugerenciasDeRutinasBasadosEnEventos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnEventos2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventos = rutinaService
                .sugerenciasDeRutinasBasadosEnEventos2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadosEnEventos);
    }

    @GetMapping("/sugerenciasDeRutinasBasadosEnAmigos2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnAmigos2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadosEnAmigos = rutinaService
                .sugerenciasDeRutinasBasadosEnAmigos2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadosEnAmigos);
    }

    @GetMapping("/sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta = rutinaService
                .sugerenciasDeRutinasBasadosEnEventosPorEtiqueta2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadosEnEventosPorEtiqueta);
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnRutinas2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnRutinas2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadasEnRutinas = rutinaService
                .sugerenciasDeRutinasBasadasEnRutinas2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadasEnRutinas);
    }

    @GetMapping("/sugerenciasDeRutinasBasadasEnComunidades2/{nombreUsuario}")
    public ResponseEntity<Object> sugerenciasDeRutinasBasadasEnComunidades2(@PathVariable String nombreUsuario) {
        List<ScoreRutina> sugerenciasDeRutinasBasadasEnComunidades = rutinaService
                .sugerenciasDeRutinasBasadasEnComunidades2(nombreUsuario);
        return Response.ok(sugerenciasDeRutinasBasadasEnComunidades);
    }

    @GetMapping("/sugerencias-combinadas/{nombreUsuario}")
    public ResponseEntity<Object> obtenerSugerenciasCombinadas(
            @PathVariable String nombreUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "4") int size) {
        try {
            // Llamar al servicio que devuelve los eventos y el total de páginas
            Map<String, Object> result = rutinaService.obtenerTodasLasSugerenciasDeRutinasPaginadas(nombreUsuario,
                    page, size);

            // Verificar si el resultado contiene datos y total de páginas
            if (result.isEmpty()) {
                return Response.error("", "No se encontraron sugerencias para los parámetros proporcionados.");
            }
            // Retornar los eventos y el total de páginas en el ResponseEntity
            return Response.ok(result);
        } catch (Exception e) {
            // Manejo del error
            return Response.error("", "Error al obtener las sugerencias: " + e.getMessage());
        }
    }

    @GetMapping("/obtenerDiasEnRutina/{idRutina}")
    public ResponseEntity<Object> obtenerDiasEnRutina(@PathVariable Long idRutina) {
        return Response.ok(rutinaService.obtenerDiasEnRutina(idRutina));
    }

    @GetMapping("/etiquetas/{idRutina}")
    public ResponseEntity<Object> obtenerEtiquetasDeRutina(@PathVariable Long idRutina) {
        return Response.ok(rutinaService.obtenerEtiquetasDeRutina(idRutina));
    }

    @GetMapping("/rutina/{idRutina}")
    public ResponseEntity<Object> getRutinaById(@PathVariable Long idRutina) {
        try {
            Optional<RutinaDTO> rutinaDTO = rutinaService.getRutinaById(idRutina);

            if (rutinaDTO.isPresent()) {
                return Response.ok(rutinaDTO.get()); // Rutina encontrada
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND) // Rutina no encontrada
                        .body("Rutina no encontrada con el ID: " + idRutina);
            }
        } catch (Exception e) {
            // Manejo del error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR) // Error interno
                    .body("Error al obtener las sugerencias: " + e.getMessage());
        }
    }

    @GetMapping("/filtrar/etiquetas")
    public ResponseEntity<Object> eventosPorEtiquetas(@RequestParam List<String> etiquetas,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long usuarioId) {
        return Response.ok(rutinaService.rutinasEtiquetas(etiquetas, tipo, usuarioId));
    }

    @GetMapping("/filtrar/nombre")
    public ResponseEntity<Object> rutinasPorNombre(
            @RequestParam String nombre,
            @RequestParam(required = false) String tipo,
            @RequestParam(required = false) Long usuarioId) {
        return Response.ok(rutinaService.rutinasNombre(nombre, tipo, usuarioId));
    }

    @GetMapping("/rutinasCreadasPorUsuario/{idUsuario}")
    public ResponseEntity<Object> rutinasCreadasPorUsuario(@PathVariable Long idUsuario, @RequestParam int offset,
            @RequestParam int limit) {
        List<Rutina> rutinasCreadasPorUsuario = rutinaService.rutinasCreadasPorUsuario(idUsuario, offset, limit);
        return Response.ok(rutinasCreadasPorUsuario);
    }

    @GetMapping("/rutinasRealizaUsuario/{idUsuario}")
    public ResponseEntity<Object> rutinasRealizaUsuario(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String nombreRutina) {

        // Llamamos al servicio para obtener las rutinas filtradas por nombre y usuario
        List<Rutina> rutinasRealizaUsuario = rutinaService.rutinasRealizaUsuario(idUsuario, nombreRutina, page, size);

        // Devolvemos las rutinas en formato de respuesta
        return Response.ok(rutinasRealizaUsuario);
    }

    @GetMapping("/rutinasRealizaUsuarioSinPaginacion/{idUsuario}")
    public ResponseEntity<Object> rutinasRealizaUsuarioSinPaginacion(
            @PathVariable Long idUsuario) {

        List<RutinaDTO> rutinasRealizaUsuario = rutinaService.rutinasRealizaUsuarioSinPaginacion(idUsuario);

        // Devolvemos las rutinas en formato de respuesta
        return Response.ok(rutinasRealizaUsuario);
    }

    @GetMapping("/obtenerProgresoActual/{rutinaId}/{usuarioId}")
    public ResponseEntity<Object> obtenerProgresoActual(@PathVariable Long rutinaId, @PathVariable Long usuarioId) {
        return Response.ok(rutinaService.obtenerProgresoActual(rutinaId, usuarioId));
    }

    @GetMapping(path = "/{idUsuario}/disponibles")
    public ResponseEntity<Object> obtenerRutinasDisponibles(@PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        return Response.ok(rutinaService.obtenerRutinasDisponiblesPaginadas(idUsuario, page, size));
    }

    @PostMapping("/cambiarFavorito/{idUsuario}/{idRutina}")
    public ResponseEntity<Object> cabiarEstadoFavorita(@PathVariable Long idUsuario,
            @PathVariable Long idRutina) {
        rutinaService.cambiarEstadoFavorita(idRutina, idUsuario);
        return Response.ok("Rutina marcada/desmarcada como favorita");
    }

    @GetMapping("/esFavorita/{idUsuario}/{idRutina}")
    public ResponseEntity<Object> esFavorita(@PathVariable Long idUsuario,
            @PathVariable Long idRutina) {
        return Response.ok(rutinaService.esFavorita(idRutina, idUsuario));
    }

    @GetMapping("/rutinasFavoritas/{idUsuario}")
    public ResponseEntity<Object> listaComunidadesFavoritas(@PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String nombreRutina) {
        List<Rutina> rutinas = rutinaService.rutinasFavoritas(idUsuario, nombreRutina, page, size);
        return Response.ok(rutinas);
    }

    @RequestMapping(path = "/rutinasCreadasPorUsuarioFiltradas/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> rutinasCreadasPorUsuarioFiltradas(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String nombreRutina) {
        return Response.ok(rutinaService.rutinasCreadasPorUsuarioFiltradas(idUsuario, nombreRutina, page, size));
    }

    @RequestMapping(path = "/busquedaRutinasDisponiblesUsuarioGoogle/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> busquedaComunidadesDisponiblesUsuarioGoogle(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String termino) {
        return Response
                .ok(rutinaService.busquedaRutinasDisponiblesUsuarioGoogle(idUsuario, termino, page, size));
    }

    @RequestMapping(path = "/busquedaRutinasCreadasUsuarioGoogle/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> busquedaRutinasCreadasUsuarioGoogle(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String termino) {
        return Response
                .ok(rutinaService.busquedaRutinasCreadasUsuarioGoogle(idUsuario, termino, page, size));
    }

    @RequestMapping(path = "/busquedaRutinasRealizaUsuarioGoogle/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> busquedaRutinasRealizaUsuarioGoogle(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String termino) {
        return Response
                .ok(rutinaService.busquedaRutinasRealizaUsuarioGoogle(idUsuario, termino, page, size));
    }
    @RequestMapping(path = "/busquedaRutinasFavoritasUsuarioGoogle/{idUsuario}", method = RequestMethod.GET)
    public ResponseEntity<Object> busquedaRutinasFavoritasUsuarioGoogle(
            @PathVariable Long idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false, defaultValue = "") String termino) {
        return Response
                .ok(rutinaService.busquedaRutinasFavoritasUsuarioGoogle(idUsuario, termino, page, size));
    }
}