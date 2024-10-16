package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Publicacion;

@Service
public class PublicacionService {
    @Autowired
    PublicacionRepository publicacionRepository;
    @Autowired
    UsuarioRepository usuarioRepository;

    @Transactional
    public Publicacion save(Publicacion publicacion, Long idUsuario) {
        Publicacion p = publicacionRepository.save(publicacion);
        if (p.getId() != null) {
            publicacionRepository.establecerCreador(idUsuario, p.getId());
        } else {
            System.out.println("MEMATO");
        }
        return p;
    }

    public Publicacion findById(Long id) {
        return publicacionRepository.findById(id).orElse(null);
    }
}
