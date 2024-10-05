import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Comunidad } from './comunidad';

@Injectable({
  providedIn: 'root'
})
export class ComunidadService {

  private comunidadesUrl = 'rest/comunidades';

  constructor(
    private http: HttpClient
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/findById/${id}`);
  }

  save(comunidad: Comunidad): Observable<DataPackage> {
    return comunidad.id ? this.http.put<DataPackage>(this.comunidadesUrl, comunidad) :
      this.http.post<DataPackage>(this.comunidadesUrl, comunidad);
  }
  

  participantesEncomunidad(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/${id}/participantes`);
  }
/*   remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.comunidadesUrl}/${id}`)
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/search/${searchTerm}`)
  }
 */


}