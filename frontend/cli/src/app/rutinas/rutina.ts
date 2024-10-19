import { Dia } from "./dia";

export interface Rutina {
    nombre: string;
    descripcion: string;
    dias: Dia[];
}