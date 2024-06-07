import { Proyecto } from "../proyecto/proyecto";
import { Tarea } from "../tarea/tarea";
import { Operario } from "../operario/operario";

export interface ParteMO {

    id: number;
    fecha: Date;
    horaDesde: any;
    horaHasta: any;
    operario: Operario;
    proyecto: Proyecto;
    tarea: Tarea;
    horas:Number;
    logsValidacion: string[];

}