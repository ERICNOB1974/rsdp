import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Tarea } from './tarea';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  private tareasUrl = 'rest/tareas';
  
  constructor(
    private http: HttpClient
  ) { }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.tareasUrl}/search/${searchTerm}`);
  }

  get(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.tareasUrl}/id/${id}`);
  }

  save (tarea: Tarea): Observable<DataPackage>{
    return tarea.id 
    ? this.http.put<DataPackage>(this.tareasUrl, tarea)
    : this.http.post<DataPackage>(this.tareasUrl, tarea);
  }

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.tareasUrl}/page?page=${page-1}&size=${size}`); 
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.tareasUrl}/${id}`);
  }

}