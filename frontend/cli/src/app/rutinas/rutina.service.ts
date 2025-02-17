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

  guardarRutinaOptimizada(rutinaCompleta: any): Observable<DataPackage> {
    const usuarioId = this.authService.getUsuarioId();
    return this.http.post<DataPackage>(`${this.rutinasUrl}/guardarRutinaCompleta/${usuarioId}`, rutinaCompleta);
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


  sugerencias(page: number, size: number): Observable<DataPackage> {
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

  rutinasRealizaUsuarioSinPaginacion(): Observable<DataPackage[]> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.rutinasUrl}/rutinasRealizaUsuarioSinPaginacion/${idUsuario}`).pipe(
      map((response: DataPackage) => {
        let rutinas = response.data as any[];

        // No es necesario ordenar los días ni ejercicios, ya se hace en el backend
        return rutinas;
      })
    );
  }

  obtenerDiasEnRutina(idRutina: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/obtenerDiasEnRutina/${idRutina}`);
  }

  obtenerEtiquetasDeRutina(idRutina: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/etiquetas/${idRutina}`);
  }


  filtrarNombre(nombre: string, tipoTab: string, usuarioId: number): Observable<DataPackage> {
    return this.http.get<DataPackage>(`${this.rutinasUrl}/filtrar/nombre`,
      {
        params: {
          nombre: nombre,
          tipo: tipoTab,
          usuarioId: usuarioId
        }
      });
  }

  filtrarEtiqueta(etiquetas: string[], tipo: string, usuarioId: number): Observable<DataPackage> {
    let params = new HttpParams().set('etiquetas', etiquetas.join(',')); // convierte el array a una cadena separada por comas

    if (tipo) {
      params = params.set('tipo', tipo); // agrega el tipo si está definido
    }

    if (usuarioId) {
      params = params.set('usuarioId', usuarioId.toString()); // agrega el idUsuario si está definido
    }

    return this.http.get<DataPackage>(`${this.rutinasUrl}/filtrar/etiquetas`, { params });
  }

  rutinasCreadasPorUsuario(offset: number, limit: number): Observable<DataPackage> {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.rutinasUrl}/rutinasCreadasPorUsuario/${userId}?offset=${offset}&limit=${limit}`);
  }

  rutinasCreadasPorUsuarioFiltradas(nombreRutina: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.rutinasUrl}/rutinasCreadasPorUsuarioFiltradas/${this.authService.getUsuarioId()}?page=${page}&size=${size}` +
      (nombreRutina ? `&nombreRutina=${nombreRutina}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);

  }


  rutinasRealizaUsuario(idUsuario: number, nombreRutina: string, page: number, size: number): Observable<DataPackage> {
    // Si nombreRutina está vacío, no lo incluimos en la URL
    const url = `${this.rutinasUrl}/rutinasRealizaUsuario/${idUsuario}?page=${page}&size=${size}` +
      (nombreRutina ? `&nombreRutina=${nombreRutina}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }

  disponibles(page: number, size: number): Observable<DataPackage> {
    const idUsuario = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(` ${this.rutinasUrl}/${idUsuario}/disponibles?page=${page}&size=${size}`);
  }

  obtenerProgresoActual(rutinaId: number): Observable<DataPackage> {
    const usuarioId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.rutinasUrl}/obtenerProgresoActual/${rutinaId}/${usuarioId}`);
  }



  marcarRutinaFavorita(idRutina: number) {
    const userId = this.authService.getUsuarioId();
    return this.http.post(`${this.rutinasUrl}/cambiarFavorito/${userId}/${idRutina}`, null);
  }

  esFavorita(idRutina: number) {
    const userId = this.authService.getUsuarioId();
    return this.http.get<DataPackage>(`${this.rutinasUrl}/esFavorita/${userId}/${idRutina}`);
  }


  rutinasFavoritas(idUsuario: number, nombreRutina: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.rutinasUrl}/rutinasFavoritas/${idUsuario}?page=${page}&size=${size}` +
      (nombreRutina ? `&nombreRutina=${nombreRutina}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }


  busquedaRutinasCreadasUsuarioGoogle(termino: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.rutinasUrl}/busquedaRutinasCreadasUsuarioGoogle/${this.authService.getUsuarioId()}?page=${page}&size=${size}` +
      (termino ? `&termino=${termino}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);

  }
  busquedaRutinasDisponiblesUsuarioGoogle(termino: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.rutinasUrl}/busquedaRutinasDisponiblesUsuarioGoogle/${this.authService.getUsuarioId()}?page=${page}&size=${size}` +
      (termino ? `&termino=${termino}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);

  }

  busquedaRutinasRealizaUsuarioGoogle(idUsuario:number, termino: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.rutinasUrl}/busquedaRutinasRealizaUsuarioGoogle/${idUsuario}?page=${page}&size=${size}` +
      (termino ? `&termino=${termino}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }

  busquedaRutinasFavoritasUsuarioGoogle(idUsuario:number, termino: string, page: number, size: number): Observable<DataPackage> {
    const url = `${this.rutinasUrl}/busquedaRutinasFavoritasUsuarioGoogle/${idUsuario}?page=${page}&size=${size}` +
      (termino ? `&termino=${termino}` : '');  // Agregar solo si no está vacío
    return this.http.get<DataPackage>(url);
  }
}


