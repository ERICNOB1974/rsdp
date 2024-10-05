export interface Comunidad {
    id: number;
    nombre: string;
    fechaDeCreacion: Date; 
    descripcion: string;
    cantidadMaximaMeimbros: number;
    esPrivada: boolean;
    miembros: number;
    latitud: number;
    longitud: number;
}

