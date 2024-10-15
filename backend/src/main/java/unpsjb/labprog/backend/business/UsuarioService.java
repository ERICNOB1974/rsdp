package unpsjb.labprog.backend.business;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Evento;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class UsuarioService {

    @Autowired
    UsuarioRepository usuarioRepository;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public List<Usuario> amigos(String nombreUsuario) {
        return usuarioRepository.amigos(nombreUsuario);
    }

    public List<Usuario> solicitudes(String nombreUsuario) {
        return usuarioRepository.solicitudesDeAmistad(nombreUsuario);
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
        Set<Usuario> setUsuarios=new HashSet<Usuario>();
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

    public List<Usuario> findByNombreUsuario(Evento e) {
        return usuarioRepository.inscriptosEvento(e.getId());
    }

}
