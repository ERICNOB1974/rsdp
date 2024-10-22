import { Etiqueta } from '../etiqueta/etiqueta';

import { Dia } from "./dia";

export interface Rutina {
    id?:number;
    nombre: string;
    descripcion: string;
    etiquetas?: Etiqueta[]
    dias?: Dia[];
}