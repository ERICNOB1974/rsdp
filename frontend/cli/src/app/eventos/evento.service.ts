import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Evento } from './evento';
import axios from 'axios';

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
    return evento.id ? this.http.put<DataPackage>(` ${this.eventosUrl}/actualizar`, evento) :
      this.http.post<DataPackage>(` ${this.eventosUrl}/create`, evento);
  }

  saveConCreador(evento: Evento): Observable<DataPackage> {
    return evento.id ? this.http.put<DataPackage>(` ${this.eventosUrl}/actualizar`, evento) :
      this.http.post<DataPackage>(` ${this.eventosUrl}/crear/usuario12`, evento);
  }

  sugerencias(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/sugerencias/${nombreUsuario}`);
  }

  etiquetar(evento: Evento, idEtiqueta: number): Observable<DataPackage> {
    return this.http.post<DataPackage>(` ${this.eventosUrl}/etiquetar/${idEtiqueta}`, evento);
  }

  inscribirse(idEvento: number): Observable<DataPackage> {
    return this.http.post<DataPackage>(` ${this.eventosUrl}/inscribirse/${idEvento}/145764`, null);
    //return this.http.post<DataPackage>(` ${this.eventosUrl}/inscribirse/${idEvento}/${idUsuario}`);
  }

  participantesEnEvento(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/${id}/participantes`);
  }

  participa(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/estaInscripto/facundo/${idEvento}`);
  }

  async obtenerUbicacion(latitud: number, longitud: number): Promise<string> {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: latitud,
          lon: longitud,
          format: 'json',
        }
      });

      return `${response.data.display_name}`;
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      return 'Ubicación no disponible';
    }
  }
  salir(idEvento: number, idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/desinscribirse/${idEvento}/1883`);
    //return this.http.get<DataPackage>(`${this.eventosUrl}/desinscribirse/${idEvento}/${idUsuario}`);
  }

}