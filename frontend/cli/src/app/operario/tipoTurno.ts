import { Horario } from "./horario";

export interface TipoTurno {
    id: number;
    nombre: string;
    descripcion: string;
    fechaArranque: Date;
    horarios: Horario[];
  }  