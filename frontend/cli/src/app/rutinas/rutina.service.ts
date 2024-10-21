import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Rutina } from './rutina';
import { firstValueFrom } from 'rxjs';
import { DataPackage } from '../data-package';
import { Ejercicio } from './ejercicio';
import { Dia } from './dia';

@Injectable({
  providedIn: 'root'
})
export class RutinaService {

  private rutinasUrl = 'rest/rutinas';

  constructor(private http: HttpClient) { }

  async guardarRutina(rutina: Rutina): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<string>(this.rutinasUrl, rutina)
    );
    if (!response) throw new Error('No se pudo guardar la rutina');
    return response;
  }

  async guardarDia(dia: Dia, idRutina: string, orden: number): Promise<string> {
    const response = await firstValueFrom(
      this.http.post<string>(`${this.rutinasUrl}/dias/${idRutina}`, { dia, orden })
    );
    if (!response) throw new Error('No se pudo guardar el día');
    return response;
  }

  async guardarEjercicioResistencia(
    ejercicio: Ejercicio, idDia: string, orden: number, tiempo: string
  ): Promise<void> {
    if (ejercicio.nombre.nombre) {
      ejercicio.nombre = ejercicio.nombre.nombre;
    }
    await firstValueFrom(
      this.http.post(`${this.rutinasUrl}/dias/ejerciciosResistencia/${idDia}`, {
        ejercicio,
        orden,
        tiempo
      })
    );
  }

  async guardarEjercicioSeries(
    ejercicio: Ejercicio, idDia: string, orden: number, series: number, repeticiones: number
  ): Promise<void> {
    if (ejercicio.nombre.nombre) {
      ejercicio.nombre = ejercicio.nombre.nombre;
    }
    await firstValueFrom(
      this.http.post(`${this.rutinasUrl}/dias/ejerciciosSeries/${idDia}`, {
        ejercicio,
        orden,
        series,
        repeticiones
      })
    );
  }

  search(searchTerm: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/search/${searchTerm}`);
  }

  etiquetar(rutina: Rutina, idEtiqueta: number): Observable<DataPackage> {
    return this.http.post<DataPackage>(` ${this.rutinasUrl}/etiquetar/${idEtiqueta}`, rutina );
  }

  sugerencias(nombreUsuario: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/sugerencias/${nombreUsuario}`);
  }

  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/findById/${id}`);
  }

  getEjerciciosDeRutina(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/${id}/ejercicios`);
  }

  obtenerDiasEnRutina(idRutina: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/obtenerDiasEnRutina/${idRutina}`);
  }

  obtenerRutinasPorUsuario(idUsuario: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/realiza/${idUsuario}`);
  }
  
  obtenerEtiquetasDeRutina(idRutina: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/etiquetas/${idRutina}`);
  }
}


