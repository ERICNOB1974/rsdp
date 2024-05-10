import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataPackage } from '../data-package';
import { HttpClient } from '@angular/common/http';
import { ParteMO } from './parteMO';

@Injectable({
  providedIn: 'root'
})
export class ParteMOService {

  private partesUrl = 'rest/partes';
  
  constructor(
    private http: HttpClient
  ) { }

  get(id: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/id/${id}`);
  }

  save(parteMO: ParteMO): Observable<DataPackage> {
    if (!parteMO.id || parteMO.id < 0) {
      return this.http.post<DataPackage>(this.partesUrl, parteMO);
    } else {
      return this.http.put<DataPackage>(this.partesUrl, parteMO);
    }
  }
  

  byPage(page: number, size: number): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/page?page=${page-1}&size=${size}`); 
  }

  informePartesPorFecha(fecha: string): Observable<DataPackage>{
    return this.http.get<DataPackage>(`${this.partesUrl}/informeFecha/${fecha}`);
  }

  remove(id: number): Observable<DataPackage>{
    return this.http.delete<DataPackage>(`${this.partesUrl}/${id}`);
  }

}