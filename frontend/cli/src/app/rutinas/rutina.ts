import { Etiqueta } from '../etiqueta/etiqueta';

export interface Rutina {
    id: number;
    nombre: string;
    descripcion: string;
    dias: number
    etiquetas: Etiqueta[]
}