import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Evento } from './evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private eventosUrl = 'rest/eventos';

  constructor(
    private http: HttpClient
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/findById/${id}`);
  }

  save(evento: Evento): Observable<DataPackage> {
    return evento.id ? this.http.put<DataPackage>(this.eventosUrl, evento) :
      this.http.post<DataPackage>(this.eventosUrl, evento);
  }
  
  participantesEnEvento(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/${id}/participantes`);
  }
/*   remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.eventoesUrl}/${id}`)
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventoesUrl}/search/${searchTerm}`)
  }
 */

}