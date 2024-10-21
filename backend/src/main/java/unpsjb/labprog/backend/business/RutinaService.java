package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Dia;
import unpsjb.labprog.backend.model.Ejercicio;
import unpsjb.labprog.backend.model.Rutina;

@Service
public class RutinaService {

    @Autowired
    RutinaRepository rutinaRepository;

    @Autowired
    DiaRepository diaRepository;

    @Autowired
    EjercicioRepository ejercicioRepository;

    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }

    public List<Rutina> sugerenciasDeRutinasBasadosEnAmigos(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos(nombreUsuario);
    }

    @Transactional
    public Rutina saveConCreador(Rutina rutina, Long usuarioId) throws Exception {
        return rutinaRepository.saveConCreador(rutina.getNombre(), rutina.getDescripcion(), usuarioId);
    }

    @Transactional
    public Rutina save(Rutina rutina) throws Exception {
        if (rutina.getNombre() == null) {
            throw new Exception("La rutina debe tener nombre");
        }

        // if rutina no tiene ejercicios

        return rutinaRepository.save(rutina);
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

    public Long guardarRutina(Rutina rutina) {
        return rutinaRepository.save(rutina).getId();
    }

    @Transactional
    public Long guardarDia(Long rutinaId, Dia dia, int orden) {
        Long diaId = diaRepository.crearDia(dia.getNombre(), dia.getDescripcion());
        rutinaRepository.relacionarRutinaDia(rutinaId, diaId, orden);
        return diaId;
    }

    @Transactional
    public void guardarEjercicioResistencia(Long diaId, Ejercicio ejercicio, int orden, String tiempo) {
        // Intentamos recuperar el ejercicio existente.
        Ejercicio ejercicioExistente = ejercicioRepository.findByNombre(ejercicio.getNombre());

        Long ejercicioId;
        if (ejercicioExistente == null) {
            // Si no existe, se crea uno nuevo.
            ejercicioId = ejercicioRepository.crearEjercicio(ejercicio.getNombre(), ejercicio.getDescripcion());
        } else {
            // Si existe, usamos el ID del ejercicio encontrado.
            ejercicioId = ejercicioExistente.getId();
        }

        // Relacionamos el día con el ejercicio correspondiente.
        rutinaRepository.relacionarDiaEjercicioResistencia(diaId, ejercicioId, orden, tiempo);
    }

    @Transactional
    public void guardarEjercicioSeries(Long diaId, Ejercicio ejercicio, int orden, int series, int repeticiones) {
        if (ejercicioRepository.existeNombre(ejercicio.getNombre())) {
            Ejercicio ejercicioExistente = ejercicioRepository.findByNombre(ejercicio.getNombre());
            rutinaRepository.relacionarDiaEjercicioSeries(diaId, ejercicioExistente.getId(), orden, series,
                    repeticiones);
        } else {
            Long ejercicioId = ejercicioRepository.crearEjercicio(ejercicio.getNombre(), ejercicio.getDescripcion());
            rutinaRepository.relacionarDiaEjercicioSeries(diaId, ejercicioId, orden, series, repeticiones);
        }
    }

    public List<Ejercicio> search(String term) {
        return ejercicioRepository.search(term.toUpperCase());
    }

    public void etiquetarRutina(Rutina rutina, Long idEtiqueta) {
        rutinaRepository.etiquetarRutina(rutina.getId(), idEtiqueta);
    }

}