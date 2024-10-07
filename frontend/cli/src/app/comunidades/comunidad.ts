export interface Comunidad {
    id: number;
    nombre: string;
    fechaDeCreacion: Date;
    descripcion: string;
    cantidadMaximaMiembros: number;
    esPrivada: boolean;
    participantes: number;
    latitud: number;
    longitud: number;
    miembros: number;
    ubicacion: any;
}