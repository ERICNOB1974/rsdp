import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
 

  private usuariosUrl = 'rest/usuarios';

  constructor(
    private http: HttpClient
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/findById/${id}`);
  }

  sugerencias(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/sugerencias/${nombreUsuario}`);
  }
 
  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/search/${searchTerm}`);
  }

  solicitarIngresoAComunidad(idComunidad: number, idUsuario: number) : Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/solicitarIngresoAComunidad/${idUsuario}/${idComunidad}`);
  }

  save(usuario: Usuario): Observable<DataPackage> {
    return usuario.id ? this.http.put<DataPackage>(` ${this.usuariosUrl}/actualizar`, usuario) :
      this.http.post<DataPackage>(` ${this.usuariosUrl}/create`, usuario);
  }

  obtenerAmigos(nombreUsuario: string) :Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.usuariosUrl}/amigos/${nombreUsuario}`);
}

enviarSolicitudAmistad(idEmisor: number, idReceptor: number): Observable<DataPackage> {
  const body = { /* aquí puedes agregar datos si es necesario */ };
  return this.http.post<DataPackage>(`${this.usuariosUrl}/enviarSolicitudAmistad/${idEmisor}/${idReceptor}`, body);
}

}