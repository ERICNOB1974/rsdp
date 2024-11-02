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

  registro(
    nombreReal: string,
    nombreUsuario: string,
    correoElectronico: string,
    contrasena: string,
    fechaNacimiento: string,
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
  
  logout() {
    localStorage.removeItem('token'); // Eliminamos el token al cerrar sesión
    this.router.navigate(['/login']);
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