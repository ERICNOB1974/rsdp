import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { ParteMOService } from './parteMO.service';
import { NgbDateStruct, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
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
            class="form-control custom-date-input"
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
          <button
            class="btn btn-outline-secondary fa fa-times"
            (click)="resetFecha()"
            type="button"
          ></button>
        </div>
      </div>
    </form>
    <div class="button-container" style="display: flex; justify-content: left;">
      <button class="btn btn-primary mt-3" (click)="obtenerResumenPorFecha()">Obtener Resumen</button>
      <button class="btn btn-primary mt-3 " style="margin-left: 10px;" (click)="validar()">Validar</button>
    </div>
  </div>
  <div class="form-check form-check-inline mt-4">
    <input class="form-check-input" type="radio" id="filterInvalidos" name="filter" [(ngModel)]="filtroSeleccionado" [value]="'invalidos'" (change)="onFilterChange()">
    <label class="form-check-label" for="filterInvalidos">Inválidos</label>
  </div>
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" id="filterValidos" name="filter" [(ngModel)]="filtroSeleccionado" [value]="'validos'" (change)="onFilterChange()">
    <label class="form-check-label" for="filterValidos">Válidos</label>
  </div>
  <div class="form-check form-check-inline">
    <input class="form-check-input" type="radio" id="filterTodos" name="filter" [(ngModel)]="filtroSeleccionado" [value]="'todos'" (change)="onFilterChange()">
    <label class="form-check-label" for="filterTodos">Todos</label>
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
export class ResumenesComponent implements OnInit {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  fecha: NgbDateStruct | null = null;
  AMOUNT_RESUMEN = 8;
  filtroSeleccionado: string = 'invalidos'; 
  resultadoFiltros: any[] = [];

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
    this.aplicarFiltros();
  }

  obtenerResumenPorFecha(): void {
    let fechaFormateada = '';

    if (this.fecha) {
      const { year, month, day } = this.fecha;
      fechaFormateada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    this.parteMOService.informePartesPorFecha(fechaFormateada, this.currentPage, this.AMOUNT_RESUMEN).subscribe((dataPackage) => {
      const responseData = <ResultsPage>dataPackage.data;
      if (Array.isArray(responseData.content)) {
        this.resultsPage = <ResultsPage>responseData;
        this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
        this.aplicarFiltros();
      }
    });
  }

  aplicarFiltros(): void {
    let fechaFormateada = '';

    if (this.fecha) {
      const { year, month, day } = this.fecha;
      fechaFormateada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }
    switch (this.filtroSeleccionado) {
      case 'invalidos':
        this.parteMOService.getInvalidosPage(fechaFormateada, this.currentPage, this.AMOUNT_RESUMEN).subscribe((dataPackage) => {
          const responseData = <ResultsPage><unknown>dataPackage;
          if (Array.isArray(responseData.content)) {
            this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
            this.resultsPage = <ResultsPage>responseData;
          }
          if (responseData.content.length === 0) {
            this.modalService.error("ERROR", 'No se encontraron resultados para la fecha seleccionada.');
          }
        });
        break;
      case 'validos':
        this.parteMOService.getValidosPage(fechaFormateada, this.currentPage, this.AMOUNT_RESUMEN).subscribe((dataPackage) => {
          const responseData = <ResultsPage><unknown>dataPackage;
          if (Array.isArray(responseData.content)) {
            this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
            this.resultsPage = <ResultsPage>responseData;
          }
          if (responseData.content.length === 0) {
            this.modalService.error("ERROR", 'No se encontraron resultados para la fecha seleccionada.');
          }
        });
        break;
      case 'todos':
        this.parteMOService.getTodosPage(fechaFormateada, this.currentPage, this.AMOUNT_RESUMEN).subscribe((dataPackage) => {
          const responseData = <ResultsPage><unknown>dataPackage;
          if (Array.isArray(responseData.content)) {
            this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
            this.resultsPage = <ResultsPage>responseData;
          }
          if (responseData.content.length === 0) {
            this.modalService.error("ERROR", 'No se encontraron resultados para la fecha seleccionada.');
          }
        });
        break;
    }
  }

  onFilterChange(): void {
    this.currentPage = 1;
    this.aplicarFiltros();
  }

  validar(): void {
    let fechaFormateada = '';

    if (this.fecha) {
      const { year, month, day } = this.fecha;
      fechaFormateada = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    }

    this.parteMOService.validar(fechaFormateada).subscribe((dataPackage) => {
      const responseData = <ResultsPage>dataPackage.data;
      if (Array.isArray(responseData.content)) {
        this.resultsPage = <ResultsPage>responseData;
      }
      this.ngOnInit();
    });
  }

  ngOnInit() {
    this.fecha = null;
    this.filtroSeleccionado = 'invalidos';
    this.aplicarFiltros();
  }

  onPageChangeRequested(page: number): void {
    this.currentPage = page;
    this.aplicarFiltros();
  }

  resetFecha(): void {
    this.fecha = null;
  }

}
