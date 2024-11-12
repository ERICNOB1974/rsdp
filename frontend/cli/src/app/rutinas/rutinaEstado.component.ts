// rutina-state.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RutinaEstadoService {
  private reiniciarRutina: boolean = false;

  setReiniciarRutina(reiniciar: boolean): void {
    this.reiniciarRutina = reiniciar;
  }

  getReiniciarRutina(): boolean {
    return this.reiniciarRutina;
  }

  clearReiniciarRutina(): void {
    this.reiniciarRutina = false;
  }
}
