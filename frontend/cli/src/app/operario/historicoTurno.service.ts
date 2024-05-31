import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Operario } from './operario';
import { HistoricoTurno } from './historicoTurno';

@Injectable({
  providedIn: 'root'
})
export class HistoricoTurnoService {

  private historicoTurnosUrl = 'rest/historicoTurnos';
  
  constructor(
    private http: HttpClient
  ) { }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.historicoTurnosUrl}/search/${searchTerm}`);
  }

  get(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.historicoTurnosUrl}/id/${id}`);
  }

  save(historicoTurno: HistoricoTurno): Observable<DataPackage> {
    if (!historicoTurno.id || historicoTurno.id < 0) {
      return this.http.post<DataPackage>(this.historicoTurnosUrl, historicoTurno);
    } else {
      return this.http.put<DataPackage>(this.historicoTurnosUrl, historicoTurno);
    }
  }

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.historicoTurnosUrl}/page?page=${page-1}&size=${size}`); 
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.historicoTurnosUrl}/${id}`);
  }

}