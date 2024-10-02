export interface Evento {
    id: number;
    nombre: string;
    fechaDeCreacion: Date; // Usamos el tipo Date en lugar de LocalDate
    fechaHora: Date; // Usamos el tipo Date en lugar de ZonedDateTime
    ubicacion: string;
    descripcion: string;
    cantidadMaximaParticipantes: number;
    esPrivadoParaLaComunidad: boolean;
    participantes: number;
}
