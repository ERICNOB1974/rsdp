import { Component } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbDatepickerConfig, NgbDatepickerModule, NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal/modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EmpresaService } from '../empresa/empresa.service';
import { Operario } from './operario';
import { OperarioService } from './operario.service';
import { TipoTurnoService } from './tipoTurno.service';
import { TipoTurno } from './tipoTurno';
import { HistoricoTurno } from './historicoTurno';

@Component({
  selector: 'app-operario-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbDatepickerModule,FormsModule,NgbModule],
  template: `
  <div class="container mt-4">
    <div *ngIf="operario">
        <h2>
            {{ operario && operario.legajo ? "Operario N° " + operario.legajo : "Nuevo operario" }}
        </h2>
        <form #form="ngForm">
            <div class="form-group text-light">
                <label for="legajoOperario">Legajo:</label>
                <input name="legajoOperario" placeholder="Ingrese el legajo" class="form-control" [(ngModel)]="operario.legajo" required #legajo="ngModel">
                <div *ngIf="legajo.invalid && (legajo.dirty || legajo.touched)" class="alert">
                    <div *ngIf="legajo.errors?.['required']">
                        El legajo del operario es requerido
                    </div>
                </div>
            </div>
            <div class="form-group text-light">
                <label for="nombreOperario">Nombre:</label>
                <input name="nombreOperario" placeholder="Ingrese el nombre" class="form-control" [(ngModel)]="operario.nombre" required #nombre="ngModel">
                <div *ngIf="nombre.invalid && (nombre.dirty || nombre.touched)" class="alert">
                    <div *ngIf="nombre.errors?.['required']">
                        El nombre del operario es requerido
                    </div>
                </div>
            </div>
            <div class="custom-select-wrapper">
              <label for="categoriaOperario">Categoría:</label>
              <select name="categoriaOperario" class="form-control custom-select" [(ngModel)]="operario.categoria" required #categoria="ngModel">
                <option value="" disabled selected>Seleccione una categoría</option>
                <option value="Oficial Especializado">Oficial Especializado</option>
                <option value="Oficial Albañil">Oficial Albañil</option>
                <option value="Medio Oficial Albañil">Medio Oficial Albañil</option>
                <option value="Oficial Carpintero">Oficial Carpintero</option>
                <option value="Oficial Armador">Oficial Armador</option>
                <option value="Medio Oficial Armador">Medio Oficial Armador</option>
                <option value="Ayudante">Ayudante</option>
              </select>
            </div>
            <div class="form-group text-light">
              <div class="col-md-6">
                <label>Turno:</label>
                <div class="custom-select-wrapper">
                  <select [(ngModel)]="tipoTurnoSeleccionado" name="tipoTurno" class="form-control custom-select" required>
                    <option value="" disabled selected>Seleccione un tipo de turno</option>
                    <option *ngFor="let turno of tipoTurnos" [ngValue]="turno">{{ turno.nombre }}</option>
                  </select>
                </div>
              </div>
            </div>
            <div class="form-group text-light">
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
                    />
                    <button
                      class="btn btn-outline-secondary fa fa-calendar"
                      (click)="fpp.toggle()"
                      type="button"
                    ></button>
                  </div>
                </div>
              </form>
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
    label {
      font-weight: bold;
    }
    
  `]
})
export class OperariosDetailComponent {
  operario!: Operario; 
  searching: boolean = false;
  searchFailed: boolean = false;
  fecha!: NgbDateStruct;
  tipoTurnos: TipoTurno[] = [];
  tipoTurnoSeleccionado: TipoTurno | null = null;
  historicoTurno: HistoricoTurno = {
    id: -1,
    fechaTurnoDesde: new Date(),
    fechaTurnoHasta: null,
    tipoTurno: null
  };
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private operarioService: OperarioService,
    private empresaService: EmpresaService,
    private tipoTurnoService: TipoTurnoService,
    private location: Location,
    private calendar: NgbCalendar,
    private modalService: ModalService,
    private config: NgbDatepickerConfig
  ) {
    const currentDate = new Date();
    this.config.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate()
    };
  }

  ngOnInit() {
    this.get();
  }

  get() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.operario = <Operario>{}
      this.fecha = this.calendar.getToday();
      this.getTipoTurnos();
    } else {
      this.operarioService.get(parseInt(id!))
        .subscribe((dataPackage) => {
          this.operario = <Operario>dataPackage.data;
          const fechaAux = new Date(this.operario.fechaTurnoDesde);
          this.fecha = { year: fechaAux.getFullYear(), month: fechaAux.getMonth() + 1, day: fechaAux.getDate()};
        });
    }
  }
  
  getTipoTurnos(): void {
    this.tipoTurnoService.findAll()
      .subscribe((dataPackage) => {
        this.tipoTurnos =  <TipoTurno[]> dataPackage.data;
        console.info(this.tipoTurnos);
      });
  }

  goBack() {
    this.location.back();
  }

  save(): void {

    this.historicoTurno.fechaTurnoDesde = new Date(
      this.fecha.year,
      this.fecha.month - 1,
      this.fecha.day
    );

    const fechaISO = this.historicoTurno.fechaTurnoDesde.toISOString().split('T')[0];
    
    this.historicoTurno.fechaTurnoDesde = new Date(fechaISO);
    this.historicoTurno.tipoTurno = this.tipoTurnoSeleccionado;

    if (!this.operario.historicoTurnos) {
      this.operario.historicoTurnos = [];
    }
    this.operario.historicoTurnos.push(this.historicoTurno);

    this.operarioService.save(this.operario).subscribe((dataPackage) => 
    {
      if (dataPackage.status != 200) {
        this.modalService.error("Error", <string>(<unknown>dataPackage.data)).then();
      } else {
        this.operario = <Operario>dataPackage.data;
        this.goBack();
      }
    });
  }

}