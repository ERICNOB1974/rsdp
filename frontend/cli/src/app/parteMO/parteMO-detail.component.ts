import { Component } from '@angular/core';
import { NgbDatepickerModule, NgbTypeaheadModule, NgbCalendar, NgbTimeStruct} from '@ng-bootstrap/ng-bootstrap';
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
import { NgbDateStruct,NgbDropdownModule,NgbTimepickerModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-parte-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbDatepickerModule, NgbDropdownModule, NgbTimepickerModule],
  template: `
  <div class="container mt-4">
    <div *ngIf="parteMO">
        <h2>
            {{"Nuevo parte" }}
        </h2>
        <div class="form-group">
          <label for="fecha">Fecha:</label>
          <div ngbDropdown class="d-inline-block">
            <button class="btn btn-outline-primary" id="dropdownCalendar" ngbDropdownToggle>
              Seleccionar Fecha
            </button>
            <div ngbDropdownMenu aria-labelledby="dropdownCalendar">
              <ngb-datepicker #dp [(ngModel)]="fecha"></ngb-datepicker>
            </div>
          </div>
        </div>
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
                            [editable]=false
                            [resultFormatter]="resultFormatNombre"
                            [inputFormatter]="inputFormatNombre"
                            (input)="borrarCamposAutocompletados($event)"
                        >
                    </div>
                    <div class="col-md-6">
                        <label for="legajoOperario">Legajo:</label>
                        <input 
                            [(ngModel)]="parteMO.operario.legajo"
                            name="legajoOperario"
                            placeholder="Legajo"
                            class="form-control"
                            readonly
                        >
                    </div>
                    <div class="col-md-6">
                        <label for="turnoOperario">Turno:</label>
                        <input 
                            [(ngModel)]="parteMO.operario.turno"
                            name="turnoOperario"
                            placeholder="Turno"
                            class="form-control"
                            readonly
                        >
                    </div>
                    <div class="col-md-6">
                        <label for="proyecto">Proyecto:</label>
                        <input 
                            [(ngModel)]="parteMO.proyecto"
                            name="proyecto"
                            placeholder="Proyecto"
                            class="form-control form-control-sm"
                            required
                            [ngbTypeahead]="searchProyecto"
                            [editable]=false
                            [resultFormatter]="resultFormatDescripcion"
                            [inputFormatter]="inputFormatDescripcion"
                        >
                    </div>
                    <div class="col-md-6">
                        <label for="tarea">Tarea:</label>
                        <input 
                            [(ngModel)]="parteMO.tarea"
                            name="tarea"
                            placeholder="Tarea"
                            class="form-control form-control-sm"
                            required
                            [ngbTypeahead]="searchTarea"
                            [editable]=false
                            [resultFormatter]="resultFormatDescripcion"
                            [inputFormatter]="inputFormatDescripcion"
                        >
                    </div>
                    <div class="input-group">
                      <div class="row mb-2">
                        <div class="col-7 col-md-2">
                          <label for="codigo"
                            >Hora desde:<span class="text-danger">*</span></label
                          >
                          <input
                            type="text"
                            class="form-control form-control-sm"
                            [(ngModel)]="parteMO.horaDesde"
                            required
                            name="hora_desde"
                            #hora_desde="ngModel"
                            (change)="calcularHoras()"
                          />
                        </div>
                        <div class="col-7 col-md-2">
                          <label for="codigo"
                            >Hora hasta:<span class="text-danger">*</span></label
                          >
                          <input
                            type="text"
                            class="form-control form-control-sm"
                            [(ngModel)]="parteMO.horaHasta"
                            required
                            name="hora_hasta"
                            #hora_hasta="ngModel"
                            (change)="calcularHoras()"
                          />
                          <div *ngIf="horaDesdeMayorQueHasta" class="text-danger">
                            La hora desde no puede ser mayor que la hora hasta.
                          </div>
                        </div>
                        <div class="col-7 col-md-2">
                          <label for="horas">Total:</label>
                          <input
                            type="text"
                            class="form-control form-control-lg"
                            [(ngModel)]="horas"
                            name="horas"
                            readonly
                            [style.opacity]="0.6"
                          />
                        </div>
                      </div>
                    </div>
                </div>
            </div>
            <button (click)="goBack()" class="btn btn-danger">Atrás</button>
            <button (click)="save()" [disabled]="!form.valid" class="btn btn-success">Guardar</button>
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
    
    /* Estilos para el botón desplegable */
    .dropdown-toggle.btn-outline-primary {
       color: #fff; /* Color del texto del botón */
      border-color: #fff; /* Color del borde del botón */
    }
  `]
})
export class PartesMODetailComponent {
  parteMO!: ParteMO;
  searching: boolean = false;
  searchFailed: boolean = false;
  fecha!: NgbDateStruct;
  horas: string = '';
  selectedTime!: string;
  horaDesdeMayorQueHasta: boolean = false;
  msjError = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private parteMOService: ParteMOService,
    private operarioService: OperarioService,
    private proyectoService: ProyectoService,
    private tareaService: TareaService,
    private location: Location,
    private calendar: NgbCalendar,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.get();
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

            this.horas = horas.toString().padStart(2, '0') + ':' + minutos.toString().padStart(2, '0');
        }
    } else {
        this.horaDesdeMayorQueHasta = false;
        this.horas = ''; 
    }
  }
  

  get() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
        this.parteMO = <ParteMO> {
            operario: <Operario>{}, 
            proyecto: <Proyecto>{}, 
            tarea: <Tarea>{}
        }
        this.fecha = this.calendar.getToday();      
    } else {
      this.parteMOService.get(parseInt(id!))
        .subscribe((dataPackage) => {
          this.parteMO = <ParteMO>dataPackage.data;
          const fechaAux = new Date(this.parteMO.fecha);
          this.fecha = { year: fechaAux.getFullYear(), month: fechaAux.getMonth() + 1, day: fechaAux.getDate() };
        });
    }
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
    const horasParts = this.horas.split(':');
    const horas = parseInt(horasParts[0]);
    const minutos = parseInt(horasParts[1]);
    const totalHoras = (horas + minutos / 60).toFixed(2);

    this.parteMO.horas = parseFloat(totalHoras);
    
    const fechaISO = this.parteMO.fecha.toISOString().split('T')[0];
    this.parteMO.fecha = new Date(fechaISO);
  
    this.parteMOService.save(this.parteMO).subscribe(dataPackage => {
      if (dataPackage.status === 200) {
        this.parteMO = <ParteMO>dataPackage.data;
        this.goBack();
      } else {
        this.msjError = <string><unknown>dataPackage.data;
        this.modalService.error("Error", this.msjError);
      }
      

  });
}
  
  searchOperario = (text$: Observable<string>): Observable<any[]> =>
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
        this.parteMO.operario.turno = '';
    }
  }

}