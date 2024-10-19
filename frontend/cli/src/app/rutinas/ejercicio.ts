import { TipoEjercicio } from "./tipoEjercicio";

export interface Ejercicio {
    nombre: string;
    repeticiones?: number;
    series?: number;
    tiempo?: string;
    descripcion: string;
    imagen: string;
    tipo: TipoEjercicio;
  }