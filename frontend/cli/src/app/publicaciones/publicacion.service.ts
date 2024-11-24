import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Publicacion } from './publicacion';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class PublicacionService {

  private publicacionsUrl = 'rest/publicacion';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/findById/${id}`);
  }

  saveConCreador(publicacion: Publicacion): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return publicacion.id ? this.http.put<DataPackage>(` ${this.publicacionsUrl}/actualizar`, publicacion) :
      this.http.post<DataPackage>(` ${this.publicacionsUrl}/crear/${idUsuario}`, publicacion);
  }


  publicarEnComunidad(publicacion: Publicacion, idComunidad: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.post<DataPackage>(`${this.publicacionsUrl}/crear/${idUsuario}/${idComunidad}`, publicacion);
}
  estaLikeada(idPublicacion: number) {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/isLikeada/${this.authService.getUsuarioId()}/${idPublicacion}`);
  }

  sacarLike(idPublicacion: number) {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/deslikear/${this.authService.getUsuarioId()}/${idPublicacion}`);
  }

  darLike(idPublicacion: number) {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/likear/${this.authService.getUsuarioId()}/${idPublicacion}`);
  }
  comentar(idPublicacion: number, comentario: string) {
    return this.http.post<DataPackage>(` ${this.publicacionsUrl}/comentar/${this.authService.getUsuarioId()}/${idPublicacion}`, comentario);
  }
  comentarios(idPublicacion: number) {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/comentarios/${idPublicacion}`);
  }
  publicacionesPaginadas(idUsuario: number,page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.publicacionsUrl}/publicaciones/usuario/${idUsuario}?page=${page}&size=${size}`);
  }


  publicacionesComunidad(idComunidad: number,page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.publicacionsUrl}/publicaciones/comunidad/${idComunidad}?page=${page}&size=${size}`);
  }

  publicacionesAmigos(idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.publicacionsUrl}/publicaciones/amigos/usuario/${idUsuario}`);
  }


  publicacionesHome(idUsuario:number, page: number, size: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.publicacionsUrl}/publicacionesHome/${idUsuario}?page=${page}&size=${size}`);
  }
  

  publicadoPor(idPublicacion: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.publicacionsUrl}/usuarioPublicador/${idPublicacion}`);
  }
  
  cantidadLikes(idPublicacion: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.publicacionsUrl}/cantidadLikes/${idPublicacion}`);
  }

  eliminar(idPublicacion: number): Observable<DataPackage> {
    return this.http.delete<DataPackage>(`${this.publicacionsUrl}/eliminar/${idPublicacion}`);
  }

  publicacionesAmigos2(userId: number, page: number = 0, pageSize: number = 5): Observable<any> {
    return this.http.get(`${this.publicacionsUrl}/publicaciones/amigos/usuario/${userId}?page=${page}&size=${pageSize}`);
  }





}