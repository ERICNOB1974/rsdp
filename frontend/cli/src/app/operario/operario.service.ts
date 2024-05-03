import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { Operario } from './operario';

@Injectable({
  providedIn: 'root'
})
export class OperarioService {

  private operariosUrl = 'rest/operarios';
  
  constructor(
    private http: HttpClient
  ) { }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.operariosUrl}/search/${searchTerm}`);
  }

  get(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.operariosUrl}/id/${id}`);
  }

  save (operario: Operario): Observable<DataPackage>{
    return operario.id 
    ? this.http.put<DataPackage>(this.operariosUrl, operario)
    : this.http.post<DataPackage>(this.operariosUrl, operario);
  }

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.operariosUrl}/page?page=${page-1}&size=${size}`); 
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.operariosUrl}/${id}`);
  }

}