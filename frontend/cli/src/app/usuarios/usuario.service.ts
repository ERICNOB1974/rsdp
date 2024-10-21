import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private usuariosUrl = 'rest/usuarios';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/findById/${id}`);
  }

  sugerencias(): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/sugerencias/${nombreUsuario}`);
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/search/${searchTerm}`);
  }

  solicitarIngresoAComunidad(idComunidad: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.post<DataPackage>(`${this.usuariosUrl}/solicitarIngresoAComunidad/${idUsuario}/${idComunidad}`, null);
  }

  existeMail(correoElectronico: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/existeMail/${correoElectronico}`);
  }

  existeNombreUsuario(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/existeNombreUsuario/${nombreUsuario}`);
  }

  obtenerAmigos(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/amigos/${nombreUsuario}`);
  }

  enviarSolicitudAmistad(idEmisor: number, idReceptor: number): Observable<DataPackage> {
    const body = {};
    return this.http.post<DataPackage>(`${this.usuariosUrl}/enviarSolicitudAmistad/${idEmisor}/${idReceptor}`, body);
  }
 

  save(usuario: Usuario): Observable<DataPackage> {
    return usuario.id ? this.http.put<DataPackage>(` ${this.usuariosUrl}/actualizar`, usuario) :
      this.http.post<DataPackage>(` ${this.usuariosUrl}/create`, usuario);
  }

}