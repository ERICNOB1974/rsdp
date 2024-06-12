import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { ParteMOService } from './parteMO.service';
import { LogValidacionParteMO } from './logValidacionParteMO';
import { Location } from '@angular/common';
import { SharedService } from '../shared.service';
import { TipoTurnoService } from '../operario/tipoTurno.service';
import { Horario } from '../operario/horario';
import { Observable, map, of } from 'rxjs';

@Component({
  selector: 'app-parte',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent],
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
                        <th>Horario</th>
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
                        <td>{{parteMO.fecha | date:'yyyy-MM-dd':'UTC'}}</td>
                        <td>{{parteMO.operario.nombre}}</td>
                        <td>{{ obtenerHorario() | async }}</td>
                        <td>{{parteMO.horaDesde}}</td>
                        <td>{{parteMO.horaHasta}}</td>
                        <td>{{parteMO.proyecto.descripcion}}</td>
                        <td>{{parteMO.tarea.descripcion}}</td>
                        <td>{{parteMO.estado.nombre}}</td>
                        <td>
                            <a routerLink="/partes/{{parteMO.id}}" class="btn btn-primary btn-sm"><i class="fa fa-pencil"></i></a>
                            <button *ngIf="parteMO.estado.nombre !== 'anulado'" (click)="anularParte(parteMO.id)" class="btn btn-danger btn-sm">Anular</button>
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
              <div class="button-container" style="display: flex; justify-content: right;">
                <button class="btn btn-success btn-sm" (click)="irACrearParte()">
                    Añadir Parte
                </button>
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
  styleUrls: ['../../styles.css']
})
export class PartesMOComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  AMOUNT_PARTES = 4;
  logsValidacion: LogValidacionParteMO[] = [];
  validacionPorSupervisorExitosa: boolean = false;
  rechazarComoSupervisorExitoso: boolean = false;
  fecha: string = '';
  legajoOperario : string = '';
  horario: string = '';

  constructor(
    private parteMOService: ParteMOService,
    private modalService: ModalService,
    private location: Location,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private tipoTurnoService: TipoTurnoService
  ){}

  goBack() {
    this.location.back();
  }

  irACrearParte(): void {
    const fecha = this.route.snapshot.paramMap.get('fecha');
    const legajoOperario = this.route.snapshot.paramMap.get('legajoOperario');
    if (fecha && legajoOperario) {
      this.router.navigate([`partes/nuevo`]);
    }
  }

  getPartes(): void {
    const fecha = this.route.snapshot.paramMap.get('fecha');
    const legajoOperario = this.route.snapshot.paramMap.get('legajoOperario');
  
    if (fecha && legajoOperario) {
      this.fecha = fecha;
      this.legajoOperario = legajoOperario;
      this.parteMOService.partesDeUnResumen(fecha, legajoOperario).subscribe((dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.resultsPage.content = responseData;
          this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
  
          this.resultsPage.content.sort((a, b) => a.logsValidacion.id - b.logsValidacion.id);
  
          if (this.resultsPage.content.length > 0) {
            // Obtener el logsvalidacion con id mas chico
            this.logsValidacion = this.resultsPage.content[0].logsValidacion;
          }
        }
  
        if ((responseData as any[]).length === 0) {
          this.modalService.error("Atención", 'No hay más partes para el resumen.');
        }

        this.sharedService.changeData({
          fecha: this.fecha,
          operario: this.resultsPage.content[0].operario
        });
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

  anularParte(id: number): void {
      this.parteMOService.anularParte(id).subscribe((dataPackage) => {
        if (dataPackage.status !== 200) {
          this.modalService.error("Error", "El parte no puede ser anulado").then();
        } else {
          this.getPartes();
        }
      });
  };

  ngOnInit(){
    this.getPartes();
  }

  obtenerHorario(): Observable<string> {
    if (this.horario) {
      return of(this.horario);
    } else {
      return this.tipoTurnoService.obtenerHorario(this.legajoOperario, this.fecha).pipe(
        map((dataPackage) => {
          const horario = <Horario>dataPackage.data;
          if (horario == null) {
            this.horario = "Franco"; 
            return this.horario;
          } else {
            const horaDesde = horario.horaDesde.substring(0, 2);
            const horaHasta = horario.horaHasta.substring(0, 2); 
            this.horario = horaDesde + 'a' + horaHasta; 
            return this.horario;
          }
        })
      );
    }
  }
  
  onPageChangeRequested(page: number): void{
    this.currentPage = page;
    this.getPartes();
  }
}
