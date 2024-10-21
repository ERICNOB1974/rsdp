import { Ejercicio } from "./ejercicio";

export interface Rutina {
    id: number;
    nombre: string;
    descripcion: string;
    dias?: Dia[];
}