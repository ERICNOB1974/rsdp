import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { ParteMOService } from './parteMO.service';
import { LogValidacionParteMO } from './logValidacionParteMO';
import { Location } from '@angular/common';

@Component({
  selector: 'app-parte',
  standalone: true,
  imports: [CommonModule,RouterModule, PaginationComponent],
  template: `
    <div class="container mt-4">
        <h2 class="text-light mb-4">Partes</h2>
        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Fecha</th>
                        <th>Operario</th>
                        <th>Hora desde</th>
                        <th>Hora hasta</th>
                        <th>Proyecto</th>
                        <th>Tarea</th>
                        <th>Estado</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let parteMO of resultsPage.content; index as i">
                    <td>{{AMOUNT_PARTES * (this.currentPage - 1) + (i + 1)}}</td>
                    <td>{{(parteMO.fecha | date:'yyyy-MM-dd':'UTC')}}</td>
                    <td>{{parteMO.operario.nombre}}</td>
                    <td>{{parteMO.horaDesde}}</td>
                    <td>{{parteMO.horaHasta}}</td>
                    <td>{{parteMO.proyecto.descripcion}}</td>
                    <td>{{parteMO.tarea.descripcion}}</td>
                    <td>{{parteMO.estado.nombre}}</td>
                    <td>
                        <a routerLink="/partes/{{parteMO.id}}" class="btn btn-primary btn-sm"><i class="fa fa-pencil"></i></a>
                    </td>
                    </tr>
                </tbody>
              </table>
              <div *ngIf="validacionPorSupervisorExitosa" class="alert alert-success mb-3"role="alert">
                  <strong>Atención:</strong> El parte se ha validado por un supervisor correctamente.
              </div>
              <div *ngIf="rechazarComoSupervisorExitoso" class="alert alert-danger mb-3" role="alert">
                  <strong>Atención:</strong> El parte se ha rechazado correctamente.
              </div>
              <div class="button-container" style="display: flex; justify-content: left;">
                <button class="btn btn-primary mt-3" (click)="validarComoSupervisor()">Validar forzado</button>
                <button class="btn btn-primary mt-3" (click)="rechazarComoSupervisor()" style="margin-left: 10px;">Rechazar</button>
              </div>
        </div>
        <h3 class="text-light mb-4 mt-4">Logs de Validación</h3>
      <div class="table-responsive">
        <table class="table table-dark table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Tiempo de creacion</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Validacion</th>
              <th></th>
            </tr>
          </thead>
          <tbody *ngIf="logsValidacion && logsValidacion.length > 0">
            <tr *ngFor="let log of logsValidacion; index as i">
              <td>{{ i + 1 }}</td>
              <td>{{ log.tiempoCreacion | date:'yyyy-MM-dd HH:mm:ss':'UTC' }}</td>
              <td>{{ log.estado.nombre }}</td>
              <td>{{ log.validacionParteMO.tipo }}</td>
              <td>{{ log.validacionParteMO.nombre }}</td>
            </tr>
          </tbody>
        </table>
        <button (click)="goBack()" class="btn btn-danger">Atrás</button>
      </div>
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
export class PartesMOComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  AMOUNT_PARTES = 4;
  logsValidacion: LogValidacionParteMO[] = [];
  validacionPorSupervisorExitosa: boolean = false;
  rechazarComoSupervisorExitoso: boolean = false;

  constructor(
    private parteMOService: ParteMOService,
    private modalService: ModalService,
    private location: Location,
    private route: ActivatedRoute
  ){}

  goBack() {
    this.location.back();
  }

  getPartes(): void {
    const fecha = this.route.snapshot.paramMap.get('fecha');
    const legajoOperario = this.route.snapshot.paramMap.get('legajoOperario');

    if (fecha && legajoOperario) {
      this.parteMOService.partesDeUnResumen(fecha, legajoOperario).subscribe((dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.resultsPage.content = responseData;
          this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
          if (this.resultsPage.content.length > 0) {
            this.logsValidacion = this.resultsPage.content[0].logsValidacion;
          }
        }
        if ((responseData as any[]).length === 0) {
          this.modalService.error("ERROR", 'No se encontraron partes para el resumen (Raro).');
        }
      });
    }
  }

  validarComoSupervisor(): void {

    const fecha = this.route.snapshot.paramMap.get('fecha');
    const legajoOperario = this.route.snapshot.paramMap.get('legajoOperario');
    if (fecha && legajoOperario){
      this.parteMOService.validarComoSupervisor(fecha,legajoOperario).subscribe((dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.resultsPage.content = responseData;
        }
        this.validacionPorSupervisorExitosa = true;
        //Ocultar mensaje de guardado exitoso luego de 3 segundos
        this.getPartes();
        setTimeout(() => {
          this.validacionPorSupervisorExitosa = false;
        }, 3000);
      });
    }

  }

  rechazarComoSupervisor(): void {
    let fechaFormateada = '';

    const fecha = this.route.snapshot.paramMap.get('fecha');
    const legajoOperario = this.route.snapshot.paramMap.get('legajoOperario');
    if (fecha && legajoOperario){
      this.parteMOService.rechazarComoSupervisor(fecha,legajoOperario).subscribe((dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.resultsPage.content = responseData;
        }
        this.rechazarComoSupervisorExitoso = true;
        //Ocultar mensaje de guardado exitoso luego de 3 segundos
        this.getPartes();
        setTimeout(() => {
          this.rechazarComoSupervisorExitoso = false;
        }, 3000);
      });
    }

  }

  ngOnInit(){
    this.getPartes();
  }

  onPageChangeRequested(page: number): void{
    this.currentPage = page;
    this.getPartes();
  }

}