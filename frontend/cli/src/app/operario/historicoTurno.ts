import { NgbDateStruct } from "@ng-bootstrap/ng-bootstrap";
import { TipoTurno } from "./tipoTurno";

export interface HistoricoTurno {
    fechaTurnoDesde: any;
    fechaTurnoHasta: any;
    tipoTurno: TipoTurno;
}
