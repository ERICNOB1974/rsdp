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
  private idUsuarioAutenticado = this.authService.getUsuarioId();

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

  obtenerAmigos(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/amigos/${this.authService.getNombreUsuario()}`);
  }

  enviarSolicitudAmistad(idEmisor: number, idReceptor: number): Observable<DataPackage> {
    const body = {};
    return this.http.post<DataPackage>(`${this.usuariosUrl}/enviarSolicitudAmistad/${idEmisor}/${idReceptor}`, body);
  }
 

  save(usuario: Usuario): Observable<DataPackage> {
    return usuario.id ? this.http.put<DataPackage>(` ${this.usuariosUrl}/actualizar`, usuario) :
      this.http.post<DataPackage>(` ${this.usuariosUrl}/create`, usuario);
  }


  sonAmigos(idEmisor: number, idReceptor: number) :Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.usuariosUrl}/sonAmigos/${idEmisor}/${idReceptor}`);
  }

  verificarSolicitudAmistad(idEmisor: number, idReceptor: number) :Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.usuariosUrl}/solicitudAmistadExiste/${idEmisor}/${idReceptor}`);
  }

  gestionarSolicitudAmistad(idEmisor: number, idReceptor: number, aceptada: boolean) :Observable<DataPackage>{
    const body ={}
    return this.http.post<DataPackage>(`${this.usuariosUrl}/gestionarSolicitudAmistad/${idEmisor}/${idReceptor}?aceptada=${aceptada}`,body);
  }


  miembrosComunidad(idComunidad: number) :Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.usuariosUrl}/miembrosComunidad/${idComunidad}`);
  }

  administradoresComunidad(idComunidad: number) :Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.usuariosUrl}/administradoresComunidad/${idComunidad}`);
  }
  
  getCreadorComunidad(idUsuario:number, idComunidad:number): Observable<DataPackage>{
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/esCreador/${idUsuario}/${idComunidad}`);
  }






}
