import { Ejercicio } from "./ejercicio";

export interface Rutina {
    id: number;
    nombre: string;
    descripcion: string;
    duracionMinutosPorDia: number;
    dificultad: string; // Asumiendo que dificultad es un String, ajústalo si es un Enum o clase
    ejercicios: Ejercicio[]; // Array de ejercicios
}