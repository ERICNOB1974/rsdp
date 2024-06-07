import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Operario } from './operario';

@Injectable({
  providedIn: 'root'
})
export class TipoTurnoService {

  private tipoTurnosUrl = 'rest/tipoTurnos';
  
  constructor(
    private http: HttpClient
  ) { }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tipoTurnosUrl}/search/${searchTerm}`);
  }

  get(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.tipoTurnosUrl}/id/${id}`);
  }

  save (operario: Operario): Observable<DataPackage>{
    return operario.id 
    ? this.http.put<DataPackage>(this.tipoTurnosUrl, operario)
    : this.http.post<DataPackage>(this.tipoTurnosUrl, operario);
  }

  obtenerTurno(operarioLegajo: string, fecha: string): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.tipoTurnosUrl}/obtenerTurno/${operarioLegajo}/${fecha}`);
  }

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.tipoTurnosUrl}/page?page=${page-1}&size=${size}`); 
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.tipoTurnosUrl}/${id}`);
  }

  findAll(): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.tipoTurnosUrl}`);
  }

}