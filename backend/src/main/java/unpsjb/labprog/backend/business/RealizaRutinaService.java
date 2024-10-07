package unpsjb.labprog.backend.business;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import unpsjb.labprog.backend.model.Rutina;
import unpsjb.labprog.backend.model.Usuario;

@Service
public class RealizaRutinaService {

    public void realizaRutina(Rutina rutina, Usuario usuario, LocalDate fechaComienzo, LocalDate fechaFin)
            throws Exception {
        if (fechaComienzo == null) {
            throw new Exception("La fecha de comienzo no puede ser nula");
        }
        if (fechaFin!= null && fechaFin.isBefore(fechaComienzo)) {
            throw new Exception("La fecha de fin no puede ser anterior a la fecha de comienzo");
        }
        //establecer relacion realizarutina
    }
}
