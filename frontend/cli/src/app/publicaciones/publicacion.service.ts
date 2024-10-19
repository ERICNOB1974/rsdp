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
  estaLikeada(idPublicacion:number) {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/isLikeada/${this.authService.getUsuarioId()}/${idPublicacion}`);
  }

  sacarLike(idPublicacion:number) {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/deslikear/${this.authService.getUsuarioId()}/${idPublicacion}`);
  }
  
  darLike(idPublicacion:number) {
    return this.http.get<DataPackage>(` ${this.publicacionsUrl}/likear/${this.authService.getUsuarioId()}/${idPublicacion}`);
  }


}