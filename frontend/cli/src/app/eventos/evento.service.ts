import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Evento } from './evento';
import axios from 'axios';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  private eventosUrl = 'rest/eventos';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/findAll`);
  }

  disponibles(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/disponibles`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/findById/${id}`);
  }

  participaUsuario(idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/participa/${idUsuario}`);
  }

  save(evento: Evento): Observable<DataPackage> {
    return evento.id ? this.http.put<DataPackage>(` ${this.eventosUrl}/actualizar`, evento) :
      this.http.post<DataPackage>(` ${this.eventosUrl}/create`, evento);
  }

  saveConCreador(evento: Evento): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario(); 
      if (evento.id) {
        return this.http.put<DataPackage>(` ${this.eventosUrl}/actualizar`, evento);
      } else {
        const url = `${this.eventosUrl}/crear/${nombreUsuario}`;
        return this.http.post<DataPackage>(url, evento);
      }
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

}