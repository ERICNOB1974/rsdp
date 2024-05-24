package unpsjb.labprog.backend.model;

import java.time.LocalTime;
import java.util.Date;

public interface ResumenParteMO {

    Integer getLegajo();
    String getNombre();
    LocalTime getIngreso();
    LocalTime getEgreso();
    LocalTime getHoras();
    LocalTime getHorasPartes();
    Date getFecha();
    String getEstado();

}
