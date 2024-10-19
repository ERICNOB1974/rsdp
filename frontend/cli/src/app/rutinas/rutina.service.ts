import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Rutina } from './rutina';

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
 

  private rutinasUrl = 'rest/rutinas';

  constructor(
    private http: HttpClient
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/findById/${id}`);
  }

  sugerencias(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/sugerencias/${nombreUsuario}`);
  }
 
  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/search/${searchTerm}`);
  }

  save(rutina: Rutina): Observable<DataPackage> {
    return rutina.id ? this.http.put<DataPackage>(` ${this.rutinasUrl}/actualizar`, rutina) :
      this.http.post<DataPackage>(` ${this.rutinasUrl}/create`, rutina);
  }

  getEjerciciosDeRutina(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/${id}/ejercicios`);
  }

  
}