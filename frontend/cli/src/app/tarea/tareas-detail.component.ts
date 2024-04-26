import { Component } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct, NgbDatepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal/modal.service';
import { debounceTime, distinctUntilChanged, map, of, tap, switchMap, catchError, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { EmpresaService } from '../empresa/empresa.service';
import { Tarea } from '../tarea/tarea';
import { Empresa } from '../empresa/empresa';
import { TareaService } from './tarea.service';

@Component({
  selector: 'app-tarea-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbDatepickerModule],
  template: `
  <div class="container mt-4">
    <div *ngIf="tarea">
        <h2>
        {{
            tarea && tarea.codigo ? "Tarea N° " + tarea.codigo : "Nueva tarea"
        }}
        </h2>
        <form #form="ngForm">
            <div class="form-group text-light">
                <label for="codigoTarea">Codigo:</label>
                <input name="codigoTarea" placeholder="Ingrese el codigo" class="form-control" [(ngModel)]="tarea.codigo" required #codigo="ngModel">
                <div *ngIf="codigo.invalid && (codigo.dirty || codigo.touched)" class="alert">
                    <div *ngIf="codigo.errors?.['required']">
                        El codigo de la tarea es requerido
                    </div>
                </div>

                <label for="descripcionTarea">Descripcion:</label>
                <input name="descripcionTarea" placeholder="Ingrese la descripcion" class="form-control" [(ngModel)]="tarea.descripcion" required #descripcion="ngModel">
                <div *ngIf="descripcion.invalid && (descripcion.dirty || descripcion.touched)" class="alert">
                    <div *ngIf="descripcion.errors?.['required']">
                        La descripcion de la tarea es requerida
                    </div>
                </div>
            </div>
            <button (click)="goBack()" class="btn btn-danger">Atrás</button>
            <button (click)="save()" [disabled]="!form.valid" class="btn btn-success">Guardar</button>
        </form>
    </div>
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
export class TareasDetailComponent {
  tarea!: Tarea;
  searching: boolean = false;
  searchFailed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tareaService: TareaService,
    private location: Location,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.tarea = <Tarea>{
        codigo: '',
        descripcion:''
      }
    } else {
      this.tareaService.get(parseInt(id!))
        .subscribe((dataPackage) => {
          this.tarea = <Tarea>dataPackage.data;
        });
    }
  }

  goBack() {
    this.location.back();
  }

  save(): void {
    this.tareaService.save(this.tarea).subscribe((dataPackage) => 
    {
      if (dataPackage.status != 200) {
        this.modalService.error("Error", "Ya existe una tarea con ese codigo!").then();
      } else {
        this.tarea = <Tarea>dataPackage.data;
        this.goBack();
      }
    });
  }

}