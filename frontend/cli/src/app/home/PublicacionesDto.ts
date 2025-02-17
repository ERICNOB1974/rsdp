import { Comunidad } from "../comunidades/comunidad";
import { Publicacion } from "../publicaciones/publicacion";
import { Usuario } from "../usuarios/usuario";

export interface PublicacionDto {
    publicacion: Publicacion;
    creador: Usuario;
    likes: number;
    estaLikeada: boolean;
    comunidad: Comunidad;
}