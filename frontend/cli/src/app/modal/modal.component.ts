// ModalComponent
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h4 class="modal-title" id="modal-title">{{ title }}</h4>
      <button type="button" class="btn-close" (click)="modal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <p>
        <strong>{{ message }}</strong>
      </p>
      <div [innerHtml]="htmlContent"></div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-outline-secondary" (click)="modal.dismiss()">Cancelar</button>
      <button type="button" class="btn btn-success" (click)="modal.close()">Aceptar</button>
    </div>
  `,
  styles: ``
})
export class ModalComponent {
  constructor(public modal: NgbActiveModal) {}

  title = "";
  message = "";
  htmlContent = "";
}