import { Injectable } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Comunidad } from './comunidad';
import axios from 'axios';
import { DataPackage } from '../data-package';
import { AuthService } from '../autenticacion/auth.service';
import { Usuario } from '../usuarios/usuario';

@Injectable({
  providedIn: 'root',
})
export class ComunidadService {
  private comunidadesUrl = 'rest/comunidades';
  private emailUrl = 'rest/email';

  idUsuario = this.authService.getUsuarioId();

  constructor(private http: HttpClient, private authService: AuthService) { }

  async obtenerUbicacion(latitud: number, longitud: number): Promise<string> {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: {
          lat: latitud,
          lon: longitud,
          format: 'json',
        },
      });

      const { address } = response.data;

      if (!address) {
        return 'Dirección no disponible';
      }

      const ciudad = address.city || address.town || address.village;
      const pais = address.country;

      // Si la ciudad o el país no están disponibles, enviamos otro mensaje
      if (!ciudad && !pais) {
        return 'Ubicación indefinida';
      }

      // Retorna la ciudad y el país si están disponibles
      return `${ciudad || 'Ciudad desconocida'}, ${pais || 'País desconocido'}`;

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

  puedeVer(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/puedeVer/${idComunidad}/${this.authService.getUsuarioId()}`);
  }

  save(comunidad: Comunidad): Observable<DataPackage> {
    if (comunidad.id) {
      return this.http.put<DataPackage>(`${this.comunidadesUrl}/actualizar`, comunidad);
    } else {
      const url = `${this.comunidadesUrl}/create/${this.idUsuario}`;
      return this.http.post<DataPackage>(url, comunidad);
    }
  }

  sugerencias(page:number, size:number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();

    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/sugerencias-combinadas/${nombreUsuario}?page=${page}&size=${size}`);
  }

  participantesEncomunidad(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/${id}/participantes`);
  }

  //cantidad
  cantidadMiembrosEnComunidad(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/${id}/miembros`);
  }

  etiquetar(comunidad: Comunidad, idEtiqueta: number): Observable<DataPackage> {
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/etiquetar/${idEtiqueta}`, comunidad);
  }

  estadoSolicitud(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/participa/${idComunidad}/${this.idUsuario}`);
  }

  salir(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/salir/${idComunidad}/${this.idUsuario}`);
  }


  miembroUsuario(idUsuario: number, nombreComunidad: string, page: number, size: number): Observable<DataPackage> {
    // Si nombreRutina está vacío, no lo incluimos en la URL
    const url = `${this.comunidadesUrl}/miembro/${idUsuario}?page=${page}&size=${size}` +
                (nombreComunidad ? `&nombreComunidad=${nombreComunidad}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
}

  disponibles(page: number, size: number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/${nombreUsuario}/disponibles?page=${page}&size=${size}`);
  }
 

  otorgarRolAdministrador(idCreador: number, idMiembro: number, idComunidad: number): Observable<DataPackage> {
    const body = {}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/otorgarRolAdministrador/${idCreador}/${idMiembro}/${idComunidad}`, body);
  }

  quitarRolAdministrador(idCreador: number, idMiembro: number, idComunidad: number): Observable<DataPackage> {
    const body = {}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/quitarRolAdministrador/${idCreador}/${idMiembro}/${idComunidad}`, body);
  }

  eliminarMiembro(idSuperUsuario: number, idMiembro: number, idComunidad: number): Observable<DataPackage> {
    const body = {}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/eliminarUsuario/${idSuperUsuario}/${idMiembro}/${idComunidad}`, body);
  }

  gestionarSolicitudIngreso(idSuperUsuario: number, idMiembro: number, idComunidad: number, aceptada: boolean): Observable<DataPackage> {
    const body = {}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/gestionarSolicitudIngreso/${idSuperUsuario}/${idMiembro}/${idComunidad}?aceptada=${aceptada}`, body);
  }

  visualizarSolicitudes(idSuperUsuario: number, idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.comunidadesUrl}/visualizarSolicitudes/${idSuperUsuario}/${idComunidad}`);
  }


  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.comunidadesUrl}/${id}`)
  }

  filtrarParticipantes(min: number, max: number): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/filtrar/participantes`, {
      params: {
        min: min.toString(),  // Convertimos a string porque los parámetros de URL deben ser strings
        max: max.toString()
      }
    });
  }
  filtrarNombre(nombre: string): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/filtrar/nombre/${nombre}`);
  }

  filtrarEtiqueta(etiquetas: string[]): Observable<DataPackage> {
    const params = new HttpParams().set('etiquetas', etiquetas.join(',')); // convierte el array a una cadena separada por comas
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/filtrar/etiquetas`, { params });
  }

  comunidadesCreadasPorUsuario(offset: number, limit: number): Observable<DataPackage> {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/comunidadesCreadasPorUsuario/${userId}?offset=${offset}&limit=${limit}`);
  }

  enviarNotificacionComunidad(mensaje: string, asunto: string, usuarios: Usuario[], nombreActividad:string): Observable<DataPackage> {

    const nombreUsuario = this.authService.getNombreUsuario();

    const requestBody = {
      mensaje: mensaje,
      asunto: asunto,
      nombreUsuario: nombreUsuario,
      usuarios: usuarios,
      nombreActividad: nombreActividad
    };

    return this.http.post<DataPackage>(`${this.emailUrl}/enviar-notificacion`, requestBody);
  }

}