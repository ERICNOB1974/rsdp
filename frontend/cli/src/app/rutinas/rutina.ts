import { Etiqueta } from '../etiqueta/etiqueta';

import { Dia } from "./dia";

export interface Rutina {
    nombre: string;
    descripcion: string;
    dias: number
    etiquetas: Etiqueta[]
    dias?: Dia[];
}