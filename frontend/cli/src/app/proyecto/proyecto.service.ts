import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Proyecto } from './proyecto';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  private proyectosUrl = 'rest/proyectos';
  
  constructor(
    private http: HttpClient
  ) { }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.proyectosUrl}/search/${searchTerm}`);
  }

  get(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.proyectosUrl}/id/${id}`);
  }

  save (proyecto: Proyecto): Observable<DataPackage>{
    return proyecto.id 
    ? this.http.put<DataPackage>(this.proyectosUrl, proyecto)
    : this.http.post<DataPackage>(this.proyectosUrl, proyecto);
  }

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.proyectosUrl}/page?page=${page-1}&size=${size}`); 
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.proyectosUrl}/${id}`);
  }

}