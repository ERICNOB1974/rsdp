import { Usuario } from "../usuarios/usuario";

export interface UsuarioEsAmigoDTO {
    usuario: Usuario;
    esAmigo: boolean;
}