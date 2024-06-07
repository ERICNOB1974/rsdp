import { HistoricoTurno } from "./historicoTurno";

export interface Operario {
    id: number;
    legajo: string;
    nombre: string;
    categoria: string;
    historicoTurnos: HistoricoTurno[];
  }
  