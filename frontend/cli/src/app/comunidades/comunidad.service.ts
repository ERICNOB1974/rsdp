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
      return this.http.put<DataPackage>(`${this.comunidadesUrl}/actualizar`, comunidad);
    } else {
      const url = `${this.comunidadesUrl}/create/${idUsuario}`; // Enviar el ID en la URL
      return this.http.post<DataPackage>(url, comunidad);
    }
}
    
  sugerencias(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/sugerencias/${nombreUsuario}`);
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

  miembroUsuario(idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/miembro/${idUsuario}`);
  }

  disponibles(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/disponibles`);
  }

  otorgarRolAdministrador(idCreador: number, idMiembro: number,idComunidad: number): Observable<DataPackage> {
    const body ={}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/otorgarRolAdministrador/${idCreador}/${idMiembro}/${idComunidad}`, body);
  }

  quitarRolAdministrador(idCreador: number, idMiembro: number,idComunidad: number): Observable<DataPackage> {
    const body ={}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/quitarRolAdministrador/${idCreador}/${idMiembro}/${idComunidad}`, body);
  }

  
  gestionarSolicitudIngreso(idSuperUsuario: number, idMiembro: number,idComunidad: number, aceptada: boolean): Observable<DataPackage> {
    const body ={}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/gestionarSolicitudIngreso/${idSuperUsuario}/${idMiembro}/${idComunidad}?aceptada=${aceptada}`, body);
  }

  visualizarSolicitudes(idSuperUsuario:number, idComunidad:number): Observable<DataPackage>{
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/visualizarSolicitudes/${idSuperUsuario}/${idComunidad}`);
  }


  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.comunidadesUrl}/${id}`)
  }
  miembroUsuario(idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/miembro/${idUsuario}`);
  }

  disponibles(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/disponibles`);
  }

  otorgarRolAdministrador(idCreador: number, idMiembro: number,idComunidad: number): Observable<DataPackage> {
    const body ={}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/otorgarRolAdministrador/${idCreador}/${idMiembro}/${idComunidad}`, body);
  }

  quitarRolAdministrador(idCreador: number, idMiembro: number,idComunidad: number): Observable<DataPackage> {
    const body ={}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/quitarRolAdministrador/${idCreador}/${idMiembro}/${idComunidad}`, body);
  }

  
  gestionarSolicitudIngreso(idSuperUsuario: number, idMiembro: number,idComunidad: number, aceptada: boolean): Observable<DataPackage> {
    const body ={}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/gestionarSolicitudIngreso/${idSuperUsuario}/${idMiembro}/${idComunidad}?aceptada=${aceptada}`, body);
  }

  visualizarSolicitudes(idSuperUsuario:number, idComunidad:number): Observable<DataPackage>{
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/visualizarSolicitudes/${idSuperUsuario}/${idComunidad}`);
  }

  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.comunidadesUrl}/${id}`)
  }
}