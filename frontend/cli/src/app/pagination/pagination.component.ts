import { Component, EventEmitter, Input, Output, SimpleChanges, SimpleChange } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  template: `
    <nav aria-label="Page navigation">
      <ul class="pagination pagination-dark justify-content-center">
        <li class="page-item">
          <a class="page-link" (click)="onPageChange(-2)">&laquo;</a>
        </li>
        <li class="page-item">
          <a class="page-link" (click)="onPageChange(-1)">&lsaquo;</a>
        </li>
        <li *ngFor="let t of pages" [ngClass]="t === number ? 'active' : ''" class="page-item">
          <a class="page-link" (click)="onPageChange(t + 1)">{{ t+1 }}</a>
        </li>
        <li class="page-item">
          <a class="page-link" (click)="onPageChange(-3)">&rsaquo;</a>
        </li>
        <li class="page-item">
          <a class="page-link" (click)="onPageChange(-4)">&raquo;</a>
        </li>
      </ul>
    </nav>
  `,
  styles: `
    .pagination-dark .page-link {
      color: #fff;
      background-color: #343a40;
      border-color: #343a40;
    }
    .pagination-dark .page-link:hover {
      color: #fff;
      background-color: #23272b;
      border-color: #23272b;
    }
    .pagination-dark .page-item.active .page-link {
      background-color: #007bff;
      border-color: #007bff;
    }
  `
})
export class PaginationComponent {
  @Input() totalPages: number = 0;
  @Input() last: boolean = false;
  @Input() currentPage: number = 1;
  @Input() number: number = 1;
  @Output() pageChangeRequested = new EventEmitter<number>();
  pages: number[] = [];

  constructor(){}

  ngOnChanges(changes: SimpleChanges) {
    console.info('Current Page:', this.currentPage);
    console.info('Total Pages:', this.totalPages);
  
    if(changes['totalPages']){
      this.pages = Array.from(Array(this.totalPages).keys());
    }
    if (changes['currentPage']) {
      console.info('Updated Current Page:', this.currentPage);
      if (this.currentPage === this.totalPages) {
        this.last = true;
      } else {
        this.last = false;
      }
    }
  }

  onPageChange(pageId: number): void {
    let page = this.currentPage; // Inicializa 'page' con el valor actual.
    if (pageId === -2) {
      page = 1; // Primera página
    } else if (pageId === -1) {
      page = this.currentPage > 1 ? this.currentPage - 1 : 1; // Página anterior
    } else if (pageId === -3) {
      page = this.currentPage < this.totalPages ? this.currentPage + 1 : this.totalPages; // Página siguiente
    } else if (pageId === -4) {
      page = this.totalPages; // Última página
    } else if (pageId > 1 && pageId <= this.totalPages) {
      page = pageId; // Páginas específicas
    }
    console.info(page+"aaaaaaaaaa");
    this.currentPage = page;
    this.pageChangeRequested.emit(page); // Emitir evento de cambio de página
  }
}

