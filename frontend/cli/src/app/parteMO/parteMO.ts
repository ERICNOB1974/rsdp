import { Proyecto } from "../proyecto/proyecto";
import { Tarea } from "../tarea/tarea";
import { NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';
import { Operario } from "../operario/operario";
import { Time } from "@angular/common";

export interface ParteMO {

    id: number;
    fecha: Date;
    horaDesde: Date;
    horaHasta: Date;
    operario: Operario;
    proyecto: Proyecto;
    tarea: Tarea;
    horas:Number;
    logsValidacion: string[];

}