import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    usuarioAutenticado: any = { id: '1185', nombreUsuario: 'lucas123' }; // Simula el usuario autenticado
  
    constructor() {}
  
    obtenerUsuarioAutenticado() {
      return this.usuarioAutenticado;
    }
  }