import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="position: fixed; top: 0; width: 100%; z-index: 1000;">
      <div class="d-flex flex-column flex-md-row align-item-center p-1" style="background-color: #222; z-index: 1000;">
        <h5 class="my-2 mr-md-auto font-weight-normal text-light">Brifal S.A.</h5>
        <nav class="my-2 my-md-0 mr-md-3">
          <div class="d-flex align-items-center">
            <a class="p-2 text-light" href="" style="margin-top: -1px; margin-left: 40px;">Inicio</a>
            <div class="custom-select-container">
              <select class="custom-select btn-black" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                <option value="" selected disabled>Empresas</option>
                <option value="empresas">Listar</option>
                <option value="empresas/new">Nuevo</option>
              </select>
            </div>

            <div class="custom-select-container">
              <select class="custom-select btn-black" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                <option value="" selected disabled>Proyectos</option>
                <option value="proyectos">Listar</option>
                <option value="proyectos/new">Nuevo</option>
              </select>
            </div>

            <div class="custom-select-container">
              <select class="custom-select btn-black" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                <option value="" selected disabled>Operarios</option>
                <option value="operarios">Listar</option>
                <option value="operarios/new">Nuevo</option>
              </select>
            </div>

            <div class="custom-select-container">
              <select class="custom-select btn-black" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                <option value="" selected disabled>Partes</option>
                <option value="partes/new">Nuevo</option>
                <option value="resumenes">Resumenes</option>
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
  styleUrls: ['../styles.css']
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