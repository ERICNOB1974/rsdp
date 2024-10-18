import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Comunidad } from './comunidad';
import axios from 'axios';
import { DataPackage } from '../data-package';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ComunidadService {
  private comunidadesUrl = 'rest/comunidades';

  constructor(private http: HttpClient, private authService: AuthService) {}

  async obtenerUbicacion(latitud: number, longitud: number): Promise<string> {
    try {
      const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
        params: {
          lat: latitud,
          lon: longitud,
          format: 'json',
        }
      });
      
      const { address } = response.data;
      const ciudad = address.city || address.town || address.village || 'Ciudad desconocida';
      const pais = address.country || 'País desconocido';
      return `${ciudad}, ${pais}`;
    } catch (error) {
      console.error('Error obteniendo la ubicación:', error);
      return 'Ubicación no disponible';
    }
  }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/findById/${id}`);
  }

  save(comunidad: Comunidad): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId(); 

    if (comunidad.id) {
      return this.http.put<DataPackage>(this.comunidadesUrl, comunidad);
    } else {
      const url = `${this.comunidadesUrl}/create/${idUsuario}`;
      return this.http.post<DataPackage>(url, comunidad);
    }
  }
    
  sugerencias(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/sugerencias/${nombreUsuario}`);
  }
  
  participantesEncomunidad(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/${id}/participantes`);
  }
  miembrosEnComunidad(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/${id}/miembros`);
  }
    
  etiquetar(comunidad: Comunidad, idEtiqueta:number): Observable<DataPackage> {
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/etiquetar/${idEtiqueta}`, comunidad);
  }

  estadoSolicitud(idComunidad: number, idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/participa/${idComunidad}/${idUsuario}`);
  }

}