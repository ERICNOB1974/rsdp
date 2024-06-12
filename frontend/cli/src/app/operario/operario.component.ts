import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { OperarioService } from './operario.service';
import { TipoTurnoService } from './tipoTurno.service';
import { Operario } from './operario';
import { Horario } from './horario';
import { TipoTurno } from './tipoTurno';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-operarios',
  standalone: true,
  imports: [CommonModule, RouterModule, PaginationComponent,FormsModule],
  template: `
    <div class="container mt-4">
        <div style="display: flex; align-items: center">
          <h2 class="text-light mb-4">Operarios</h2>
          <input type="text" [(ngModel)]="textoBusqueda" (input)="buscarOperarios()" placeholder="Buscar operario" style="margin-left: auto; margin-top: 20px;"/>
        </div>
        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Legajo</th>
                        <th>Nombre</th>
                        <th>Categoria</th>
                        <th>Turno</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let operario of resultsPage.content; index as i">
                    <td>{{AMOUNT_OPERARIOS * (this.currentPage - 1) + (i + 1)}}</td>
                    <td>{{operario.legajo}}</td>
                    <td>{{operario.nombre}}</td>
                    <td>{{operario.categoria}}</td>
                    <td>{{horarios[operario.legajo]}}</td>
                    <td>
                        <a routerLink="/operarios/{{operario.id}}" class="btn btn-primary btn-sm"><i class="fa fa-pencil"></i></a>
                        <a (click)="remove(operario.id)" routerLink="/operario" class="btn btn-danger btn-sm"><i class="fa fa-remove"></i></a>
                    </td>
                    </tr>
                </tbody>
              </table>
              <app-pagination
                  [totalPages]="resultsPage.totalPages"
                  [currentPage]="currentPage"
                  (pageChangeRequested)="onPageChangeRequested($event)"
                  [number]="resultsPage.number"
                  [hidden]="resultsPage.numberOfElements < 1"
              >
              </app-pagination>
        </div>
    </div>
  `,
  styleUrls: ['../../styles.css']
})
export class OperariosComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  AMOUNT_OPERARIOS = 6;
  horarios: { [legajo: string]: string } = {};
  textoBusqueda: string = '';

  constructor(
    private operarioService: OperarioService,
    private modalService: ModalService,
    private tipoTurnoService: TipoTurnoService
  ){}

  getOperarios(): void { 
    this.operarioService
      .byPage(this.currentPage, this.AMOUNT_OPERARIOS)
      .subscribe(
        (dataPackage) => {
          this.resultsPage = <ResultsPage>dataPackage.data;
          this.pages = Array.from(Array(this.resultsPage.totalPages).keys())
          this.resultsPage.content.forEach((operario: Operario) => {
            this.getHorario(operario);
          });
        });
  }

  getHorario(operario: Operario): void {
    let legajo = operario.legajo;
  
    this.tipoTurnoService.obtenerTurno(legajo, new Date().toISOString().split('T')[0]).subscribe((dataPackage) => {
      if (dataPackage.status === 200) {
        const tipoTurno = <TipoTurno>dataPackage.data;
        let turnoTexto = tipoTurno.nombre ? tipoTurno.nombre : 'Sin Turno';
        this.tipoTurnoService.obtenerHorario(legajo, new Date().toISOString().split('T')[0]).subscribe((dataPackage) => {
          const horario = <Horario>dataPackage.data;
          if (horario) {
            const horaDesde = horario.horaDesde.substring(0, 2);
            const horaHasta = horario.horaHasta.substring(0, 2); 
            turnoTexto += " / " + horaDesde + "a" + horaHasta;
          } else {
            turnoTexto += " / De Franco";
          }
          this.horarios[legajo] = turnoTexto;
        });
      } else {
        this.horarios[legajo] = 'Sin turno';
      }
    });
  }

  ngOnInit(){
    this.getOperarios();
  }

  remove(id: number): void {
    let that = this;
    this.modalService.confirm("Eliminar operario", "¿Está seguro de que desea eliminar este operario?", "Si elimina este operario no lo podrá utilizar luego").then(() => {
      that.operarioService.remove(id).subscribe((dataPackage) => {
        if (dataPackage.status != 200) {
          that.modalService.error("Error", "El operario no puede ser borrado ya que pertenece a un parte").then();
        } else {
          if (that.resultsPage.content.length === 1) {
            that.currentPage--;
          }
          that.getOperarios();
        }
      });
    });
  }

  onPageChangeRequested(page: number): void{
    this.currentPage = page;
    this.getOperarios();
  }

  buscarPorNombre(): void {
    this.operarioService.byNombre(this.currentPage, this.AMOUNT_OPERARIOS, this.textoBusqueda).subscribe((dataPackage) => {
        this.resultsPage = <ResultsPage>dataPackage.data;
        this.resultsPage.content.forEach((operario: Operario) => {
          this.getHorario(operario);
      });
      });
  }

  buscarOperarios(): void {
    this.currentPage = 1;
    this.buscarPorNombre();
  }

}
