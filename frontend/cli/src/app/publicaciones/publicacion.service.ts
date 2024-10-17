import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from './publicacion';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private publicacionsUrl = 'rest/publicacion';

  constructor(
    private http: HttpClient
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/findById/${id}`);
  }

  saveConCreador(publicacion: Publicacion): Observable<DataPackage> {
    return publicacion.id ? this.http.put<DataPackage>(` ${this.publicacionsUrl}/actualizar`, publicacion) :
      this.http.post<DataPackage>(` ${this.publicacionsUrl}/crear/8653`, publicacion);
  }

}