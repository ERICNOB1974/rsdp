import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ParteMO } from './parteMO';
import { Operario } from '../operario/operario';
import { Tarea } from '../tarea/tarea';
import { Data } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ParteMOService {

  private partesUrl = 'rest/partes';
  
  constructor(
    private http: HttpClient
  ) { }

  get(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/id/${id}`);
  }

  save(parteMO: ParteMO): Observable<DataPackage> {
    if (!parteMO.id || parteMO.id < 0) {
      return this.http.post<DataPackage>(this.partesUrl, parteMO);
    } else {
      return this.http.put<DataPackage>(this.partesUrl, parteMO);
    }
  }

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/page?page=${page-1}&size=${size}`); 
  }

  getInvalidosPage(fecha: any,page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.partesUrl}/invalidos/${fecha}?page=${page - 1}&size=${size}`);
  }

  getValidosPage(fecha: any,page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.partesUrl}/validos/${fecha}?page=${page - 1}&size=${size}`);
  }

  getTodosPage(fecha: any,page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.partesUrl}/todos/${fecha}?page=${page - 1}&size=${size}`);
  }

  informePartesPorFecha(fecha: any,page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/informe/${fecha}?page=${page - 1}&size=${size}`);
  }

  validar(fecha: string): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/validar/${fecha}`);
  }

  validarComoSupervisor(fecha: string,legajoOperario: string): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/validarComoSupervisor/${fecha}/${legajoOperario}`);
  }

  anularParte(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/anularParte/${id}`);
  }

  rechazarComoSupervisor(fecha: string,legajoOperario: string): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/rechazarComoSupervisor/${fecha}/${legajoOperario}`);
  }

  partesDeUnResumen(fecha: string,legajoOperario: string): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/partesDeResumen/${fecha}/${legajoOperario}`);
  }

  parteDadoFechaYLegajo(fecha: string,legajoOperario: string): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/parteDadoFechaYLegajo/${fecha}/${legajoOperario}`);
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.partesUrl}/${id}`);
  }

}