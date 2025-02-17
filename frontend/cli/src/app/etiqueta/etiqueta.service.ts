import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Etiqueta } from './etiqueta';

@Injectable({
  providedIn: 'root'
})
export class EtiquetaService {

  private etiquetasUrl = 'rest/etiquetas';

  constructor(
    private http: HttpClient
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.etiquetasUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.etiquetasUrl}/findById/${id}`);
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.etiquetasUrl}/search/${searchTerm}`);
  }

  verificarExistencia(nombre: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.etiquetasUrl}/existe?nombre=${nombre}`);
  }

  crearEtiqueta(etiqueta: Etiqueta): Observable<Etiqueta> {
    return this.http.post<Etiqueta>(this.etiquetasUrl, etiqueta);
  }


  etiquetasEnComunidad(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.etiquetasUrl}/etiquetasComunidad/${idComunidad}`);
  }

  obtenerEtiquetasDeEvento(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.etiquetasUrl}/etiquetasEvento/${idEvento}`);
  }


}