import { Etiqueta } from "../etiqueta/etiqueta";

export interface Comunidad {
    id: number;
    nombre: string;
    fechaDeCreacion: Date;
    genero: string;
    descripcion: string;
    cantidadMaximaMiembros: number;
    eliminada: boolean;
    esPrivada: boolean;
    esModerada: boolean;
    participantes: number;
    latitud: number;
    longitud: number;
    miembros: number;
    ubicacion: any;
    imagen:string;
    etiquetas?: Etiqueta[]
}
