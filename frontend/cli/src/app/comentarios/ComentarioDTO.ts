import { Comentario } from "./Comentario";

export interface ComentarioDTO {
    comentario: Comentario;
    cantidadLikes: number;
    estaLikeado: boolean;
}