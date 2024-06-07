import { Component } from '@angular/core';
import { NgbDatepickerModule, NgbTypeaheadModule, NgbCalendar, NgbTimeStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal/modal.service';
import { debounceTime, distinctUntilChanged, map, of, tap, switchMap, catchError, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Operario } from '../operario/operario';
import { ParteMO } from './parteMO';
import { ParteMOService } from './parteMO.service';
import { OperarioService } from '../operario/operario.service';
import { Tarea } from '../tarea/tarea';
import { Proyecto } from '../proyecto/proyecto';
import { ProyectoService } from '../proyecto/proyecto.service';
import { TareaService } from '../tarea/tarea.service';
import { NgbDateStruct, NgbDropdownModule, NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from '../shared.service';
import { TipoTurno } from '../operario/tipoTurno';
import { TipoTurnoService } from '../operario/tipoTurno.service';

@Component({
  selector: 'app-parte-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbDatepickerModule, NgbDropdownModule, NgbTimepickerModule],
  template: `
      <div class="container mt-4">
        <div *ngIf="parteMO">
          <h2>
            {{"Nuevo parte"}}
          </h2>
          <form class="row row-cols-sm-auto" (ngSubmit)="get()">
            <div class="col-12">
              <div class="input-group">
                <input
                  class="form-control"
                  style="display: inline-block"
                  placeholder="yyyy-mm-dd"
                  name="fpp"
                  ngbDatepicker
                  [(ngModel)]="fecha"
                  #fpp="ngbDatepicker"
                  required
                  readonly
                  (ngModelChange)="onFechaChange()"
                />
                <button
                  class="btn btn-outline-secondary fa fa-calendar"
                  (click)="fpp.toggle()"
                  type="button"
                ></button>
              </div>
            </div>
          </form>
          <form #form="ngForm">
            <div class="form-group text-light">
              <div class="row">
                <div class="col-md-6">
                  <label for="operario">Operario:</label>
                  <input 
                    [(ngModel)]="parteMO.operario" 
                    name="operario" 
                    placeholder="Operario" 
                    class="form-control" 
                    required 
                    [ngbTypeahead]="searchOperario" 
                    [editable]= true 
                    [resultFormatter]="resultFormatNombre" 
                    [inputFormatter]="inputFormatNombre" 
                    (ngModelChange)="onOperarioSelected($event)" 
                    (input)="borrarCamposAutocompletados($event)" 
                  />
                </div>
                <div class="col-md-6">
                  <label for="legajoOperario">Legajo:</label>
                  <input 
                    [(ngModel)]="parteMO.operario.legajo"
                    name="legajoOperario"
                    placeholder="Legajo"
                    class="form-control"
                    readonly
                    [style.opacity]="0.6"
                  >
                </div>
                <div class="col-md-6">
                  <label for="turnoOperario">Turno:</label>
                  <input 
                    [(ngModel)]="turnoOperario" 
                    name="turnoOperario" 
                    placeholder="Turno" 
                    class="form-control" 
                    readonly 
                    [style.opacity]="0.6" 
                  />
                </div>
                <div class="col-md-6">
                  <label for="proyecto">Proyecto:</label>
                  <input 
                    [(ngModel)]="parteMO.proyecto"
                    name="proyecto"
                    placeholder="Proyecto"
                    class="form-control"
                    required
                    [ngbTypeahead]="searchProyecto"
                    [editable]=false
                    [resultFormatter]="resultFormatDescripcion"
                    [inputFormatter]="inputFormatDescripcion"
                  >
                </div>
                <div class="col-md-6">
                  <label>Tarea:</label>
                  <div class="custom-select-wrapper">
                    <select [(ngModel)]="tareaSeleccionada" name="tarea" class="form-control custom-select" required [disabled]="!filtrarTareasPorProyecto().length" [compareWith]="compararTareas">
                      <option *ngFor="let tarea of filtrarTareasPorProyecto()" [ngValue]="{ id: tarea.id, codigo: tarea.codigo, descripcion: tarea.descripcion }">{{ tarea.descripcion }}</option>
                    </select>
                    <div class="arrow"></div>
                  </div>
                </div>
                <div class="input-group">
                  <div class="row mb-2">
                    <div class="col-12 col-md-3 mb-3">
                      <label for="codigo">Hora desde:</label>
                      <input
                        type="time"
                        class="form-control"
                        [(ngModel)]="parteMO.horaDesde"
                        required
                        name="hora_desde"
                        #hora_desde="ngModel"
                        (change)="calcularHoras()"
                      />
                    </div>
                    <div class="col-12 col-md-3 mb-3">
                      <label for="codigo">Hora hasta:</label>
                      <input
                        type="time"
                        class="form-control"
                        [(ngModel)]="parteMO.horaHasta"
                        required
                        name="hora_hasta"
                        #hora_hasta="ngModel"
                        (change)="calcularHoras()"
                      />
                    </div>
                    <div class="col-12 col-md-4 mb-3">
                      <label for="horas">Total:</label>
                      <input
                        type="text"
                        class="form-control"
                        [(ngModel)]="horas"
                        name="horas"
                        readonly
                        [style.opacity]="0.6"
                      />
                    </div>
                  </div>
                </div>
                <div *ngIf="horaDesdeMayorQueHasta" class="alert alert-danger mb-3" role="alert">
                  <strong>Atención:</strong> La hora de ingreso debe ser menor a la hora de egreso.
                </div>
                <div *ngIf="guardadoExitoso" class="alert alert-success mb-3" role="alert">
                  <strong>Atención:</strong> El parte se ha guardado correctamente.
                </div>
                <div *ngIf="turnoInexistente" class="alert alert-danger mb-3" role="alert">
                  <strong>Atención:</strong> No existe turno para este operario en la fecha indicada. 
                </div>
              </div>
            </div>
            <button (click)="goBack()" class="btn btn-danger">Atrás</button>
            <button (click)="save()" [disabled]="!isFormValid() || horaDesdeMayorQueHasta" class="btn btn-success">Guardar</button>
          </form>
        </div>
      </div>
  `,
  styles: [`
    
    .container {
      background-color: #222;
      color: #fff;
      padding: 20px;
      border-radius: 10px;
    }

    .btn-danger {
      background-color: #dc3545;
      border-color: #dc3545;
    }

    .btn-danger:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }

    .form-group {
      margin-bottom: 20px;
    }

    label {
      font-weight: bold;
    }

    .custom-date-input {
      width: 200px;
    }

    .custom-select-wrapper {
      position: relative;
    }

    .custom-select {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #fff;
      color: #333;
      font-size: 16px;
      opacity: 1;
    }

    .custom-select:disabled {
      opacity: 0.6; 
    }

    .arrow {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      width: 0;
      height: 0;
      border-left: 5px solid transparent;
      border-right: 5px solid transparent;
      border-top: 5px solid #666; 
    }

  `]
})
export class PartesMODetailComponent {
  parteMO!: ParteMO;
  searching: boolean = false;
  searchFailed: boolean = false;
  fecha!: NgbDateStruct;
  fechaSeleccionada: any;
  horas: string = '';
  selectedTime!: string;
  horaDesdeMayorQueHasta: boolean = false;
  guardadoExitoso: boolean = false;
  msjError = "";
  tareaSeleccionada: { id: number, codigo: string, descripcion: string } = { id: -1, codigo: '', descripcion: '' };
  tareasProyecto: Tarea[] = [];
  turnoOperario!: string;
  turnoInexistente: boolean = false;
  operario!: Operario;

  constructor(
    private route: ActivatedRoute,
    private parteMOService: ParteMOService,
    private operarioService: OperarioService,
    private proyectoService: ProyectoService,
    private tareaService: TareaService,
    private tipoTurnoService: TipoTurnoService,
    private location: Location,
    private calendar: NgbCalendar,
    private modalService: ModalService,
    private config: NgbDatepickerConfig,
    private sharedService: SharedService
  ) {
    const currentDate = new Date();
    this.config.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    }
    this.sharedService.currentData.subscribe(data => {
      if (data) {
        this.operario = data.operario;
        this.fechaSeleccionada = data.fecha;
      }
    });
  }

  ngOnInit() {
    this.get();
  }

  filtrarTareasPorProyecto(): Tarea[] {
    if (this.parteMO.proyecto && this.parteMO.proyecto.tareas) {
      return this.parteMO.proyecto.tareas;
    } else {
      return [];
    }
  }


  calcularHoras() {
    if (this.parteMO.horaDesde && this.parteMO.horaHasta) {
      const horaDesde = new Date('1970-01-01T' + this.parteMO.horaDesde);
      const horaHasta = new Date('1970-01-01T' + this.parteMO.horaHasta);

      if (horaHasta < horaDesde) {
        this.horaDesdeMayorQueHasta = true;
      } else {
        this.horaDesdeMayorQueHasta = false;

        let diferencia = horaHasta.getTime() - horaDesde.getTime();

        let horas = Math.floor(diferencia / (1000 * 60 * 60));
        let minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));


        if (!isNaN(horas) && !isNaN(minutos)) { //Se evalua si es NaN ya que al hacer el refresh intentaba calcular las horas debido a que ya existen los horaDesde y horaHasta
          this.horas = horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0');
        } else {
          this.horas = '';
        }

      }
    } else {
      this.horaDesdeMayorQueHasta = false;
      this.horas = '';
    }
  }

  isFormValid(): boolean {
    return !!this.parteMO &&
      !!this.fecha &&
      !!this.parteMO.horaDesde &&
      !!this.parteMO.horaHasta &&
      !!this.parteMO.operario &&
      !(this.parteMO.horaDesde instanceof Date && this.parteMO.horaDesde.getTime() === new Date().getTime()) &&
      !(this.parteMO.horaHasta instanceof Date && this.parteMO.horaHasta.getTime() === new Date().getTime()) &&   //Pŕegunta si horadesde y horahasta son de tipo date vacio.
      !!this.parteMO.operario.nombre &&
      !!this.parteMO.operario.legajo &&
      !!this.parteMO.operario.historicoTurnos &&
      !!this.parteMO.proyecto &&
      !!this.parteMO.proyecto.descripcion &&
      this.horas !== '' &&
      this.tareaSeleccionada.id !== -1 &&
      this.tareaSeleccionada.descripcion !== '' &&
      this.tareaSeleccionada.codigo !== '' &&
      this.turnoOperario !== '';
  }

  get() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'nuevo') {
      if (this.operario != null) {
        this.parteMO = <ParteMO>{
          operario: this.operario,
          proyecto: <Proyecto>{},
          tarea: <Tarea>{}
        }
        this.turnoOperario = this.operario.historicoTurnos[0].tipoTurno.nombre;
        if (typeof this.fechaSeleccionada === 'string') {
          const [year, month, day] = this.fechaSeleccionada.split('-').map(Number);
          this.fecha = { year, month, day };
        } else {
          this.fecha = this.fechaSeleccionada;
        }
        console.info(this.operario);
      }
    } else if (id === 'new') {
      this.parteMO = <ParteMO>{
        operario: <Operario>{},
        proyecto: <Proyecto>{},
        tarea: <Tarea>{}
      }
      this.fecha = this.calendar.getToday();
    } else {
      console.info(id);
      this.parteMOService.get(parseInt(id!))
        .subscribe((dataPackage) => {
          this.parteMO = <ParteMO>dataPackage.data;
          const fechaAux = new Date(this.parteMO.fecha);
          fechaAux.setDate(fechaAux.getDate() + 1);
          this.fecha = { year: fechaAux.getFullYear(), month: fechaAux.getMonth() + 1, day: fechaAux.getDate() };
          if (this.parteMO.horaDesde) {
            this.parteMO.horaDesde = this.formatTime(new Date('1970-01-01T' + this.parteMO.horaDesde));
          }
          if (this.parteMO.horaHasta) {
            this.parteMO.horaHasta = this.formatTime(new Date('1970-01-01T' + this.parteMO.horaHasta));
          }
  
          this.calcularHoras();
          this.obtenerTurnoOperario(this.parteMO.operario.legajo, this.fecha);
          if (this.parteMO.tarea && this.parteMO.tarea.id) {
            this.tareaSeleccionada = {
              id: this.parteMO.tarea.id,
              codigo: this.parteMO.tarea.codigo || '',
              descripcion: this.parteMO.tarea.descripcion || ''
            };
          } else {
            this.tareaSeleccionada = { id: -1, codigo: '', descripcion: '' };
          }
        });
    }
  }
  

  compararTareas(tarea1: { id: number, codigo: string, descripcion: string }, tarea2: { id: number, codigo: string, descripcion: string }): boolean {
    return tarea1 && tarea2 ? tarea1.id === tarea2.id : tarea1 === tarea2;
  }

  goBack() {
    this.location.back();
  }

  save(): void {

    this.parteMO.fecha = new Date(
      this.fecha.year,
      this.fecha.month - 1,
      this.fecha.day
    );

    const fechaISO = this.parteMO.fecha.toISOString().split('T')[0];
    this.parteMO.fecha = new Date(fechaISO);

    const horasParts = this.horas.split(':');
    const horas = parseInt(horasParts[0]);
    const minutos = parseInt(horasParts[1]);
    const totalHoras = (horas + minutos / 60).toFixed(2);

    this.parteMO.horas = parseFloat(totalHoras);

    this.parteMO.tarea = { id: this.tareaSeleccionada.id, codigo: this.tareaSeleccionada.codigo, descripcion: this.tareaSeleccionada.descripcion };

    this.parteMOService.save(this.parteMO).subscribe(dataPackage => {
      if (dataPackage.status === 200) {
        this.parteMO = <ParteMO>dataPackage.data;
        this.parteMO.horaDesde = new Date();
        this.parteMO.horaHasta = new Date();
        this.horas = '';
        this.parteMO.id = -1;
        this.tareaSeleccionada = { id: -1, descripcion: '', codigo: '' };
        this.guardadoExitoso = true;

        const id = this.route.snapshot.paramMap.get('id');
        if (id !== 'new') {
          this.goBack();
        } else {
          setTimeout(() => {
            this.guardadoExitoso = false;
          }, 3000);
        }

      } else {
        this.msjError = <string><unknown>dataPackage.data;
        this.modalService.error("Error", this.msjError);
      }


    });
  }

  searchOperario = (text$: Observable<string>): Observable<Operario[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.operarioService
          .search(term)
          .pipe(
            map((response) => {
              let operarios = <Operario[]>response.data;
              return operarios;
            })
          )
          .pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    );

  onOperarioSelected(operario: Operario) {
    if (operario) {
      this.obtenerTurnoOperario(operario.legajo, this.fecha);
    }
  }

  onFechaChange() {
    this.onOperarioSelected(this.parteMO.operario);
  }


  obtenerTurnoOperario(legajo: string, fecha: NgbDateStruct) {
    const fechaISO = this.fecha.year + '-' + this.fecha.month + '-' + this.fecha.day;
    this.tipoTurnoService.obtenerTurno(legajo, fechaISO).subscribe((dataPackage) => {
      if (dataPackage.status === 200) {
        this.turnoInexistente = false;
        const tipoTurno = <TipoTurno>dataPackage.data;
        if (tipoTurno && tipoTurno.nombre) {
          this.turnoOperario = tipoTurno.nombre;
        }
      } else {
        this.turnoOperario = '';
        this.turnoInexistente = true;
      }
    });
  }

  searchProyecto = (text$: Observable<string>): Observable<any[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.proyectoService
          .search(term)
          .pipe(
            map((response) => {
              let proyectos = <Proyecto[]>response.data;
              return proyectos;
            })
          )
          .pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    );

  searchTarea = (text$: Observable<string>): Observable<any[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.tareaService
          .search(term)
          .pipe(
            map((response) => {
              let tareas = <Tarea[]>response.data;
              return tareas;
            })
          )
          .pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    );

  resultFormatNombre(value: any) {
    return value.nombre;
  }

  inputFormatNombre(value: any) {
    return value ? value.nombre : null;
  }

  resultFormatDescripcion(value: any) {
    return value.descripcion;
  }

  inputFormatDescripcion(value: any) {
    return value ? value.descripcion : null;
  }

  borrarCamposAutocompletados(event: any) {
    if (event && event.target && 'value' in event.target) {
      this.parteMO.operario.legajo = '';
      this.turnoOperario = '';
    }
  }

  formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }  

}