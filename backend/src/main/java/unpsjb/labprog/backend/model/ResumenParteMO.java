package unpsjb.labprog.backend.model;

import java.time.LocalTime;

public interface ResumenParteMO {

    Integer getLegajo();
    String getNombre();
    LocalTime getIngreso();
    LocalTime getEgreso();
    LocalTime getHoras();
    LocalTime getHorasPartes();
    
}
