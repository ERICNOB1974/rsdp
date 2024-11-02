import { Ejercicio } from "./ejercicio";
import { TipoEjercicio } from "./tipoEjercicio";

export interface Dia {
    id?: number;
    nombre: string;
    descripcion: string;
    ejercicios: Ejercicio[];
    ejerciciosRepeticiones?: Ejercicio[]; 
    ejerciciosTiempo?: Ejercicio[];       
    tipo: 'trabajo' | 'descanso';
    orden?: number;
    finalizado?: boolean;
}