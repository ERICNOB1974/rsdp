import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { TareaService } from './tarea.service';

@Component({
  selector: 'app-tareas',
  standalone: true,
  imports: [CommonModule,RouterModule, PaginationComponent],
  template: `
    <div class="container mt-4">
        <h2 class="text-light mb-4">Tareas</h2>
        <div class="table-responsive">
            <table class="table table-dark table-hover">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Codigo</th>
                        <th>Descripcion</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    <tr *ngFor="let tarea of resultsPage.content; index as i">
                    <td>{{AMOUNT_TAREAS * (this.currentPage - 1) + (i + 1)}}</td>
                    <td>{{tarea.codigo}}</td>
                    <td>{{tarea.descripcion}}</td>
                    <td>
                        <a routerLink="/tareas/{{tarea.id}}" class="btn btn-primary btn-sm"><i class="fa fa-pencil"></i></a>
                        <a (click)="remove(tarea.id)" routerLink="/tarea" class="btn btn-danger btn-sm"><i class="fa fa-remove"></i></a>
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
export class TareasComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  AMOUNT_TAREAS = 4;

  constructor(
    private tareaService: TareaService,
    private modalService: ModalService
  ){}

  getTareas(): void { 
    this.tareaService
      .byPage(this.currentPage, this.AMOUNT_TAREAS)
      .subscribe(
        (dataPackage) => {
          this.resultsPage = <ResultsPage>dataPackage.data;
          this.pages = Array.from(Array(this.resultsPage.totalPages).keys())
        }
      );
  }

  ngOnInit(){
    this.getTareas();
  }

  remove(id: number): void {
    let that = this;
    this.modalService.confirm("Eliminar tarea", "¿Está seguro de que desea eliminar esta tarea?", "Si elimina esta tarea no la podrá utilizar luego").then(() => {
      that.tareaService.remove(id).subscribe((dataPackage) => {
        if (dataPackage.status != 200) {
          that.modalService.error("Error", "La tarea no puede ser borrada ya que pertenece a un proyecto").then();
        } else {
          if (that.resultsPage.content.length === 1) {
            that.currentPage--;
          }
          that.getTareas();
        }
      });
    });
  }

  onPageChangeRequested(page: number): void{
    this.currentPage = page;
    this.getTareas();
  }

}