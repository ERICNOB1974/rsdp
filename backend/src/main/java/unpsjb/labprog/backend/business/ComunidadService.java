package unpsjb.labprog.backend.business;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Comunidad;

@Service
public class ComunidadService {

    @Autowired
    ComunidadRepository comunidadRepository;
    @Autowired
    UsuarioRepository usuarioRepository;

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
        return comunidadRepository.save(comunidad);
    }

    @Transactional
    public void deleteById(Long id) {
        comunidadRepository.deleteById(id);
    }

    public Comunidad findById(Long id) {
        return comunidadRepository.findById(id).orElse(null);
    }

    public List<Comunidad> todasLasSugerencias(String nombreUsuario) {
        List<Comunidad> sugerencias = comunidadRepository.sugerenciasDeComunidadesBasadasEnAmigos(nombreUsuario);
        sugerencias.addAll(comunidadRepository.sugerenciasDeComunidadesBasadasEnEventos(nombreUsuario));
        sugerencias.addAll(comunidadRepository.sugerenciasDeComunidadesBasadasEnComunidades(nombreUsuario));
        Set<Comunidad> setUsuarios = new HashSet<Comunidad>();
        setUsuarios.addAll(sugerencias);
        sugerencias.removeAll(sugerencias);
        sugerencias.addAll(setUsuarios);
        return sugerencias;
    }

    public void etiquetarComunidad(Comunidad comunidad, Long etiqueta) {
        comunidadRepository.etiquetarComunidad(comunidad.getId(), etiqueta);
    }

    /*
     * esto tambien esta en UsuarioComunidadServce ver donde lo dejamos
     */
    public String verEstado(Long idComunidad, Long idUsuario) {
        if (usuarioRepository.esMiembro(idUsuario, idComunidad)) {
            return "Miembro";
        }
        if (usuarioRepository.solicitudIngresoExiste(idUsuario, idComunidad)) {
            return "Pendiente";
        }
        return "Vacio";
    }

    public String miembroSale(Long idComunidad, Long idUsuario) {
        if (!usuarioRepository.esMiembro(idUsuario, idComunidad)) {
            return "El usuario no pertenece a la comunidad.";
        }
        comunidadRepository.miembroSaliente(idComunidad, idUsuario);
        return "Exito al salir de la comunidad";
    }

}