import { TipoTurno } from "./tipoTurno";

export interface HistoricoTurno {
    id: number;
    fechaTurnoDesde: Date;
    fechaTurnoHasta: Date | null;
    tipoTurno: TipoTurno | null;
}
  