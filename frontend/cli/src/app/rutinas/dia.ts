import { Ejercicio } from "./ejercicio";
import { TipoEjercicio } from "./tipoEjercicio";

export interface Dia {
    nombre: string;
    descripcion: string;
    ejercicios: Ejercicio[];
    tipo: 'trabajo' | 'descanso';
}