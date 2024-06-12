import { Component } from '@angular/core';
import { NgbCalendar, NgbDateStruct, NgbDatepickerConfig, NgbDatepickerModule, NgbModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal/modal.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Operario } from './operario';
import { OperarioService } from './operario.service';
import { TipoTurnoService } from './tipoTurno.service';
import { TipoTurno } from './tipoTurno';
import { HistoricoTurno } from './historicoTurno';
import { Observable, catchError, debounceTime, distinctUntilChanged, filter, map, of, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-operario-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbDatepickerModule, FormsModule, NgbModule],
  template: `
<div class="container-xl mt-4">
    <div *ngIf="operario">
        <h2>
            {{ operario && operario.legajo ? "Operario N° " + operario.legajo : "Nuevo operario" }}
        </h2>
        <form #form="ngForm">
            <div class="form-group text-light">
                <label for="legajoOperario">Legajo:</label>
                <input 
                    name="legajoOperario" 
                    placeholder="Ingrese el legajo" 
                    class="form-control" 
                    [(ngModel)]="operario.legajo" 
                    required 
                    pattern="[0-9]+" 
                    #legajo="ngModel">
                <div *ngIf="legajo.invalid && (legajo.dirty || legajo.touched)" class="alert">
                    <div *ngIf="legajo.errors?.['required']">
                        El legajo del operario es requerido.
                    </div>
                    <div *ngIf="legajo.errors?.['pattern']">
                        El legajo del operario debe contener solo números.
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
            <div class="form-group text-light">
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
            <div class="table-responsive">
                <table class="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Fecha desde</th>
                            <th>Fecha hasta</th>
                            <th>Turnos</th> 
                            <th>
                                <button (click)="agregarHistoricoTurno()" class="btn btn-success">
                                    Agregar
                                </button>
                            </th>
                        </tr>
                    </thead>
                  <tbody>
                  <tr *ngFor="let historicoTurno of operario.historicoTurnos; index as i">
                    <td>{{i}}</td>
                    <td>
                      <div class="form-group text-light">
                        <form class="row row-cols-sm-auto">
                          <div class="col-12">
                            <div style="display: flex;">
                              <input
                                class="form-control"
                                style="margin-right: 5px;"
                                placeholder="yyyy-mm-dd"
                                name="fppDesde"
                                ngbDatepicker
                                [(ngModel)]="historicoTurno.fechaTurnoDesde"
                                #fppDesde="ngbDatepicker"
                                required
                                readonly
                                (ngModelChange)="habilitarFechaHasta(historicoTurno)"
                              />
                              <button
                                class="btn btn-outline-secondary fa fa-calendar"
                                (click)="fppDesde.toggle()"
                                type="button"
                              ></button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </td>
                    <td>
                      <div class="form-group text-light">
                        <form class="row row-cols-sm-auto">
                          <div class="col-12">
                            <div style="display: flex;">
                              <input
                                class="form-control"
                                style="margin-right: 5px;" 
                                placeholder="yyyy-mm-dd"
                                name="fppHasta"
                                ngbDatepicker
                                [(ngModel)]="historicoTurno.fechaTurnoHasta"
                                #fppHasta="ngbDatepicker"
                                [disabled]="!historicoTurno.fechaTurnoDesde"
                                [minDate]="historicoTurno.fechaTurnoDesde"
                                required
                                readonly
                              />
                              <button
                                class="btn btn-outline-secondary fa fa-calendar"
                                (click)="fppHasta.toggle()"
                                type="button"
                              ></button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </td>
                    <td>
                      <div class="col-md-7">
                        <input 
                          [(ngModel)]="historicoTurno.tipoTurno"
                          name="tipoTurno{{i}}"
                          placeholder="tipoTurno"
                          class="form-control"
                          required
                          [ngbTypeahead]="searchTipoTurnos"
                          [editable]=false
                          [resultFormatter]="resultFormatNombre"
                          [inputFormatter]="inputFormatNombre"
                        >
                      </div>
                    </td>
                    <td>
                      <button (click)="borrarHistoricoTurno(historicoTurno)" class = "btn btn-default">
                        <i class="fa fa-remove"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </form>
          <button (click)="goBack()" class="btn btn-danger">Atrás</button>
          <button (click)="save()" [disabled]="!isFormValid() || !form.valid" class="btn btn-success">Guardar</button>
        </div>
</div>
  `,
  styleUrls: ['../../styles.css']
})
export class OperariosDetailComponent {
  operario!: Operario;
  searching: boolean = false;
  searchFailed: boolean = false;
  msjError!: string;
  fechaHastaHabilitado: any;

  constructor(
    private route: ActivatedRoute,
    private operarioService: OperarioService,
    private tipoTurnoService: TipoTurnoService,
    private location: Location,
    private calendar: NgbCalendar,
    private modalService: ModalService,
    private datepickerConfig: NgbDatepickerConfig
  ) {
    this.datepickerConfig.maxDate = { year: 2044, month: 12, day: 31 };
    this.datepickerConfig.minDate = { year: 1970, month: 1, day: 1 };
  }

