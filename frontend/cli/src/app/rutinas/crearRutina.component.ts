import { CommonModule } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { FormControl, FormsModule, NgModel } from '@angular/forms';
import { Dia } from './dia';
import { Ejercicio } from './ejercicio';
import { TipoEjercicio } from './tipoEjercicio';
import { RutinaService } from './rutina.service';

@Component({
  selector: 'app-crearRutina',
  templateUrl: './crearRutina.component.html',
  styleUrls: ['./crearRutina.component.css'],
  imports: [CommonModule, FormsModule],
  standalone: true
})
export class CrearRutinaComponent {
  nombreRutina: string = '';
  descripcionRutina: string = '';
  dias: Dia[] = [];
  rutinaId: string | null = null;

  constructor(
    private rutinaService: RutinaService
  ) {}

  agregarDiaTrabajo() {
    const nuevoDia: Dia = {
      nombre: '',
      descripcion: '',
      ejercicios: [],
      tipo: 'trabajo',
    };
    this.dias.push(nuevoDia);
  }

  agregarDiaDescanso() {
    if (this.esDiaDescansoHabilitado()) {
      const nuevoDia: Dia = {
        nombre: 'Día de descanso', tipo: 'descanso', ejercicios: [],
        descripcion: ''
      };
      this.dias.push(nuevoDia);
    }
  }

  agregarEjercicio(dia: Dia, tipo: TipoEjercicio) {
    const nuevoEjercicio: Ejercicio = {
      nombre: '',
      repeticiones: tipo === 'series' ? 0 : undefined,
      series: tipo === 'series' ? 0 : undefined,
      tiempo: tipo === 'resistencia' ? '' : undefined,
      descripcion: '',
      imagen: '',
      tipo: tipo,
    };
    dia.ejercicios.push(nuevoEjercicio);
  }

  borrarDia(index: number) {
    this.dias.splice(index, 1);
    this.verificarPrimerDia();
  }

  borrarEjercicio(dia: Dia, index: number) {
    dia.ejercicios.splice(index, 1);
  }

  // async guardarRutina() {
  //   // 1. Guardar la rutina y obtener su ID
  //   try {
  //     const rutina = { nombre: this.nombreRutina, descripcion: this.descripcionRutina };
  //     this.rutinaId = await this.rutinaService.guardarRutina(rutina);

  //     // 2. Guardar cada día con su orden
  //     for (let i = 0; i < this.dias.length; i++) {
  //       const diaId = await this.rutinaService.guardarDia(this.rutinaId, this.dias[i], i + 1);

  //       // 3. Guardar los ejercicios para ese día con su orden
  //       for (let j = 0; j < this.dias[i].ejercicios.length; j++) {
  //         const ejercicio = this.dias[i].ejercicios[j];
  //         await this.rutinaService.guardarEjercicio(diaId, ejercicio, j + 1);
  //       }
  //     }
  //     alert('Rutina guardada con éxito');
  //   } catch (error) {
  //     console.error('Error al guardar la rutina:', error);
  //     alert('Error al guardar la rutina.');
  //   }
  // }

  esDiaDescansoHabilitado(): boolean {
    return this.dias.some((dia) => dia.tipo === 'trabajo');
  }

  verificarPrimerDia() {
    if (this.dias.length > 0 && this.dias[0].tipo === 'descanso') {
      this.dias.shift(); // Elimina el primer día si es de descanso.
    }
  }

}