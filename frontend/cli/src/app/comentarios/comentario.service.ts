import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {


  private comentariosUrl = 'rest/comentarios';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }


  obtenerComentariosPorPublicacion(idPublicacion: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comentariosUrl}/publicacion/${idPublicacion}`);
  }

  responderComentario(comentarioPadreId: number, comentario: string) {
    return this.http.post<DataPackage>(` ${this.comentariosUrl}/responder/${comentarioPadreId}/${this.authService.getUsuarioId()}`, comentario);
  }

  comentar(idPublicacion: number, comentario: string) {
    return this.http.post<DataPackage>(` ${this.comentariosUrl}/comentar/${this.authService.getUsuarioId()}/${idPublicacion}`, comentario);
  }

  getRespuestas(comentarioId: number, page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comentariosUrl}/respuestas/${comentarioId}?page=${page}&size=${size}`);
  }

  contarRespuestas(comentarioPadreId: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comentariosUrl}/contarRespuestas/${comentarioPadreId}`);
  }

  eliminar(comentarioId: number): Observable<any> {
    return this.http.delete<DataPackage>(`${this.comentariosUrl}/eliminar/${comentarioId}`);
  }

  cantidadLikes(comentarioId: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comentariosUrl}/cantidadLikes/${comentarioId}`);
  }

  estaLikeada(comentarioId: number) {
    return this.http.get<DataPackage>(` ${this.comentariosUrl}/isLikeada/${this.authService.getUsuarioId()}/${comentarioId}`);
  }

  sacarLike(comentarioId: number) {
    return this.http.get<DataPackage>(` ${this.comentariosUrl}/deslikear/${this.authService.getUsuarioId()}/${comentarioId}`);
  }

  darLike(comentarioId: number) {
    return this.http.get<DataPackage>(` ${this.comentariosUrl}/likear/${this.authService.getUsuarioId()}/${comentarioId}`);
  }

  obtenerComentariosPaginados(idPublicacion: number, page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comentariosUrl}/comentariosPaginados/${idPublicacion}/${this.authService.getUsuarioId()}?page=${page}&size=${size}`);
  }
  cantidadComentariosPublicacion(idPublicacion: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.comentariosUrl}/cantidadComentariosPublicacion/${idPublicacion}`);
  }

}