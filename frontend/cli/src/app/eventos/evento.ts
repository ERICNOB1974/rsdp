export interface Evento {
    id: number;
    nombre: string;
    fechaDeCreacion: Date;
    fechaHora: string | Date;
    genero: string;
    descripcion: string;
    cantidadMaximaParticipantes: number;
    esPrivadoParaLaComunidad: boolean;
    participantes: number;
    latitud: number;
    longitud: number;
    ubicacion: string;
    imagen: string;
}