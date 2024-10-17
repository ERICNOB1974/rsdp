import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    usuarioAutenticado: any = { id: '6597', nombreUsuario: 'usuario33' }; // Simula el usuario autenticado
  
    constructor() {}
  
    obtenerUsuarioAutenticado() {
      return this.usuarioAutenticado;
    }
  }