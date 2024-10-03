package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Rutina;

@Service
public class RutinaService {

    @Autowired
    RutinaRepository rutinaRepository;

    public List<Rutina> findAll() {
        return rutinaRepository.findAll();
    }


    public List<Rutina> sugerenciasDeRutinasBasadosEnAmigos(String nombreUsuario) {
        return rutinaRepository.sugerenciasDeRutinasBasadosEnAmigos(nombreUsuario);
    }


    @Transactional
    public Rutina save(Rutina rutina) {
        if(rutina.getNombre()==null){

        }

        //if rutina no tiene ejercicios

        return rutinaRepository.save(rutina);
    }

    @Transactional
    public void deleteById(Long id) {
        rutinaRepository.deleteById(id);
    }

    public Rutina findById(Long id){
        return rutinaRepository.findById(id).orElse(null);
    }

    public List<Rutina> sugerenciasDeRutinasBasadasEnRutinas(String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadasEnRutinas(nombreUsuario);
    }

    public List<Rutina> sugerenciasDeRutinasBasadasEnComunidades(String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadasEnComunidades(nombreUsuario);
    }

    public List<Rutina> sugerenciaDeRutinasBasadosEnEventos (String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadosEnEventos(nombreUsuario);
    }
    public List<Rutina> sugerenciasDeRutinasBasadosEnEventosPorEtiqueta (String nombreUsuario){
        return rutinaRepository.sugerenciasDeRutinasBasadosEnEventosPorEtiqueta(nombreUsuario);
    }

}