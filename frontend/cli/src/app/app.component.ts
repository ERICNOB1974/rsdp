import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="position: fixed; top: 0; width: 100%; z-index: 1000;">
    <div class="d-flex flex-column flex-md-row align-item-center p-3" style="background-color: #222; z-index: 1000;">
        <h5 class="my-0 mr-md-auto font-weight-normal text-light">Brifal S.A.</h5>
          <nav class="my-2 my-md-0 mr-md-3">
            <div class="d-flex align-items-center">
              <a class="p-2 text-light" href="" style="margin-top: -9px;margin-left: 40px;">Inicio</a>
              <div class="custom-select-container">
                <select class="custom-select" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                  <option value="" selected disabled >Empresas</option>
                  <option value="empresas">Listar</option>
                  <option value="empresas/new">Nuevo</option>
                </select>
              </div>

              <div class="custom-select-container">
                <select class="custom-select" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                  <option value="" selected disabled >Proyectos</option>
                  <option value="proyectos">Listar</option>
                  <option value="proyectos/new">Nuevo</option>
                </select>
              </div>

              <div class="custom-select-container">
                <select class="custom-select" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                  <option value="" selected disabled >Tareas</option>
                  <option value="tareas">Listar</option>
                  <option value="tareas/new">Nuevo</option>
                </select>
              </div>

            </div>
          </nav>
      </div>
    </div>
    <div style="margin-top: 70px;">
      <div class="container">
        <router-outlet></router-outlet>
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
export class AppComponent {
  constructor(private router: Router) {}

  onOptionSelected(event: any) {
    const route = event.target.value;
    if (route) {
      this.router.navigateByUrl(route).then(() => {
        event.target.value = '';
      });
    }
  }
}