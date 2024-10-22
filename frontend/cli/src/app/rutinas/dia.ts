import { Ejercicio } from "./ejercicio";
import { TipoEjercicio } from "./tipoEjercicio";

export interface Dia {
    nombre: string;
    descripcion: string;
    ejercicios: Ejercicio[];
    ejerciciosRepeticiones?: Ejercicio[]; // Agregar esta propiedad
    ejerciciosTiempo?: Ejercicio[];       // Agregar esta propiedad
    tipo: 'trabajo' | 'descanso';
    orden?: number;
}