import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  get(id: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/findById/${id}`);
  }
  etiquetasDelEvento(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/etiquetas/${id}`);
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

  saveConCreadorComunidad(evento: Evento, comunidadId: number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    const url = `${this.eventosUrl}/crearParaComunidad/${nombreUsuario}/${comunidadId}`;
    return this.http.post<DataPackage>(url, evento);
  }

  sugerencias(): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();

    return this.http.get<DataPackage>(` ${this.eventosUrl}/sugerencias-combinadas/${nombreUsuario}`);
  }

  etiquetar(evento: Evento, idEtiqueta: number): Observable<DataPackage> {
    return this.http.post<DataPackage>(` ${this.eventosUrl}/etiquetar/${idEtiqueta}`, evento);
  }

  inscribirse(idEvento: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.post<DataPackage>(` ${this.eventosUrl}/inscribirse/${idEvento}/${idUsuario}`, null);
  }

  //trae la cantidad de participantes
  participantesEnEvento(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/${id}/participantes`);
  }

  listaParticipantes(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/listaParticipantes${id}`);
  }

  participa(idEvento: number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(`${this.eventosUrl}/estaInscripto/${nombreUsuario}/${idEvento}`);
  }

  creador(idEvento: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.eventosUrl}/esCreadoPor/${idUsuario}/${idEvento}`);
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
  salir(idEvento: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.eventosUrl}/desinscribirse/${idEvento}/${idUsuario}`);
  }
  filtrarParticipantes(min: number, max: number): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/participantes`, {
      params: {
        min: min.toString(),  // Convertimos a string porque los parámetros de URL deben ser strings
        max: max.toString()
      }
    });
  }
  filtrarNombre(nombre: string): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/nombre`, {
      params: {
        nombre
      }
    });
  }
  filtrarFecha(min: string, max: string): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/fecha`, {
      params: {
        min: min,
        max: max
      }
    });
  }
  filtrarEtiqueta(etiquetas: string[]): Observable<DataPackage> {
    const params = new HttpParams().set('etiquetas', etiquetas.join(',')); // convierte el array a una cadena separada por comas
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/etiquetas`, { params });
  }

  disponibles(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/disponibles`);
  }

  eventosCreadosPorUsuario(offset: number, limit: number): Observable<DataPackage> {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.eventosUrl}/eventosCreadosPorUsuario/${userId}?offset=${offset}&limit=${limit}`);
  }

  participaUsuario(idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.eventosUrl}/participa/${idUsuario}`);
  }


  eliminar(idEvento: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(` ${this.eventosUrl}/eliminar/${idEvento}`);
  }



  eventosFuturosPertenecientesAUnUsuario(): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(` ${this.eventosUrl}/eventosFuturosPertenecientesAUnUsuario/${nombreUsuario}`);
  }


}