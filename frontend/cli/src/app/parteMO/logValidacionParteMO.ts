import { Estado } from "./estado";
import { ValidacionParteMO } from "./validacionParteMO";

export interface LogValidacionParteMO {
    id: number;
    fecha: Date;
    estado: Estado;
    validacionParteMO: ValidacionParteMO;
    tiempoCreacion: Date;
}