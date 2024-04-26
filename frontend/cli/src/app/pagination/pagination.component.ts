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
    if(changes['totalPages']){
      this.pages = Array.from(Array(this.totalPages).keys())
    }
    if (changes['currentPage']) {
      if (this.currentPage == this.totalPages){
        this.last = true;
      } else {
        this.last = false;
      }
    }
  }

  onPageChange(pageId: number): void {
    if (!this.currentPage){
      this.currentPage = 1;
    }
    let page = pageId;
    if (pageId === -2){
      page = 1;
    }
    if (pageId === -1){
      page = this.currentPage > 1 ? this.currentPage - 1 : 1;
    }
    if (pageId === -3){
      page = !this.last ? this.currentPage + 1 : this.currentPage;
    }
    if (pageId === -4){
      page = this.totalPages;
    }
    if (pageId > 1 && this.pages.length >= pageId){
      page = this.pages[pageId - 1] + 1;
    }
    page = Math.min(page, this.totalPages);
    this.currentPage = page;
    this.pageChangeRequested.emit(page);
  }
}

