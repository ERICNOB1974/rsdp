import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal/modal.service';
import { ResultsPage } from '../results-page';
import { PaginationComponent } from '../pagination/pagination.component';
import { OperarioService } from './operario.service';

@Component({
  selector: 'app-operarios',
  standalone: true,
  imports: [CommonModule,RouterModule, PaginationComponent],
  template: `
    <div class="container mt-4">
        <h2 class="text-light mb-4">Operarios</h2>
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
                    <td>{{operario.turno}}</td>
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
export class OperariosComponent {
  resultsPage: ResultsPage = <ResultsPage>{};
  pages!: number[];
  currentPage: number = 1;
  AMOUNT_OPERARIOS = 4;

  constructor(
    private operarioService: OperarioService,
    private modalService: ModalService
  ){}

  getOperarios(): void { 
    this.operarioService
      .byPage(this.currentPage, this.AMOUNT_OPERARIOS)
      .subscribe(
        (dataPackage) => {
          this.resultsPage = <ResultsPage>dataPackage.data;
          this.pages = Array.from(Array(this.resultsPage.totalPages).keys())
        }
      );
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

}