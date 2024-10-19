import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rutina } from './rutina';
import { Dia } from './dia';
import { Ejercicio } from './ejercicio';

@Injectable({
  providedIn: 'root',
})
export class RutinaService {
  private rutinasUrl = 'rest/rutinas'; 

  constructor(private http: HttpClient) {}

  guardarRutina(rutina: Rutina): Promise<string | undefined> {
    return this.http.post<string>(`${this.rutinasUrl}`, rutina).toPromise();
  }

  guardarDia(rutinaId: string, dia: Dia, orden: number): Promise<string | undefined> {
    return this.http.post<string>(`${this.rutinasUrl}/${rutinaId}/dias`, { ...dia, orden }).toPromise();
  }

  guardarEjercicio(diaId: string, ejercicio: Ejercicio, orden: number): Promise<void> {
    return this.http.post<void>(`${this.rutinasUrl}/dias/${diaId}/ejercicios`, { ...ejercicio, orden }).toPromise();
  }
}
