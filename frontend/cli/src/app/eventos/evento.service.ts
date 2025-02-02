import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Evento } from './evento';
import axios from 'axios';
import { AuthService } from '../autenticacion/auth.service';
import { Usuario } from '../usuarios/usuario';

@Injectable({
  providedIn: 'root'
})
export class EventoService {


  private eventosUrl = 'rest/eventos';
  private emailUrl = 'rest/email';

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

  sugerencias(page:number, size:number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();

    return this.http.get<DataPackage>(` ${this.eventosUrl}/sugerencias-combinadas/${nombreUsuario}?page=${page}&size=${size}`);
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
    return this.http.get<DataPackage>(`${this.eventosUrl}/listaParticipantes/${id}`);
  }

  participa(idEvento: number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(`${this.eventosUrl}/estaInscripto/${nombreUsuario}/${idEvento}`);
  }

  creador(idEvento: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.eventosUrl}/esCreadoPor/${idUsuario}/${idEvento}`);
  }

  // async obtenerUbicacion(latitud: number, longitud: number): Promise<string> {
  //   try {
  //     const response = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
  //       params: {
  //         lat: latitud,
  //         lon: longitud,
  //         format: 'json',
  //       }
  //     });

  //     return `${response.data.display_name}`;
  //   } catch (error) {
  //     console.error('Error obteniendo la ubicación:', error);
  //     return 'Ubicación no disponible';
  //   }
  // }
  
  salir(idEvento: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.eventosUrl}/desinscribirse/${idEvento}/${idUsuario}`);
  }

  filtrarParticipantes(tipoTab: string, usuarioId: number, min: number, max: number): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/participantes`, {
      params: {
        tipo:tipoTab,
        usuarioId: usuarioId,
        min: min.toString(),  // Convertimos a string porque los parámetros de URL deben ser strings
        max: max.toString()
      }
    });
  }
  filtrarNombre(nombre: string, tipoTab: string, usuarioId: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/nombre`, 
      { params: {
        nombre: nombre,
        tipo: tipoTab,
        usuarioId: usuarioId}  
      });
  }

  filtrarFecha(tipo: string, usuarioId: number,min: string, max: string): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/fecha`, {
      params: {
        tipo: tipo,
        usuarioId: usuarioId,
        min: min,
        max: max
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
  
    return this.http.get<DataPackage>(`${this.eventosUrl}/filtrar/etiquetas`, { params });
  }
  

  
  disponibles(page: number, size: number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(` ${this.eventosUrl}/${nombreUsuario}/disponibles?page=${page}&size=${size}`);
  }
  
  eventosCreadosPorUsuario(offset: number, limit: number): Observable<DataPackage> {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.eventosUrl}/eventosCreadosPorUsuario/${userId}?offset=${offset}&limit=${limit}`);
  }
  
 
  participaUsuario(idUsuario: number, nombreEvento: string, page: number, size: number): Observable<DataPackage> {
    // Si nombreRutina está vacío, no lo incluimos en la URL
    const url = `${this.eventosUrl}/participa/${idUsuario}?page=${page}&size=${size}` +
                (nombreEvento ? `&nombreRutina=${nombreEvento}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
}



  eliminar(idEvento: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(` ${this.eventosUrl}/eliminar/${idEvento}`);
  }
  
  eliminarMiembro(idEvento: number, idUsuario:number, motivo:string): Observable<DataPackage> {
    return this.http.put<DataPackage>(` ${this.eventosUrl}/eliminarParticipante/${idEvento}/${idUsuario}`, motivo);
  } 

  eventosFuturosPertenecientesAUnUsuario(): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(` ${this.eventosUrl}/eventosFuturosPertenecientesAUnUsuario/${nombreUsuario}`);
  }

  eventosDeUnaComunidad(comunidadId: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.eventosUrl}/eventosDeUnaComunidad/${comunidadId}`);
  }

  buscarCreadorDeUnEventoInterno(comunidadId: number, eventoId: number){
    return this.http.get<DataPackage>(`${this.eventosUrl}/buscarCreadorDeUnEventoInterno/${comunidadId}/${eventoId}`);
  }

  enviarNotificacionEvento(mensaje: string, asunto: string, usuarios: Usuario[], nombreActividad:string): Observable<DataPackage> {

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

  verificarExpulsion(idUsuarioAutenticado: number, idEvento: number) {
    return this.http.get<DataPackage>(`${this.eventosUrl}/estaExpulsado/${idUsuarioAutenticado}/${idEvento}`);
  }
}