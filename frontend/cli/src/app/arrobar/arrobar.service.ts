import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
    providedIn: 'root'
})
export class ArrobarService {


    private arrobarUrl = 'rest/arrobar';

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }


    arrobarEnPublicacion(idEtiquetado: number, idPublicacion: number): Observable<DataPackage> {
        console.info("hola llego aca")
        return this.http.put<DataPackage>(`${this.arrobarUrl}/etiquetarPublicacion/${this.authService.getUsuarioId()}/${idEtiquetado}/${idPublicacion}`, null);
    }

    arrobarEnComentario(idEtiquetado: number, idComentario: number): Observable<DataPackage> {
        return this.http.put<DataPackage>(`${this.arrobarUrl}/etiquetarComentario/${this.authService.getUsuarioId()}/${idEtiquetado}/${idComentario}`, null);
    }

    listaUsuarios(termino: string): Observable<DataPackage> {
        return this.http.get<DataPackage>(`${this.arrobarUrl}/buscar/${this.authService.getUsuarioId()}/${termino}`);
    }



}