import { CommonModule, Location, UpperCasePipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { NgbDateStruct, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal/modal.service';
import { EmpresaService } from './empresa.service';
import { Empresa } from './empresa';

@Component({
  selector: 'app-empresas-detail',
  standalone: true,
  imports: [UpperCasePipe, FormsModule, CommonModule, NgbTypeaheadModule,RouterModule],
  template: `
    <div class="container mt-4">
      <div *ngIf="empresa">
        <h2>
          {{
            empresa && empresa.nombre ? "Empresa " + empresa.nombre : "Nueva empresa"
          }}
        </h2>
      </div>
      <form #form="ngForm">
        <div class="form-group text-light">
          <label for="nombreEmpresa">Nombre:</label>
          <input name="nombreEmpresa" placeholder="Ingrese el nombre" class="form-control" [(ngModel)]="empresa.nombre" required #nombre="ngModel">
          <div *ngIf="nombre.invalid && (nombre.dirty || nombre.touched)" class="alert">
              <div *ngIf="nombre.errors?.['required']">
                El nombre de la empresa es requerido
              </div>
          </div>
          <label for="cuitEmpresa">Cuit:</label>
          <input name="cuitEmpresa" placeholder="Ingrese el cuit" class="form-control" [(ngModel)]="empresa.cuit" required #cuit="ngModel">
          <div *ngIf="cuit.invalid && (cuit.dirty || cuit.touched)" class="alert">
            <div *ngIf="cuit.errors?.['required']">
              El cuit de la empresa es requerido
            </div>
          </div>
          <label for="observacionesEmpresa">Observaciones:</label>
          <input name="observacionesEmpresa" placeholder="Ingrese las observaciones" class="form-control" [(ngModel)]="empresa.observaciones" required #observaciones="ngModel">

        </div>
        <button (click)="goBack()"  class="btn btn-danger">Atrás</button>
        <button (click)="save()" class="btn btn-success" [disabled]="!nombre.valid || !cuit.valid || cuit.value.length !== 11 || cuitContieneCaracteres(empresa.cuit)">Guardar</button> 
      </form>
    </div>
  `,
  styles: [`
    .container {
      background-color: #222;
      color: #fff;
      padding: 20px;
      border-radius: 10px;
    }
    .btn-danger {
      background-color: #dc3545;
      border-color: #dc3545;
    }
    .btn-danger:hover {
      background-color: #c82333;
      border-color: #bd2130;
    }
    .form-group {
      margin-bottom: 20px;
    }
    label {
      font-weight: bold;
    }
  `]
})
export class EmpresasDetailComponent {
  empresa!: Empresa;
  searching: boolean = false;
  searchFailed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private empresaService: EmpresaService,
    private location: Location,
    private modalService: ModalService
  ) { }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    this.empresaService.save(this.empresa).subscribe((dataPackage) => 
    {
      if (dataPackage.status != 200) {
        this.modalService.error("Error", "Ya existe una empresa con ese cuit!").then();
      } else {
        this.empresa = <Empresa>dataPackage.data;
        this.goBack();
      }
    });
  }

  get(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id === 'new'){
      this.empresa = <Empresa>{};
    } else {
      this.empresaService
        .get(parseInt(id))
        .subscribe((dataPackage) => (this.empresa = <Empresa>dataPackage.data));
    }
  }

  cuitContieneCaracteres(cuit: string): boolean {
    return /[a-zA-Z]/.test(cuit);
  }  

  ngOnInit() {
    this.get();
  }

}