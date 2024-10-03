package unpsjb.labprog.backend.model;

public enum EstadoSolicitud {

    PENDIENTE{
        public String toString(){
            return "Pendiente";
        }
    },

    ACEPTADA{
        public String toString(){
            return "Aceptada";
        }
    },

    RECHAZADA{
        public String toString(){
            return "Rechazada";
        }
    }

}
