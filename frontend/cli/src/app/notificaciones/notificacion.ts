export interface Notificacion {
    id: number;
    tipo: string;
    mensaje: string;
    fecha: Date;
    leida: boolean;  // Atributo para indicar si la notificación ha sido leída
    entidadId: number;
}
