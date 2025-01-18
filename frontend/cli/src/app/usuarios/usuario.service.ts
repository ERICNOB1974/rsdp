import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Usuario } from './usuario';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {


  private usuariosUrl = 'rest/usuarios';
  private emailUrl = 'rest/email';
  private idUsuarioAutenticado = this.authService.getUsuarioId();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  actualizarCorreo(nuevoCorreo: string): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.put<DataPackage>(`${this.usuariosUrl}/actualizarCorreo/${idUsuario}`, nuevoCorreo);
  }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/findById/${id}`);
  }

  sugerencias(): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/sugerencias-combinadas/${nombreUsuario}`);
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/search/${searchTerm}`);
  }

  solicitarIngresoAComunidad(idComunidad: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.post<DataPackage>(`${this.usuariosUrl}/solicitarIngresoAComunidad/${idUsuario}/${idComunidad}`, null);
  }

  existeMail(correoElectronico: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/existeMail/${correoElectronico}`);
  }

  existeNombreUsuario(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/existeNombreUsuario/${nombreUsuario}`);
  }

  existeNombreUsuarioMenosElActual(nombreUsuarioIngresado: string, nombreUsuarioActual: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/existeNombreUsuarioMenosElActual/${nombreUsuarioIngresado}/${nombreUsuarioActual}`);
  }

  obtenerAmigos(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/amigos/${this.authService.getNombreUsuario()}`);
  }

  obtenerSolicitudes(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/solicitudesAmistad/${this.authService.getNombreUsuario()}`);
  }

  obtenerSolicitudesEnviadas(): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/solicitudesAmistadEnviadas/${this.authService.getNombreUsuario()}`);
  }

  obtenerAmigosPaginados(nombreUsuarioFiltrar: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.usuariosUrl}/amigoss/${this.authService.getNombreUsuario()}?page=${page}&size=${size}` +
      (nombreUsuarioFiltrar ? `&nombreUsuarioFiltrar=${nombreUsuarioFiltrar}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }

  obtenerSolicitudesPaginadas(nombreUsuarioFiltrar: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.usuariosUrl}/solicitudessAmistad/${this.authService.getNombreUsuario()}?page=${page}&size=${size}` +
      (nombreUsuarioFiltrar ? `&nombreUsuarioFiltrar=${nombreUsuarioFiltrar}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }
  solicitudesAmistadEnviadasPaginadas(nombreUsuarioFiltrar: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.usuariosUrl}/solicitudessAmistadEnviadas/${this.authService.getNombreUsuario()}?page=${page}&size=${size}` +
      (nombreUsuarioFiltrar ? `&nombreUsuarioFiltrar=${nombreUsuarioFiltrar}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }
 

  eliminarAmigo(idAmigo: number): Observable<DataPackage> {
    const body = {};
    return this.http.post<DataPackage>(`${this.usuariosUrl}/eliminarAmigo/${this.authService.getUsuarioId()}/${idAmigo}`, body);
  }

  cancelarSolicitudAmistad(idUsuario: number): Observable<DataPackage> {
    const body = {};
    return this.http.post<DataPackage>(`${this.usuariosUrl}/cancelarSolicitudAmistad/${this.authService.getUsuarioId()}/${idUsuario}`, body);
  }

  enviarSolicitudAmistad(idEmisor: number, idReceptor: number): Observable<DataPackage> {
    const body = {};
    return this.http.post<DataPackage>(`${this.usuariosUrl}/enviarSolicitudAmistad/${idEmisor}/${idReceptor}`, body);
  }


  save(usuario: Usuario): Observable<DataPackage> {
    return usuario.id ? this.http.put<DataPackage>(` ${this.usuariosUrl}/actualizar`, usuario) :
      this.http.post<DataPackage>(` ${this.usuariosUrl}/create`, usuario);
  }


  sonAmigos(idEmisor: number, idReceptor: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/sonAmigos/${idEmisor}/${idReceptor}`);
  }

  verificarSolicitudAmistad(idEmisor: number, idReceptor: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/solicitudAmistadExiste/${idEmisor}/${idReceptor}`);
  }

  gestionarSolicitudAmistad(idEmisor: number, idReceptor: number, aceptada: boolean): Observable<DataPackage> {
    const body = {}
    return this.http.post<DataPackage>(`${this.usuariosUrl}/gestionarSolicitudAmistad/${idEmisor}/${idReceptor}?aceptada=${aceptada}`, body);
  }


  miembrosComunidad(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/miembrosComunidad/${idComunidad}`);
  }

  administradoresComunidad(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.usuariosUrl}/administradoresComunidad/${idComunidad}`);
  }

  getCreadorComunidad(idUsuario: number, idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/esCreador/${idUsuario}/${idComunidad}`);
  }

  usuarioCreadorEvento(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/creadorEvento/${idEvento}`);
  }

  usuarioCreadorComunidad(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/creadorComunidad/${idComunidad}`);
  }

  buscar(term: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.usuariosUrl}/buscar/${this.authService.getNombreUsuario()}?page=${page}&size=${size}` +
      (term ? `&term=${term}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }


  buscarMiembro(idComunidad: number, term: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.usuariosUrl}/miembros/${idComunidad}/${this.authService.getNombreUsuario()}?page=${page}&size=${size}` +
      (term ? `&term=${term}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }

  enviarInvitacionEvento(idUsuarioReceptor: number, idEvento: number): Observable<DataPackage> {
    const body = {};
    return this.http.post<DataPackage>(` ${this.usuariosUrl}/enviarInvitacionEvento/${this.idUsuarioAutenticado}/${idUsuarioReceptor}/${idEvento}`, body);
  }

  todosLosAmigosDeUnUsuarioPertenecientesAUnEvento(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/todosLosAmigosDeUnUsuarioPertenecientesAUnEvento/${this.idUsuarioAutenticado}/${idEvento}`);
  }

  todosLosAmigosDeUnUsuarioNoPertenecientesAUnEvento(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/todosLosAmigosDeUnUsuarioNoPertenecientesAUnEvento/${this.idUsuarioAutenticado}/${idEvento}`);
  }

  todosLosAmigosDeUnUsuarioNoPertenecientesAUnEventoPrivadoPeroSiALaComunidad(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/todosLosAmigosDeUnUsuarioNoPertenecientesAUnEventoPrivadoPeroSiALaComunidad/${this.idUsuarioAutenticado}/${idEvento}`);
  }

  todosLosAmigosDeUnUsuarioYaInvitadosAUnEventoPorElUsuario(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/todosLosAmigosDeUnUsuarioYaInvitadosAUnEventoPorElUsuario/${this.idUsuarioAutenticado}/${idEvento}`);
  }

  invitacionEvento(idUsuarioReceptor: number, idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.emailUrl}/invitacionEvento/${this.idUsuarioAutenticado}/${idUsuarioReceptor}/${idEvento}`);
  }

  enviarInvitacionComunidad(idUsuarioReceptor: number, idComunidad: number): Observable<DataPackage> {
    const body = {};
    return this.http.post<DataPackage>(` ${this.usuariosUrl}/enviarInvitacionComunidad/${this.idUsuarioAutenticado}/${idUsuarioReceptor}/${idComunidad}`, body);
  }

  todosLosAmigosDeUnUsuarioPertenecientesAUnaComunidad(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/todosLosAmigosDeUnUsuarioPertenecientesAUnaComunidad/${this.idUsuarioAutenticado}/${idComunidad}`);
  }

  todosLosAmigosDeUnUsuarioNoPertenecientesAUnaComunidad(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/todosLosAmigosDeUnUsuarioNoPertenecientesAUnaComunidad/${this.idUsuarioAutenticado}/${idComunidad}`);
  }

  todosLosAmigosDeUnUsuarioYaInvitadosAUnaComunidadPorElUsuario(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/todosLosAmigosDeUnUsuarioYaInvitadosAUnaComunidadPorElUsuario/${this.idUsuarioAutenticado}/${idComunidad}`);
  }

  invitacionComunidad(idUsuarioReceptor: number, idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.emailUrl}/invitacionComunidad/${this.idUsuarioAutenticado}/${idUsuarioReceptor}/${idComunidad}`);
  }
  usuariosLikePublicacion(idPublicacion: number,page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/likesPublicacion/${idPublicacion}?page=${page}&size=${size}`);
  }

  contarUsuariosAnonimos(idComunidad: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/contarUsuariosAnonimos/${this.authService.getNombreUsuario()}/${idComunidad}`);
  }

  buscarParticipante(idEvento: number, term: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.usuariosUrl}/participantes/${idEvento}/${this.authService.getNombreUsuario()}?page=${page}&size=${size}` +
      (term ? `&term=${term}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }

  contarParticipantesAnonimos(idEvento: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.usuariosUrl}/contarParticipantesAnonimos/${this.authService.getNombreUsuario()}/${idEvento}`);
  }


}
