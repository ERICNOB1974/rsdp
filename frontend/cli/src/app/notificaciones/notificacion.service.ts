import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NotificacionService {


  private notificacionesUrl = 'rest/notificaciones';

  constructor(
    private http: HttpClient
  ) { }


  obtenerNotificaciones(idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.notificacionesUrl}/notificaciones/${idUsuario}`);
  }

  marcarLeida(idNotificacion: number): Observable<DataPackage> {
    return this.http.post<DataPackage>(`${this.notificacionesUrl}/marcar-leida/${idNotificacion}`, {});
  }

  eliminarNotificacion(idNotificacion: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.notificacionesUrl}/eliminarNotififacion/${idNotificacion}`);
  }

}