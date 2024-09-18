package unpsjb.labprog.backend.business;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Usuario;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> amigos(String nombreUsuario){
        return usuarioRepository.amigos(nombreUsuario);
    }

    public List<Usuario> amigosDeAmigos(String nombreUsuario){
        return usuarioRepository.amigosDeAmigos(nombreUsuario);
    }

    public List<Usuario> sugerenciasPorAmigosEnComun(String nombreUsuario){
        return usuarioRepository.sugerenciasPorAmigosEnComun(nombreUsuario);
    }
    public List<Usuario> sugerenciaDeAmigosBasadasEnAmigos(String nombreUsuario){
        return usuarioRepository.sugerenciaDeAmigosBasadaEnAmigos(nombreUsuario);
    }

    public List<Usuario> sugerenciaDeAmigosBasadosEnEventos(String nombreUsuario){
        return usuarioRepository.sugerenciasDeAmigosBasadosEnEventos(nombreUsuario);
    }

    @Transactional
    public Usuario save(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    @Transactional
    public void deleteById(Long id) {
        usuarioRepository.deleteById(id);
    }    

    public Usuario findById(Long id){
        return usuarioRepository.findById(id).orElse(null);
    }

}

