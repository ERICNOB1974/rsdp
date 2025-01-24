package unpsjb.labprog.backend.business;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ArrobarService {
    
    @Autowired
    ComentarioRepository comentarioRepository;

    @Autowired
    ArrobarRepository arrobarRepository;

    public void etiquetarEnPublicacion(Long idUsuario, Long idEtiquetado, Long idPublicacion){
        arrobarRepository.etiquetarEnPublicacion(idUsuario, idEtiquetado, idPublicacion);
    }
    public void etiquetarEnComentario(Long idUsuario, Long idEtiquetado, Long idComentario){
        arrobarRepository.etiquetarEnComentario(idUsuario, idEtiquetado, idComentario);
    }
}
