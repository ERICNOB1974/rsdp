import { Time } from "@angular/common";

export interface ResumenParteMO {

    nombre:String;
    legajo:Number;
    ingreso:Time;
    egreso:Time;
    horas:Time;
    horasPartes:Time;

}