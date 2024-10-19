import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
    usuarioAutenticado: any = { id: '9533', nombreUsuario: 'usuario7' }; // Simula el usuario autenticado
  
    constructor() {}
  
    obtenerUsuarioAutenticado() {
      return this.usuarioAutenticado;
    }
  }