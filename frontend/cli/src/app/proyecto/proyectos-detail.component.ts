import { Component } from '@angular/core';
import { NgbDatepickerModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalService } from '../modal/modal.service';
import { debounceTime, distinctUntilChanged, map, of, tap, switchMap, catchError, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { Proyecto } from './proyecto';
import { ProyectoService } from './proyecto.service';
import { EmpresaService } from '../empresa/empresa.service';
import { Tarea } from '../tarea/tarea';
import { Empresa } from '../empresa/empresa';

@Component({
  selector: 'app-proyecto-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, NgbTypeaheadModule, NgbDatepickerModule],
  template: `
  <div class="container mt-4">
    <div *ngIf="proyecto">
        <h2>
            {{ proyecto && proyecto.codigo ? "Proyecto N° " + proyecto.codigo : "Nuevo proyecto" }}
        </h2>
        <form #form="ngForm">
            <div class="form-group text-light">
                <div class="row">
                    <div class="col-md-6">
                        <label for="empresa">Empresa:</label>
                        <input 
                            [(ngModel)]="proyecto.empresa"
                            name="empresa"
                            placeholder="Cliente"
                            class="form-control"
                            required
                            [ngbTypeahead]="searchEmpresa"
                            [editable]=false
                            [resultFormatter]="resultFormatEmpresa"
                            [inputFormatter]="inputFormatEmpresa"
                            (input)="borrarCUIT($event)"
                        >
                    </div>
                    <div class="col-md-6">
                        <label for="cuitEmpresa">CUIT:</label>
                        <input 
                            [(ngModel)]="proyecto.empresa.cuit"
                            name="cuitEmpresa"
                            placeholder="CUIT"
                            class="form-control"
                            readonly
                        >
                    </div>
                </div>
            </div>
            <div class="form-group text-light">
                <label for="codigoProyecto">Codigo:</label>
                <input name="codigoProyecto" placeholder="Ingrese el codigo" class="form-control" [(ngModel)]="proyecto.codigo" required #codigo="ngModel">
                <div *ngIf="codigo.invalid && (codigo.dirty || codigo.touched)" class="alert">
                    <div *ngIf="codigo.errors?.['required']">
                        El codigo del proyecto es requerido
                    </div>
                </div>
            </div>
            <div class="form-group text-light">
                <label for="descripcionProyecto">Descripcion:</label>
                <input name="descripcionProyecto" placeholder="Ingrese la descripcion" class="form-control" [(ngModel)]="proyecto.descripcion" required #descripcion="ngModel">
            </div>
            <div class="table-responsive">
                <table class="table table-striped table-sm">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Codigo</th>
                            <th>Descripcion</th>
                            <th>
                                <button (click)="addTarea()" class="btn btn-success">
                                    Agregar
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr *ngFor="let tarea of proyecto.tareas; index as i">
                            <td>{{i+1}}</td>
                            <td>
                                <input name="codigo{{i}}" [(ngModel)]="tarea.codigo" class="form-control" type="string" required> 
                            </td>
                            <td>
                                <input name="descripcion{{i}}" [(ngModel)]="tarea.descripcion" class="form-control" type="string" required>
                            </td>
                            <td>
                                <button (click)="removeTarea(tarea)" class = "btn btn-default">
                                    <i class="fa fa-remove"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
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
export class ProyectosDetailComponent {
  proyecto!: Proyecto;
  searching: boolean = false;
  searchFailed: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private proyectoService: ProyectoService,
    private empresaService: EmpresaService,
    private location: Location,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.get();
  }

  get() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id === 'new') {
      this.proyecto = <Proyecto>{
        empresa: <Empresa>{},
        tareas: <Tarea[]>[]
      }
    } else {
      this.proyectoService.get(parseInt(id!))
        .subscribe((dataPackage) => {
          this.proyecto = <Proyecto>dataPackage.data;
        });
    }
  }
  

  goBack() {
    this.location.back();
  }

  save(): void {
    this.proyectoService.save(this.proyecto).subscribe((dataPackage) => 
    {
      if (dataPackage.status != 200) {
        this.modalService.error("Error", <string>(<unknown>dataPackage.data)).then();
      } else {
        this.proyecto = <Proyecto>dataPackage.data;
        this.goBack();
      }
    });
  }

  searchEmpresa = (text$: Observable<string>): Observable<any[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 3),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.empresaService
          .search(term)
          .pipe(
            map((response) => {
              let plays = <Empresa[]>response.data;
              return plays;
            })
          )
          .pipe(
            tap(() => (this.searchFailed = false)),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    );
  
  resultFormatEmpresa(value: any) {
    return value.nombre;
  }

  inputFormatEmpresa(value: any) {
    return value ? value.nombre : null;
  }

  resultFormatTarea(value: any) {
    return value.descripcion;
  }

  inputFormatTarea(value: any) {
    return value ? value.descripcion : null;
  }

  addTarea() {
    this.proyecto.tareas.push({ codigo: "", descripcion: ""});
  }

  removeTarea(tarea: Tarea) {
    this.modalService.confirm("Eliminar tarea", "¿Está seguro de borrar esta tarea?", "El cambio no se confirmará hasta que no guarde la tarea")
      .then(
        (_) => {
          let tareas = this.proyecto.tareas;
          tareas.splice(tareas.indexOf(tarea), 1);
        }
      )
  }
  
  actualizarCUIT(selectedItem: any) {
    this.proyecto.empresa.cuit = selectedItem.cuit;
  }
  
  borrarCUIT(event: any) {
    if (event && event.target && 'value' in event.target) {
        this.proyecto.empresa.cuit = '';
    }
  }

}