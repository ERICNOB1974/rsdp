import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, NgModule } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { Ejercicio } from './ejercicio';
import { RutinaService } from './rutina.service';
import { Rutina } from './rutina';
import { Observable, catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { Etiqueta } from '../etiqueta/etiqueta';
import { DataPackage } from '../data-package';
import { EtiquetaPopularidadDTO } from '../etiqueta/etiquetaPopularidadDTO';
import { Dia } from './dia';
import { TipoEjercicio } from './tipoEjercicio';

@Component({
  selector: 'app-crearRutina',
  templateUrl: './crearRutina.component.html',
  styleUrls: ['./crearRutina.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgbTypeaheadModule],
  standalone: true
})
export class CrearRutinaComponent {
  nombreRutina: string = '';
  descripcionRutina: string = '';
  dias: Dia[] = [];
  rutinaId: string | null = null;
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;

  constructor(
    private rutinaService: RutinaService,
    private etiquetaService: EtiquetaService,
    private cdr: ChangeDetectorRef  
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
        nombre: 'Día de descanso',
        tipo: 'descanso',
        ejercicios: [],
        descripcion: ''
      };
      this.dias.push(nuevoDia);
    }
  }

  agregarEjercicio(dia: Dia, tipo: TipoEjercicio) {
    const nuevoEjercicio: Ejercicio = {
      nombre: '',
      repeticiones: tipo === 'series' ? null : null,
      series: tipo === 'series' ? null : null,
      tiempo: tipo === 'resistencia' ? '' : '',
      descripcion: '',
      imagen: '',
      tipo: tipo,
    };
    dia.ejercicios.push(nuevoEjercicio);
  }

  borrarDia(index: number) {
    // Elimina el día en el índice especificado
    this.dias.splice(index, 1);

    // Verifica si el primer día es de descanso y actúa en consecuencia
    this.validarPrimerDia();
  }

  validarPrimerDia() {
    // Mientras el primer día sea de descanso, sigue eliminando
    while (this.dias.length > 0 && this.dias[0].tipo === 'descanso') {
      this.dias.shift(); // Elimina el primer día
    }
  }

  borrarEjercicio(dia: Dia, index: number) {
    dia.ejercicios.splice(index, 1);
  }

  esDiaDescansoHabilitado(): boolean {
    return this.dias.some((dia) => dia.tipo === 'trabajo');
  }

  validarTiempo(ejercicio: Ejercicio) {
    const tiempoRegex = /^([0-5]?[0-9]):([0-5][0-9])$/;
    ejercicio.tiempoValido = tiempoRegex.test(ejercicio.tiempo || '');
  }

  validarNumerico(ejercicio: Ejercicio & { [key: string]: any }, campo: 'series' | 'repeticiones') {
    const valor = ejercicio[campo];
    (ejercicio as any)[campo + 'Valido'] = valor !== null && valor > 0;
  }

  esFormularioValido(): boolean {

    if (
      !this.nombreRutina.trim() ||
      this.dias.length === 0 ||
      this.dias[0].tipo === 'descanso' ||
      this.etiquetasSeleccionadas.length === 0 ||
      this.etiquetasSeleccionadas.length > 15 
    ) {
      return false;
    }

    for (const dia of this.dias) {
      if (dia.tipo === 'trabajo') {
        if (!dia.nombre.trim() || dia.ejercicios.length === 0) return false;

        for (const ejercicio of dia.ejercicios) {

          if (ejercicio.tipo === 'series') {
            if (!ejercicio.seriesValido || !ejercicio.repeticionesValido) return false;
          } else if (ejercicio.tipo === 'resistencia' && !ejercicio.tiempoValido) {
            return false;
          }
        }
      }
    }
    return true;
  }

  async guardarRutina() {
    if (!this.esFormularioValido()) {
      alert('Complete todos los campos obligatorios y añada al menos un ejercicio por día de trabajo.');
      return;
    }

    try {
      const rutina = { nombre: this.nombreRutina, descripcion: this.descripcionRutina };
      this.rutinaId = await this.rutinaService.guardarRutina(rutina);

      const rutinaConId: Rutina = { 
        id: parseInt(this.rutinaId, 10), 
        nombre: this.nombreRutina, 
        descripcion: this.descripcionRutina 
    };
      // Verificar y crear etiquetas si es necesario
      for (const etiqueta of this.etiquetasSeleccionadas) {
        const existe = await this.etiquetaService.verificarExistencia(etiqueta.nombre).toPromise();
        let etiquetaFinal = etiqueta;

        if (!existe) {
          const nuevaEtiqueta = { id: 0, nombre: etiqueta.nombre }; // Asegura que tenga un 'id'
          etiquetaFinal = await firstValueFrom(this.etiquetaService.crearEtiqueta(nuevaEtiqueta));
        } else {
          etiquetaFinal = etiqueta;
        }
        // Realizar la etiquetación con la etiqueta final
        await this.rutinaService.etiquetar(rutinaConId, etiquetaFinal.id).toPromise();
      }

      // Guardar los días y ejercicios
      for (let i = 0; i < this.dias.length; i++) {
        const diaId = await this.rutinaService.guardarDia(this.dias[i], this.rutinaId, i + 1);

        for (let j = 0; j < this.dias[i].ejercicios.length; j++) {
          const ejercicio = this.dias[i].ejercicios[j];
          const ejercicioData = {
            nombre: ejercicio.nombre,
            repeticiones: ejercicio.repeticiones,
            series: ejercicio.series,
            tiempo: ejercicio.tiempo,
            descripcion: ejercicio.descripcion,
            imagen: ejercicio.imagen,
            tipo: ejercicio.tipo
          };

          if (ejercicio.tipo === 'resistencia') {
            await this.rutinaService.guardarEjercicioResistencia(ejercicioData, diaId, j + 1, ejercicioData.tiempo);
          } else {
            await this.rutinaService.guardarEjercicioSeries(ejercicioData, diaId, j + 1, <number>ejercicio.series, <number>ejercicio.repeticiones);
          }
        }
      }

      alert('Rutina guardada con éxito');
      window.location.reload();
    } catch (error) {
      console.error('Error al guardar la rutina:', error);
      alert('Error al guardar la rutina.');
    }
  }



  searchEjercicio = (text$: Observable<string>): Observable<Ejercicio[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.rutinaService
          .search(term)
          .pipe(
            map((response) => response.data as Ejercicio[]),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    );

  resultFormatEjercicio(value: Ejercicio) {
    return value.nombre;
  }

  inputFormatEjercicio(value: Ejercicio) {
    return value ? value.nombre : '';
  }

  searchEtiqueta = (text$: Observable<string>): Observable<EtiquetaPopularidadDTO[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.etiquetaService.search(term).pipe(
          map((response: DataPackage) => response.data as EtiquetaPopularidadDTO[]),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );

    agregarEtiqueta(event: any): void {
      const etiqueta: Etiqueta = event.item;
    
      // Verificar por nombre en lugar de por ID para evitar duplicados
      if (!this.etiquetasSeleccionadas.some(e => e.nombre === etiqueta.nombre)) {
        this.etiquetasSeleccionadas.push(etiqueta);
      }
    
      // Restablecer la etiqueta seleccionada
      this.etiquetaSeleccionada = null;
    
      // Forzar actualización visual del input
      this.cdr.detectChanges();
    }
    

    eliminarEtiqueta(etiqueta: Etiqueta): void {
      this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(
        e => e.nombre !== etiqueta.nombre 
      );
    }
    
  resultFormatEtiqueta(value: EtiquetaPopularidadDTO): string {
    return `${value.nombre} (${value.popularidad})`;
  }

  inputFormatEtiqueta(value: Etiqueta): string {
    return value ? value.nombre : '';
  }

}