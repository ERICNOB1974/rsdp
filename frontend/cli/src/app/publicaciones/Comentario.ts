import { Usuario } from "../usuarios/usuario";

export interface Comentario {
    id: number;
    texto: string;
    fecha: Date | string;
    usuario: Usuario;
}