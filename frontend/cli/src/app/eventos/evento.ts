export interface Evento {
    id: number;
    nombre: string;
    fechaDeCreacion: Date; 
    fechaHora: string; 
    ubicacion: string;
    descripcion: string;
    cantidadMaximaParticipantes: number;
    esPrivadoParaLaComunidad: boolean;
    participantes: number;
}
