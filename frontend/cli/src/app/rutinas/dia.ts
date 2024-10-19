import { Ejercicio } from "./ejercicio";

export interface Dia {
    nombre: string;
    descripcion: string;
    ejercicios: Ejercicio[];
    tipo: 'trabajo' | 'descanso';
}