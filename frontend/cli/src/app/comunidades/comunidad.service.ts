import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Comunidad } from './comunidad';
import axios from 'axios';
import { DataPackage } from '../data-package';

@Injectable({
  providedIn: 'root',
})
export class ComunidadService {
  private comunidadesUrl = 'rest/comunidades';

  constructor(private http: HttpClient) {}

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
    return comunidad.id
      ? this.http.put<DataPackage>(this.comunidadesUrl, comunidad)
      : this.http.post<DataPackage>(this.comunidadesUrl, comunidad);
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

  ingresarAComunidad(idComunidad: number, idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/ingresarAComunidad/${idComunidad}/${idUsuario}`);
  }
  
}