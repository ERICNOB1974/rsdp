import { TipoEjercicio } from "./tipoEjercicio";

export interface Ejercicio {
    nombre: any;
    repeticiones: number | null;
    series: number | null;
    tiempo: string;
    descripcion: string;
    imagen?: string;
    tipo: 'resistencia' | 'series';
    seriesValido?: boolean;
    repeticionesValido?: boolean;
    tiempoValido?: boolean;
    orden?: number;
  }