import { Component, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { ParteMOService } from './parteMO.service';
import { NgbDateStruct, NgbDatepickerConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent, FormsModule, NgbModule],
  template: `
  <div class="container mt-4">
    <h2 class="text-light mb-4">Resumen</h2>
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
      <div class="button-container" style="display: flex; justify-content: left;">
        <button class="btn btn-primary mt-3" (click)="obtenerResumenPorFecha()">Obtener Resumen</button>
        <button class="btn btn-primary mt-3 " style="margin-left: 10px;"(click)="validar()">Validar</button>
      </div>
    </div>
    <div class="table-responsive mt-4">
      <table class="table table-dark table-hover">
        <thead>
          <tr>
            <th scope="col">Fecha</th>
            <th scope="col">Nombre</th>
            <th scope="col">Legajo</th>
            <th scope="col">Hora ingreso</th>
            <th scope="col">Hora egreso</th>
            <th scope="col">Horas</th>
            <th scope="col">Horas partes</th>
            <th scope="col">Estado</th>
            <th scope="col">Ver partes</th>
            <th></th>
          </tr>
        </thead>
        <tbody *ngIf="resultsPage && resultsPage.content && resultsPage.content.length > 0">
          <tr *ngFor="let resumen of resultsPage.content; index as i">
            <td>{{ (resumen.fecha | date:'yyyy-MM-dd':'UTC') }}</td>
            <td>{{ resumen.nombre }}</td>
            <td>{{ resumen.legajo }}</td>
            <td>{{ resumen.ingreso }}</td>
            <td>{{ resumen.egreso }}</td>
            <td>{{ resumen.horas }}</td>
            <td>{{ resumen.horasPartes }}</td>
            <td>{{ resumen.estado }}</td>
            <td>
              <a routerLink="/partes/{{(resumen.fecha | date:'yyyy-MM-dd':'UTC')}}/{{resumen.legajo}}" class="btn btn-primary btn-sm"><i class="fa fa-eye"></i></a>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <app-pagination
      [totalPages]="resultsPage.totalPages"
      [currentPage]="currentPage"
      (pageChangeRequested)="onPageChangeRequested($event)"
      [number]="resultsPage.number"
      [hidden]="resultsPage.numberOfElements < 1"
    ></app-pagination>
  </div>
  `,
  styles: [`
    .container {
      background-color: #222;
      padding: 20px;
      border-radius: 10px;
    }
    .btn-primary {
      background-color: #007bff;
      border-color: #007bff;
    }
    .btn-primary:hover {
      background-color: #0056b3;
      border-color: #0056b3;
    }
    .btn-danger {
      background-color: #dc3545;
      border-color: #dc3545;
    }
    .btn-danger:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }
    .custom-date-input {
      width: 200px; /* Define el ancho del campo de fecha */
    }
  `]
})
export class ResumenesComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  fecha: NgbDateStruct | null = null;
  AMOUNT_RESUMEN = 10;
  partesDeResumen: any[] = [];

  constructor(
    private parteMOService: ParteMOService,
    private modalService: ModalService,
    private config: NgbDatepickerConfig,
  ) {
    const currentDate = new Date();
    this.config.maxDate = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,  
      day: currentDate.getDate()
    }
  }

  get(): void {
    this.obtenerResumenPorFecha();
  }

  obtenerResumenPorFecha(): void {
    let fechaFormateada = '';

    if (this.fecha) {
      const { year, month, day } = this.fecha;
      fechaFormateada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    this.parteMOService.informePartesPorFecha(fechaFormateada).subscribe((dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.resultsPage.content = responseData;
        this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
      }
      if ((responseData as any[]).length === 0) {
        this.modalService.error("ERROR", 'No se encontraron resultados para la fecha seleccionada.');
      }
    });
  }

  validar(): void {
    let fechaFormateada = '';

    if (this.fecha) {
      const { year, month, day } = this.fecha;
      fechaFormateada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    this.parteMOService.validar(fechaFormateada).subscribe((dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.resultsPage.content = responseData;
        this.fecha = null;
        this.obtenerResumenPorFecha();
      }
    });


  }

/*
  partesDeUnResumen(fecha: string, legajo: string): void {
    this.parteMOService.partesDeUnResumen(fecha, legajo).subscribe((dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.partesDeResumen = responseData;
      }
      if ((responseData as any[]).length === 0) {
        this.modalService.error("ERROR", 'No se encontraron partes para el resumen seleccionado.');
      }
    });
  }
  */
  ngOnInit() {
    this.parteMOService.informePartesPorFecha('').subscribe((dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.resultsPage.content = responseData;
        this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
      }
      if ((responseData as any[]).length === 0) {
        this.modalService.error("ERROR", 'No se encontraron resultados para la fecha seleccionada.');
      }
    });
  }

  onPageChangeRequested(page: number): void {
    this.currentPage = page;
  }
}
