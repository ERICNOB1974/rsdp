export interface Comunidad {
    id: number;
    nombre: string;
    fechaDeCreacion: Date; // Usamos el tipo Date en lugar de LocalDate
    descripcion: string;
    cantidadMaximaMiembros: number;
    esPrivada: boolean;
    latitud: number;
    longitud: number;
}