  ngOnInit() {
    this.get();
  }

  get() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.operario = <Operario>{
        historicoTurnos: <HistoricoTurno[]>[]
      }
    } else {
      this.operarioService.get(parseInt(id!))
        .subscribe((dataPackage) => {
          this.operario = <Operario>dataPackage.data;
          if (this.operario.historicoTurnos && this.operario.historicoTurnos.length > 0) {
            this.operario.historicoTurnos.forEach(historicoTurno => {
              if (historicoTurno.fechaTurnoDesde) {
                if (!(historicoTurno.fechaTurnoDesde instanceof Date)) {
                  historicoTurno.fechaTurnoDesde = new Date(historicoTurno.fechaTurnoDesde as unknown as string);
                }
                historicoTurno.fechaTurnoDesde.setDate(historicoTurno.fechaTurnoDesde.getDate() + 1); // Incrementar un día
                historicoTurno.fechaTurnoDesde = this.convertDateToNgbDateStruct(historicoTurno.fechaTurnoDesde as Date);
              }

              if (historicoTurno.fechaTurnoHasta) {
                if (!(historicoTurno.fechaTurnoHasta instanceof Date)) {
                  historicoTurno.fechaTurnoHasta = new Date(historicoTurno.fechaTurnoHasta as unknown as string);
                }
                historicoTurno.fechaTurnoHasta.setDate(historicoTurno.fechaTurnoHasta.getDate() + 1); // Incrementar un día
                historicoTurno.fechaTurnoHasta = this.convertDateToNgbDateStruct(historicoTurno.fechaTurnoHasta as Date);
              }
            });
          }
        });
    }
  }

  searchTipoTurnos = (text$: Observable<string>): Observable<any[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.tipoTurnoService
          .search(term)
          .pipe(
            map((response) => {
              let tipoTurnos = <TipoTurno[]>response.data;
              return tipoTurnos;
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

  goBack() {
    this.location.back();
  }

  isObjectEmpty(obj: any): boolean {
    return obj && typeof obj === 'object' && Object.keys(obj).length === 0;
  }

  isFormValid(): boolean {
    if (!this.operario.historicoTurnos || this.operario.historicoTurnos.length === 0) {
      return false;
    }

    for (let historicoTurno of this.operario.historicoTurnos) {
      if (!historicoTurno.fechaTurnoDesde || this.isObjectEmpty(historicoTurno.tipoTurno) || !historicoTurno.tipoTurno) {
        return false; // Hay un turno sin fecha desde o con tipoTurno vacío
      }
    }

    return true;
  }

  save(): void {
    this.operario.historicoTurnos.forEach(ht => {
      ht.fechaTurnoDesde = this.formatDate(ht.fechaTurnoDesde);
      if (ht.fechaTurnoHasta != null) {
        ht.fechaTurnoHasta = this.formatDate(ht.fechaTurnoHasta);
      }
    });
    this.operarioService.save(this.operario).subscribe(dataPackage => {
      if (dataPackage.status === 200) {
        this.operario = <Operario>dataPackage.data;
        this.goBack();
      } else {
        this.msjError = <string><unknown>dataPackage.data;
        this.modalService.error("Error", this.msjError);
        this.operario.historicoTurnos.forEach(ht => {
          ht.fechaTurnoDesde = this.convertStringToDateStruct(ht.fechaTurnoDesde);
          if (ht.fechaTurnoHasta != null) {
            ht.fechaTurnoHasta = this.convertStringToDateStruct(ht.fechaTurnoHasta);
          }
        });
      }
    });
  }

  formatDate(date: any) {
    if (date && date.year && date.month && date.day) {
      const year = date.year;
      const month = date.month.toString().padStart(2, '0');
      const day = date.day.toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    }
    return null;
  }

  convertStringToDateStruct(dateString: string): NgbDateStruct | null {
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10);
      const day = parseInt(parts[2], 10);
      if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
        return { year, month, day };
      }
    }
    return null;
  }

  agregarHistoricoTurno() {
    this.operario.historicoTurnos.push({
      fechaTurnoDesde: null,
      fechaTurnoHasta: null,
      tipoTurno: <TipoTurno>{}
    });
  }

  borrarHistoricoTurno(historicoTurno: HistoricoTurno) {
    this.modalService.confirm("Eliminar historico turno", "¿Está seguro de borrar este historico turno?", "El cambio no se confirmará hasta que no guarde el operario")
      .then(
        (_) => {
          let historicoTurnos = this.operario.historicoTurnos;
          historicoTurnos.splice(historicoTurnos.indexOf(historicoTurno), 1);
        }
      )
  }

  convertDateToNgbDateStruct(date: Date): NgbDateStruct {
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate()
    };
  }

  resultFormatNombre(value: any) {
    return value.nombre;
  }

  inputFormatNombre(value: any) {
    return value ? value.nombre : null;
  }

  habilitarFechaHasta(historicoTurno: HistoricoTurno) {
    if (historicoTurno.fechaTurnoDesde) {
      historicoTurno.fechaTurnoHasta = null; 
    }
  }

}