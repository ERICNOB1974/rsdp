import { Empresa } from "../empresa/empresa";
import { Tarea } from "../tarea/tarea";

export interface Proyecto {
    id: number;
    codigo: string;
    descripcion: string;
    empresa: Empresa;
    tareas: Tarea[];
}