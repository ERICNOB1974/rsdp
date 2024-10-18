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

  existeMail(correoElectronico: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/existeMail/${correoElectronico}`);
  }

  existeNombreUsuario(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/existeNombreUsuario/${nombreUsuario}`);
  }
  
}