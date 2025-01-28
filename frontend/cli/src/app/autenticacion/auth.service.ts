import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../usuarios/usuario';
import { Data, Router } from '@angular/router';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private autenticacionUrl = 'rest/autenticacion';
  private emailUrl = 'rest/email';

  constructor(
    private http: HttpClient, private router: Router
  ) { }

  login(correo: string, contrasena: string): Observable<DataPackage> {
    const usuario = { correoElectronico: correo, contrasena: contrasena };
    return this.http.post<DataPackage>(`${this.autenticacionUrl}/login`, usuario);
  }

  cambiarContrasena(correo: string, contrasenaNueva: string): Observable<DataPackage> {
    const cambioContrasenaRequest = { correoElectronico: correo, contrasenaNueva: contrasenaNueva };
    return this.http.post<DataPackage>(`${this.autenticacionUrl}/cambiar-contrasena`, cambioContrasenaRequest);
  }

  verificarContrasena(contrasena: string): Observable<DataPackage> {
    const correoActual = this.getCorreoElectronico(); // Obtiene el correo del usuario actual
    const verificacionRequest = { 
        correoElectronico: correoActual, 
        contrasena: contrasena 
    };
    return this.http.post<DataPackage>(`${this.autenticacionUrl}/verificar-contrasena`, verificacionRequest);
  }

  registro(
    nombreReal: string,
    nombreUsuario: string,
    correoElectronico: string,
    contrasena: string,
    fechaNacimiento: string,
    genero: string,
    descripcion: string,
    privacidadPerfil: string,
    privacidadEventos: string,
    privacidadComunidades: string
  ): Observable<any> {
    const usuario = {
      nombreReal,
      nombreUsuario,
      correoElectronico,
      contrasena,
      fechaNacimiento,
      genero,
      descripcion,
      privacidadPerfil,
      privacidadEventos,
      privacidadComunidades
    };
    return this.http.post(`${this.autenticacionUrl}/registro`, usuario);
  }

  enviarCodigo(email: string) : Observable<DataPackage>{
    return this.http.post<DataPackage>(`${this.emailUrl}/enviar-codigo`, email);
  }  

  verificarCodigo(mail: string, codigo: string): Observable<DataPackage> {
    const verificacionRequest = {
      email: mail,
      codigoIngresado: codigo
    };
    return this.http.post<DataPackage>(`${this.emailUrl}/verificar-codigo`, verificacionRequest);
  }  

  saveToken(token: string) {
    localStorage.setItem('token', token); // Guardar el token
    // Decodificar el token y almacenar la información del usuario
    const decoded: any = jwtDecode(token)
    localStorage.setItem('usuarioId', decoded.id);
    localStorage.setItem('nombreUsuario', decoded.nombreUsuario);
    localStorage.setItem('correoElectronico', decoded.sub);
  }

  getUsuarioId(): string | null {
    return localStorage.getItem('usuarioId');
  }
  
  getNombreUsuario(): string | null {
    return localStorage.getItem('nombreUsuario');
  }
  
  getCorreoElectronico(): string | null {
    return localStorage.getItem('correoElectronico');
  }

  getNombreReal(): string | null {
    return localStorage.getItem('nombreReal');
  }


  

  
  getFotoPerfil(): string | null {
    return localStorage.getItem('fotoPerfil');
  }
  
  
  
  logout() {
    this.http.post(`${this.autenticacionUrl}/logout`, {}).subscribe({
      complete: () => {
        // Limpia el localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('usuarioId');
        localStorage.removeItem('nombreUsuario');
        localStorage.removeItem('correoElectronico');
        localStorage.removeItem('authToken');
        
        // Configura una bandera para recargar la página del login
        localStorage.setItem('reloadLogin', 'true');
  
        // Redirige al login
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error("Error en el logout:", error);
      }
    });
  }  

  getToken(): string | null {
    return localStorage.getItem('token'); // Obtenemos el token si existe
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('authToken');
  }

  isAuthenticated(): boolean {
    return !!this.getToken(); // Verificar si hay un token válido
  }

}