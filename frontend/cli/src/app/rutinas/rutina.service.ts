import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

import { Rutina } from './rutina';
import { firstValueFrom } from 'rxjs';
import { DataPackage } from '../data-package';
import { Ejercicio } from './ejercicio';
import { Dia } from './dia';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RutinaService {

  private rutinasUrl = 'rest/rutinas';

  constructor(private http: HttpClient, private authService: AuthService) { }

  async guardarRutina(rutina: Rutina): Promise<string> {
    const usuarioId = this.authService.getUsuarioId();
    const response = await firstValueFrom(
      this.http.post<string>(`${this.rutinasUrl}/create/${usuarioId}`, rutina)
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
    return this.http.post<DataPackage>(` ${this.rutinasUrl}/etiquetar/${idEtiqueta}`, rutina);
  }

  crearRelacionRealizaRutina(rutinaId: number): Observable<DataPackage> {
    const usuarioId = this.authService.getUsuarioId();
    return this.http.post<DataPackage>(` ${this.rutinasUrl}/crearRelacionRealizaRutina/${rutinaId}/${usuarioId}`, null);
  }

  crearRelacionDiaFinalizado(diaId: number): Observable<DataPackage> {
    const usuarioId = this.authService.getUsuarioId();
    return this.http.post<DataPackage>(` ${this.rutinasUrl}/crearRelacionDiaFinalizado/${diaId}/${usuarioId}`, null);
  }

  verificarDiaFinalizado(diaId: number): Observable<DataPackage> {
    const usuarioId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.rutinasUrl}/verificarDiaFinalizado/${diaId}/${usuarioId}`);
  }

 
  sugerencias(page:number, size:number): Observable<DataPackage> {
    const nombreUsuario = this.authService.getNombreUsuario();

    return this.http.get<DataPackage>(` ${this.rutinasUrl}/sugerencias-combinadas/${nombreUsuario}?page=${page}&size=${size}`);
  }


  all(): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/findAll`);
  }

  get(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/findById/${id}`);
  }

  getRutinaYejercicios(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/rutina/${id}`);
  }

  getEjerciciosDeRutina(id: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/${id}/ejercicios`);
  }

  getRutinaOrdenada(id: string): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/rutina/${id}`).pipe(
      map((response: DataPackage) => {
        let data = response.data as any;
        // Ordenar los días por el atributo "orden"
        data.dias = data.dias.sort((a: any, b: any) => a.orden - b.orden);
        // Ordenar los ejercicios dentro de cada día
        data.dias.forEach((dia: any) => {
          dia.ejerciciosRepeticiones = dia.ejerciciosRepeticiones.sort((a: any, b: any) => a.orden - b.orden);
          dia.ejerciciosTiempo = dia.ejerciciosTiempo.sort((a: any, b: any) => a.orden - b.orden);
        });
        return response;
      })
    );
  }

  obtenerDiasEnRutina(idRutina: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/obtenerDiasEnRutina/${idRutina}`);
  }

  obtenerEtiquetasDeRutina(idRutina: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/etiquetas/${idRutina}`);
  }

  filtrarNombre(nombre: string): Observable<DataPackage> {
    // Agregamos los parámetros min y max a la URL
    return this.http.get<DataPackage>(`${this.rutinasUrl}/filtrar/nombre`, {
      params: {
        nombre
      }
    });
  }

  filtrarEtiqueta(etiquetas: string[]): Observable<DataPackage> {
    const params = new HttpParams().set('etiquetas', etiquetas.join(',')); // convierte el array a una cadena separada por comas
    return this.http.get<DataPackage>(`${this.rutinasUrl}/filtrar/etiquetas`, { params });
  }


  rutinasCreadasPorUsuario(offset: number, limit: number): Observable<DataPackage> {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.rutinasUrl}/rutinasCreadasPorUsuario/${userId}?offset=${offset}&limit=${limit}`);
  }

  rutinasRealizaUsuario(usuarioId: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/rutinasRealizaUsuario/${usuarioId}`);
  }

  obtenerProgresoActual(rutinaId: number): Observable<DataPackage>{
    const usuarioId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.rutinasUrl}/obtenerProgresoActual/${rutinaId}/${usuarioId}`);
  }

}


