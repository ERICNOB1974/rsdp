import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { ParteMOService } from './parteMO.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-resumen',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent, FormsModule, NgbModule],
  template: `
  <div class="container mt-4">
      <h2 class="text-light mb-4">Resumen</h2>
      <div class="form-group">
        <label for="fechaInput">Seleccionar Fecha:</label>
        <input type="text" class="form-control" id="fechaInput" [(ngModel)]="fechaInput" placeholder="yyyy-mm-dd">
      </div>
      <div class="button-container">
        <button class="btn btn-primary mt-3" (click)="obtenerResumenPorFecha()">Obtener Resumen</button>
      </div>
      <div class="table-responsive mt-4">
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th scope="col">Legajo</th>
              <th scope="col">Nombre</th>
              <th scope="col">Hora ingreso</th>
              <th scope="col">Hora egreso</th>
              <th scope="col">Horas</th>
              <th scope="col">Horas partes</th>
              <th></th>
            </tr>
          </thead>
          <tbody *ngIf="resultsPage && resultsPage.content && resultsPage.content.length > 0">
            <tr *ngFor="let resumen of resultsPage.content; index as i">
              <td>{{ resumen.nombre }}</td>
              <td>{{ resumen.legajo }}</td>
              <td>{{ resumen.ingreso }}</td>
              <td>{{ resumen.egreso }}</td>
              <td>{{ resumen.horas }}</td>
              <td>{{ resumen.horasPartes }}</td>
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
  `]
})
export class ResumenesComponent {
  resultsPage: ResultsPage = <ResultsPage>{}; 
  pages!: number[];
  currentPage: number = 1;
  fechaInput: string = '';
  AMOUNT_RESUMEN = 10;

  constructor(
    private parteMOService: ParteMOService,
    private modalService: ModalService
  ) {}

  obtenerResumenPorFecha(): void {
    if (this.fechaInput) {

      const [year, month, day] = this.fechaInput.split('-').map(Number);
      const dateFormatRegex = /^\d{4}-\d{2}-\d{2}$/;

      
      if (!isNaN(year) && !isNaN(month) && !isNaN(day) && dateFormatRegex.test(this.fechaInput)) {
        // Formatear la fecha en el formato yyyy-MM-dd
        const fechaFormateada: string = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        
        this.parteMOService.informePartesPorFecha(fechaFormateada).subscribe((dataPackage) => {
          const responseData = dataPackage.data;
          if (Array.isArray(responseData)) {
              this.resultsPage.content = responseData;
              this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
          }
      });
      
        
      } else {
        this.modalService.error("ERROR", 'Fecha ingresada no válida.');
      }
    }
  }
  
  
  ngOnInit() {
    // this.getPartes();
  }

  onPageChangeRequested(page: number): void {
    this.currentPage = page;
    // this.getPartes(); 
  }
}
