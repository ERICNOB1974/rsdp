import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { ProyectoService } from './proyecto.service';

@Component({
  selector: 'app-proyectos',
  standalone: true,
  imports: [CommonModule,RouterModule, PaginationComponent],
  template: `
    <div class="container mt-4">
        <h2 class="text-light mb-4">Proyectos</h2>
        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Codigo</th>
                        <th>Descripcion</th>
                        <th>Empresa</th>
                        <th>Cantidad de tareas</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let proyecto of resultsPage.content; index as i">
                    <td>{{AMOUNT_PROYECTOS * (this.currentPage - 1) + (i + 1)}}</td>
                    <td>{{proyecto.codigo}}</td>
                    <td>{{proyecto.descripcion}}</td>
                    <td>{{proyecto.empresa.nombre}}</td>
                    <td>{{proyecto.tareas.length}}</td>
                    <td>
                        <a routerLink="/proyectos/{{proyecto.id}}" class="btn btn-primary btn-sm"><i class="fa fa-pencil"></i></a>
                        <a (click)="remove(proyecto.id)" routerLink="/proyecto" class="btn btn-danger btn-sm"><i class="fa fa-remove"></i></a>
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
export class ProyectosComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  AMOUNT_PROYECTOS = 4;

  constructor(
    private proyectoService: ProyectoService,
    private modalService: ModalService
  ){}

  getProyectos(): void { 
    this.proyectoService
      .byPage(this.currentPage, this.AMOUNT_PROYECTOS)
      .subscribe(
        (dataPackage) => {
          this.resultsPage = <ResultsPage>dataPackage.data;
          this.pages = Array.from(Array(this.resultsPage.totalPages).keys())
        }
      );
  }

  ngOnInit(){
    this.getProyectos();
  }

  remove(id: number): void {
    let that = this;
    this.modalService
      .confirm("Eliminar proyecto" , "¿Está seguro de que desea eliminar el proyecto?" , "Si elimina el proyecto no lo podra utilizar luego")
      .then(
        function(){
          if (that.resultsPage.content.length === 1) {
            that.currentPage--; 
          }
          that.proyectoService.remove(id).subscribe(dataPackage => {
            if (dataPackage.status != 200) {
              that.modalService.error("Error", <string>(<unknown>dataPackage.data)).then();
            }
            that.getProyectos();
          });
        }
      );
  }

  onPageChangeRequested(page: number): void{
    this.currentPage = page;
    this.getProyectos();
  }

}