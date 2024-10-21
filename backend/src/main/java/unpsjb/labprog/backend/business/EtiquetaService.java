package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import unpsjb.labprog.backend.model.Etiqueta;
import unpsjb.labprog.backend.model.DTO.EtiquetaPopularidadDTO;

@Service
public class EtiquetaService {

    @Autowired
    EtiquetaRepository etiquetaRepository;

    public List<Etiqueta> findAll() {
        return etiquetaRepository.findAll();
    }

    @Transactional
    public Etiqueta save(Etiqueta etiqueta) {
        return etiquetaRepository.save(etiqueta);
    }

    @Transactional
    public void deleteById(Long id) {
        etiquetaRepository.deleteById(id);
    }

    public Etiqueta findById(Long id) {
        return etiquetaRepository.findById(id).orElse(null);
    }

    public List<EtiquetaPopularidadDTO> search(String term) {
        List<EtiquetaPopularidadDTO> resultados = etiquetaRepository.search(term);

        for (EtiquetaPopularidadDTO resultado : resultados){
            if (resultado.getNombre().equals(term)){
                return resultados;
            }
        }

        EtiquetaPopularidadDTO etiquetaPorDefecto = new EtiquetaPopularidadDTO();
        etiquetaPorDefecto.setNombre(term); // Establecer el nombre ingresado
        etiquetaPorDefecto.setPopularidad(0L); // Establecer popularidad a 0
        resultados.add(etiquetaPorDefecto);

        return resultados;
    }

    @PostMapping
    public Etiqueta crearEtiqueta(@RequestBody Etiqueta etiqueta) {
        return etiquetaRepository.save(etiqueta);
    }

    public boolean existeEtiqueta(String nombre) {
        return etiquetaRepository.existsByNombre(nombre);
    }

}
