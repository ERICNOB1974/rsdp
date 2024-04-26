  import { Component } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { RouterModule } from '@angular/router';
  import { ModalService } from '../modal/modal.service';
  import { ResultsPage } from '../results-page';
  import { PaginationComponent } from '../pagination/pagination.component';
  import { EmpresaService } from './empresa.service';

  @Component({
    selector: 'app-empresas',
    standalone: true,
    imports: [CommonModule, RouterModule, PaginationComponent],
    template: `
      <div class="container mt-4">
        <h2 class="text-light mb-4">Empresa</h2>
        <div class="table-responsive">
          <table class="table table-dark table-hover">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Nombre</th>
                <th scope="col">Cuit</th>
                <th scope="col">Observaciones</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let empresa of resultsPage.content; index as i">
                <td>{{ AMOUNT_EMPRESA * (currentPage - 1) + (i + 1) }}</td>
                <td>{{ empresa.nombre }}</td>
                <td>{{ empresa.cuit }}</td>
                <td>{{ empresa.observaciones }}</td>
                <td>
                  <a routerLink="/empresas/{{ empresa.id }}" class="btn btn-primary btn-sm"><i class="fa fa-pencil"></i></a>
                  <button (click)="remove(empresa.id)" class="btn btn-danger btn-sm"><i class="fa fa-remove"></i></button>
                </td>
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
  export class EmpresasComponent {
    resultsPage: ResultsPage = <ResultsPage>{};
    pages!: number[];
    currentPage: number = 1;
    AMOUNT_EMPRESA = 4;

    constructor(
      private empresaService: EmpresaService,
      private modalService: ModalService
    ) {}

    getEmpresas(): void {
      this.empresaService.byPage(this.currentPage, this.AMOUNT_EMPRESA).subscribe((dataPackage) => {
        this.resultsPage = <ResultsPage>dataPackage.data;
        this.pages = Array.from(Array(this.resultsPage.totalPages).keys());
      });
    }

    ngOnInit() {
      this.getEmpresas();
    }

    remove(id: number): void {
      let that = this;
      this.modalService.confirm("Eliminar empresa", "¿Está seguro de que desea eliminar esta empresa?", "Si elimina esta empresa no la podrá utilizar luego").then(() => {
        that.empresaService.remove(id).subscribe((dataPackage) => {
          if (dataPackage.status != 200) {
            that.modalService.error("Error", "La empresa no puede ser borrada ya que pertenece a un proyecto").then();
          } else {
            if (that.resultsPage.content.length === 1) {
              that.currentPage--;
            }
            that.getEmpresas();
          }
        });
      });
    }

    onPageChangeRequested(page: number): void {
      this.currentPage = page;
      this.getEmpresas();
    }
  }
