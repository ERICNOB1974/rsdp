// ModalService
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from './modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  constructor(private modalService: NgbModal) {}

  confirm(title: string, message: string, htmlContent: string): Promise<any> {
    const modal = this.modalService.open(ModalComponent);
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    modal.componentInstance.htmlContent = htmlContent;
    return modal.result;
  }

  error(title: string, message: string): Promise<any> {
    const modal = this.modalService.open(ModalComponent);
    modal.componentInstance.title = title;
    modal.componentInstance.message = message;
    return modal.result;
  }
}