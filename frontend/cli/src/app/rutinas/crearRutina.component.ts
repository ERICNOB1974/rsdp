import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { Observable, catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, of, switchMap, tap } from 'rxjs';
import { DataPackage } from '../data-package';
import { Etiqueta } from '../etiqueta/etiqueta';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { EtiquetaPopularidadDTO } from '../etiqueta/etiquetaPopularidadDTO';
import { Dia } from './dia';
import { Ejercicio } from './ejercicio';
import { RutinaService } from './rutina.service';
import { TipoEjercicio } from './tipoEjercicio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgxMaskDirective } from 'ngx-mask';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crearRutina',
  templateUrl: './crearRutina.component.html',
  styleUrls: ['./crearRutina.component.css', '../css/etiquetas.css', '../css/crear.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatChipsModule,
    NgbTypeaheadModule],
  standalone: true
})
export class CrearRutinaComponent implements OnInit {
  idRutina: number | undefined;
  nombreRutina: string = '';
  descripcionRutina: string = '';
  dias: Dia[] = [];
  rutinaId: string | null = null;
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null; // Para mostrar la vista previa de la imagen o video
  formatoValido: boolean = true;

  constructor(
    private rutinaService: RutinaService,
    private etiquetaService: EtiquetaService,
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
    private router: Router
  ) {

  }
  ngOnInit(): void {
  }

  get nombreRutinaValid() {
    return this.nombreRutina.trim().length > 0;
  }
  validarEtiquetas() {
    return this.etiquetasSeleccionadas.length > 0;
  }
  todosLosDiasTienenEjercicios(): boolean {
    return this.dias.every(dia => dia.ejercicios && dia.ejercicios.length > 0);
  }


