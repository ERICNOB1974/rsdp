package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Publicacion;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class PublicacionService {
    @Autowired
    PublicacionRepository publicacionRepository;
    @Autowired
    UsuarioRepository usuarioRepository;

    @Transactional
    public Publicacion save(Publicacion publicacion, Long idUsuario) {
        Usuario u=usuarioRepository.findById(idUsuario).get();
        Publicacion p=publicacionRepository.save(publicacion);
        publicacionRepository.establecerCreador(publicacion, u);
        return p;
    }

    public Publicacion findById(Long id) {
        return publicacionRepository.findById(id).orElse(null);
    }
}
