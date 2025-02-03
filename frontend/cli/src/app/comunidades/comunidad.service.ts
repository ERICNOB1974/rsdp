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

  // async obtenerUbicacion(latitud: number, longitud: number): Promise<string> {
  //   try {
  //     const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
  //       params: {
  //         lat: latitud,
  //         lon: longitud,
  //         format: 'json',
  //       },
  //     });

  //     const { address } = response.data;

  //     if (!address) {
  //       return 'Dirección no disponible';
  //     }

  //     const ciudad = address.city || address.town || address.village;
  //     const pais = address.country;

  //     // Si la ciudad o el país no están disponibles, enviamos otro mensaje
  //     if (!ciudad && !pais) {
  //       return 'Ubicación indefinida';
  //     }

  //     // Retorna la ciudad y el país si están disponibles
  //     return `${ciudad || 'Ciudad desconocida'}, ${pais || 'País desconocido'}`;

  //   } catch (error) {
  //     console.error('Error obteniendo la ubicación:', error);
  //     return 'Ubicación no disponible';
  //   }
  // }

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

  sugerencias(page: number, size: number): Observable<DataPackage> {
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
  desetiquetar(comunidad: number, idEtiqueta: number): Observable<DataPackage> {
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/desetiquetar/${idEtiqueta}`, comunidad);
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

  eliminarMiembroConMotivo(motivo: string, tipo: string,fechaHoraExpulsion: string, idMiembro: number, idComunidad: number): Observable<DataPackage> {
    const params = new HttpParams()
        .set('motivo', motivo)
        .set('tipo', tipo)
        .set('fechaHoraExpulsion', fechaHoraExpulsion);

    return this.http.put<DataPackage>(
        `${this.comunidadesUrl}/eliminarParticipante/${idComunidad}/${idMiembro}`,
        null,  // No es necesario enviar un cuerpo de solicitud.
        { params }  // Pasamos los parámetros de consulta aquí.
    );
}

editarExpulsionConMotivo(motivo: string, tipo: string, fechaHoraExpulsion: string, idMiembro: number, idComunidad: number): Observable<DataPackage> {
  const params = new HttpParams()
      .set('motivo', motivo)
      .set('tipo', tipo)
      .set('fechaHoraExpulsion', fechaHoraExpulsion);

  return this.http.put<DataPackage>(
      `${this.comunidadesUrl}/editarExpulsion/${idComunidad}/${idMiembro}`,  // Ruta para editar expulsión
      null,  // No es necesario enviar un cuerpo de solicitud.
      { params }  // Pasamos los parámetros de consulta aquí.
  );
}

  verificarExpulsion(idUsuarioAutenticado: number, idComunidad: number) {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/estaExpulsado/${idUsuarioAutenticado}/${idComunidad}`);
  }

  gestionarSolicitudIngreso(idSuperUsuario: number, idMiembro: number, idComunidad: number, aceptada: boolean): Observable<DataPackage> {
    const body = {}
    return this.http.post<DataPackage>(` ${this.comunidadesUrl}/gestionarSolicitudIngreso/${idSuperUsuario}/${idMiembro}/${idComunidad}?aceptada=${aceptada}`, body);
  }

  visualizarSolicitudes(idComunidad: number,term: string, page: number, size: number): Observable<DataPackage> {
    const url = ` ${this.comunidadesUrl}/visualizarSolicitudes/${this.authService.getUsuarioId()}/${idComunidad}?page=${page}&size=${size}` +
    (term ? `&term=${term}` : '');
    return this.http.get<DataPackage>(url);
    }
    

    obtenerExpulsadosActivos(idComunidad: number,term: string, page: number, size: number): Observable<DataPackage> {
      const url = ` ${this.comunidadesUrl}/obtenerExpulsadosActivos/${this.authService.getUsuarioId()}/${idComunidad}?page=${page}&size=${size}` +
      (term ? `&term=${term}` : '');
      return this.http.get<DataPackage>(url);

      }



  remove(id: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.comunidadesUrl}/${id}`)
  }

  filtrarParticipantes(tipoTab: string, usuarioId: number, min: number, max: number): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/filtrar/participantes`, {
      params: {
        tipo: tipoTab,
        usuarioId: usuarioId,
        min: min.toString(),  // Convertimos a string porque los parámetros de URL deben ser strings
        max: max.toString()
      }
    });
  }

  filtrarNombre(nombre: string, tipoTab: string, usuarioId: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/filtrar/nombre`,
      {
        params: {
          nombre: nombre,
          tipo: tipoTab,
          usuarioId: usuarioId
        }
      });
  }


  filtrarEtiqueta(etiquetas: string[], tipo: string, usuarioId: number): Observable<DataPackage> {
    let params = new HttpParams().set('etiquetas', etiquetas.join(',')); // convierte el array a una cadena separada por comas

    if (tipo) {
      params = params.set('tipo', tipo); // agrega el tipo si está definido
    }

    if (usuarioId) {
      params = params.set('usuarioId', usuarioId.toString()); // agrega el idUsuario si está definido
    }

    return this.http.get<DataPackage>(`${this.comunidadesUrl}/filtrar/etiquetas`, { params });
  }


  comunidadesCreadasPorUsuario(offset: number, limit: number): Observable<DataPackage> {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/comunidadesCreadasPorUsuario/${userId}?offset=${offset}&limit=${limit}`);
  }


  marcarComunidadFavorita(idComunidad: number) {
    const userId = this.authService.getUsuarioId();
    return this.http.post(`${this.comunidadesUrl}/cambiarFavorito/${userId}/${idComunidad}`, null);
  }

  esFavorita(idComunidad: number) {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.comunidadesUrl}/esFavorita/${userId}/${idComunidad}`);
  }


  comunidadesFavoritas(idUsuario: number, nombreComunidad: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.comunidadesUrl}/comunidadesFavoritas/${idUsuario}?page=${page}&size=${size}` +
      (nombreComunidad ? `&nombreComunidad=${nombreComunidad}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }
  enviarNotificacionComunidad(mensaje: string, asunto: string, usuarios: Usuario[], nombreActividad: string): Observable<DataPackage> {

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


  eliminarBan(idComunidad: number, idExpulsado:number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.comunidadesUrl}/eliminarBan/${idComunidad}/${idExpulsado}`)
  }

eliminarSolicitudIngreso(idComunidad: number): Observable<DataPackage>{
  return this.http.delete<DataPackage>(`${this.comunidadesUrl}/eliminarSolicitudIngreso/${this.authService.getUsuarioId()}/${idComunidad}`)
}

otorgarRolModerador(idCreador: number, idMiembro: number, idComunidad: number): Observable<DataPackage> {
  const body = {}
  return this.http.post<DataPackage>(` ${this.comunidadesUrl}/otorgarRolModerador/${idCreador}/${idMiembro}/${idComunidad}`, body);
}

quitarRolModerador(idCreador: number, idMiembro: number, idComunidad: number): Observable<DataPackage> {
  const body = {}
  return this.http.post<DataPackage>(` ${this.comunidadesUrl}/quitarRolModerador/${idCreador}/${idMiembro}/${idComunidad}`, body);
}



}