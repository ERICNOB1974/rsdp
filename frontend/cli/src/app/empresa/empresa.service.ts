import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataPackage } from '../data-package';
import { Empresa } from './empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {

  private empresasUrl = "rest/empresas";
  constructor(
    private http: HttpClient
  ) { }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.empresasUrl}/search/${searchTerm}`);
  }

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.empresasUrl}/page?page=${page-1}&size=${size}`); 
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.empresasUrl}/${id}`);
  }

  save(empresa: Empresa): Observable<DataPackage>{
    return empresa.id 
    ? this.http.put<DataPackage>(this.empresasUrl, empresa)
    : this.http.post<DataPackage>(this.empresasUrl, empresa);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.empresasUrl}/id/${id}`);
  }

}