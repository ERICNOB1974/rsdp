package unpsjb.labprog.backend.business;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import unpsjb.labprog.backend.model.Ejercicio;
import unpsjb.labprog.backend.model.Rutina;

@Service
public class EjercicioService {

    @Autowired
    EjercicioRepository ejercicioRepository;

    public List<Ejercicio> findAll() {
        return ejercicioRepository.findAll();
    }



}