  agregarDiaTrabajo() {
    const nuevoDia: Dia = {
      nombre: '',
      descripcion: '',
      ejercicios: [],
      tipo: 'trabajo'
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

  // validarTiempo(ejercicio: Ejercicio) {
  //   const tiempoRegex = /^([0-5]?[0-9]):([0-5][0-9])$/;
  //   ejercicio.tiempoValido = tiempoRegex.test(ejercicio.tiempo || '');
  // }

  validarNumerico(ejercicio: Ejercicio & { [key: string]: any }, campo: 'series' | 'repeticiones') {
    const valor = ejercicio[campo];
    (ejercicio as any)[campo + 'Valido'] = valor !== null && valor > 0;
  }

  validarSerieORepeticion(numero: number | null): boolean {
    if (numero != null && numero > 0) {
      return true;
    }
    return false;
  }
  esFormularioValido(): boolean {

    if (
      !this.nombreRutina.trim() ||
      this.dias.length === 0 ||
      this.dias[0].tipo === 'descanso' ||
      this.etiquetasSeleccionadas.length === 0 ||
      this.etiquetasSeleccionadas.length > 15 ||
      !this.todosLosDiasTienenEjercicios()
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

  // async guardarRutina() {
  //   if (!this.esFormularioValido()) {
  //     alert('Complete todos los campos obligatorios y añada al menos un ejercicio por día de trabajo.');
  //     return;
  //   }

  //   try {
  //     const rutina = { nombre: this.nombreRutina, descripcion: this.descripcionRutina };
  //     this.rutinaId = await this.rutinaService.guardarRutina(rutina);

  //     const rutinaConId: Rutina = {
  //       id: parseInt(this.rutinaId, 10),
  //       nombre: this.nombreRutina,
  //       descripcion: this.descripcionRutina
  //     };
  //     // Verificar y crear etiquetas si es necesario
  //     for (const etiqueta of this.etiquetasSeleccionadas) {
  //       const existe = await this.etiquetaService.verificarExistencia(etiqueta.nombre).toPromise();
  //       let etiquetaFinal = etiqueta;

  //       if (!existe) {
  //         const nuevaEtiqueta = { id: 0, nombre: etiqueta.nombre }; // Asegura que tenga un 'id'
  //         etiquetaFinal = await firstValueFrom(this.etiquetaService.crearEtiqueta(nuevaEtiqueta));
  //       } else {
  //         etiquetaFinal = etiqueta;
  //       }
  //       // Realizar la etiquetación con la etiqueta final
  //       await this.rutinaService.etiquetar(rutinaConId, etiquetaFinal.id).toPromise();
  //     }

  //     // Guardar los días y ejercicios
  //     for (let i = 0; i < this.dias.length; i++) {
  //       const diaId = await this.rutinaService.guardarDia(this.dias[i], this.rutinaId, i + 1);

  //       for (let j = 0; j < this.dias[i].ejercicios.length; j++) {
  //         const ejercicio = this.dias[i].ejercicios[j];
  //         const ejercicioData = {
  //           nombre: ejercicio.nombre,
  //           repeticiones: ejercicio.repeticiones,
  //           series: ejercicio.series,
  //           tiempo: ejercicio.tiempo,
  //           descripcion: ejercicio.descripcion,
  //           imagen: ejercicio.imagen,
  //           tipo: ejercicio.tipo
  //         };

  //         if (ejercicio.tipo === 'resistencia') {
  //           await this.rutinaService.guardarEjercicioResistencia(ejercicioData, diaId, j + 1, ejercicioData.tiempo);
  //         } else {
  //           await this.rutinaService.guardarEjercicioSeries(ejercicioData, diaId, j + 1, <number>ejercicio.series, <number>ejercicio.repeticiones);
  //         }
  //       }
  //     }

  //     alert('Rutina guardada con éxito');
  //     window.location.reload();
  //   } catch (error) {
  //     console.error('Error al guardar la rutina:', error);
  //     alert('Error al guardar la rutina.');
  //   }
  // }

  onSelectEjercicio(ejercicioSeleccionado: Ejercicio, dia: Dia) {
    const ejercicio = dia.ejercicios[dia.ejercicios.length - 1]; // Obtener el último ejercicio agregado
    ejercicio.nombre = ejercicioSeleccionado.nombre; // Asignar solo el nombre

  }


  async guardarRutinaOptimizada() {
    if (!this.esFormularioValido()) {
      this.snackBar.open('Complete todos los campos obligatorios y añada al menos un ejercicio por día de trabajo.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    try {
      const rutinaCompleta = {
        nombre: this.nombreRutina,
        descripcion: this.descripcionRutina,
        etiquetas: this.etiquetasSeleccionadas.map(etiqueta => ({ nombre: etiqueta.nombre })),
        dias: this.dias.map((dia, index) => ({
          nombre: dia.nombre,
          descripcion: dia.descripcion,
          orden: index + 1,
          ejercicios: dia.ejercicios.map((ejercicio, j) => {
            // Verificar si 'ejercicio.nombre' es un objeto, y si es así, tomar 'ejercicio.nombre.nombre'
            const nombreEjercicio = typeof ejercicio.nombre === 'object' && ejercicio.nombre !== null
              ? ejercicio.nombre.nombre
              : ejercicio.nombre;

            return {
              nombre: nombreEjercicio,
              descripcion: ejercicio.descripcion,
              imagen: ejercicio.imagen,
              tipo: ejercicio.tipo,
              orden: j + 1,
              tiempo: ejercicio.tiempo || null,
              series: ejercicio.series || null,
              repeticiones: ejercicio.repeticiones || null,
            };
          })
        }))
      };

      this.rutinaService.guardarRutinaOptimizada(rutinaCompleta).subscribe(dataPackage => {
        this.idRutina = <number><unknown>dataPackage.data;
        this.router.navigate([`rutinas/${this.idRutina}`], {
          state: { mensajeSnackBar: 'Rutina creada correctamente.' }
        });
      });

    } catch (error) {
      console.error('Error al guardar la rutina optimizada:', error);
      this.snackBar.open('Error al guardar la rutina.', 'Cerrar', {
        duration: 3000,
      });
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
            map((ejercicios) =>
              ejercicios.filter((value, index, self) =>
                index === self.findIndex((e) => e.nombre === value.nombre)
              )
            ),
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

  onFileSelect(event: any, ejercicio: Ejercicio) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file && validImageTypes.includes(file.type)) {
      const reader = new FileReader();

      reader.onload = () => {
        ejercicio.imagen = reader.result as string; // Almacena la cadena base64 en el ejercicio.
        this.vistaPreviaArchivo = reader.result; // Para mostrar la vista previa.
      };

      reader.readAsDataURL(file);
    } else {
      this.snackBar.open('Formato no válido. Solo se permiten imágenes JPEG, PNG, o GIF.', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  filtrarEntrada(event: Event, ejercicio: Ejercicio) {
    const input = (event.target as HTMLInputElement);
    let valor = input.value.replace(/[^0-9]/g, ''); // Eliminar caracteres no numéricos

    // Forzar formato MM:SS
    if (valor.length > 2) {
      valor = valor.slice(0, 2) + ':' + valor.slice(2, 4);
    }

    input.value = valor; // Actualizar el input para reflejar el cambio
    ejercicio.tiempo = valor; // Guardar el valor formateado en la propiedad

    this.validarTiempo(ejercicio);
  }

  validarTiempo(ejercicio: Ejercicio) {
    const [minutosStr, segundosStr] = ejercicio.tiempo.split(':');
    const minutos = parseInt(minutosStr || '0', 10);
    const segundos = parseInt(segundosStr || '0', 10);

    // Validación: entre 00:01 y 59:59
    if (
      minutos >= 0 && minutos < 60 &&
      segundos >= 0 && segundos < 60 &&
      (minutos > 0 || segundos > 0)
    ) {
      ejercicio.tiempoValido = true;
    } else {
      ejercicio.tiempoValido = false;
    }
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevenir el comportamiento predeterminado
    event.stopPropagation();
  }

  onDrop(event: DragEvent, ejercicio: Ejercicio): void {
    event.preventDefault();
    event.stopPropagation();

    // Asegurarse de que existen archivos en el evento
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]; // Toma el primer archivo
      const inputEvent = { target: { files: [file] } }; // Crea un evento similar al del input
      this.onFileSelect(inputEvent, ejercicio); // Reutiliza tu lógica para manejar el archivo
    }
  }


  eliminarArchivo(ejercicio: Ejercicio): void {
    this.vistaPreviaArchivo = null;
    this.formatoValido = false;
    ejercicio.imagen = '';

  }




}