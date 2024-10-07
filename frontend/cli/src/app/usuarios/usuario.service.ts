import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { DataPackage } from '../data-package';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private usuariosUrl = 'rest/usuarios';

  constructor(private http: HttpClient) {}

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/findById/${id}`);
  }

  solicitarIngresoAComunidad(idComunidad: number, idUsuario: number) : Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/solicitarIngresoAComunidad/${idComunidad}/${idUsuario}`);
  }

}
