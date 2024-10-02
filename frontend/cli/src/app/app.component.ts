import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div style="position: fixed; top: 0; left: 0; width: 100%; z-index: 1000;">
      <div class="d-flex flex-column flex-md-row align-item-center p-1" style="background-color: #222; z-index: 1000;">
        <h5 class="my-2 mr-md-auto font-weight-normal text-light">Brifal S.A.</h5>
        <nav class="my-2 my-md-0 mr-md-3">
          <div class="d-flex align-items-center">
            <a class="p-2 text-light" href="" style="margin-top: -1px; margin-left: 40px;">Inicio</a>
            <div class="custom-select-container">
              <select class="custom-select btn-black" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                <option value="" selected disabled>Eventos</option>
                <option value="eventos">Eventos</option>
                <option value="eventos/new">Nuevo Evento</option>
              </select>
            </div>
            <div class="custom-select-container">
              <select class="custom-select btn-black" style="margin-left: 40px;" (change)="onOptionSelected($event)">
                <option value="" selected disabled>Operarios</option>
                <option value="operarios">Operarios</option>
                <option value="operarios/new">Nuevo Operario</option>
              </select>
            </div>
          </div>
        </nav>
      </div>
    </div>
    <div style="margin-top: 70px; height: calc(100vh - 70px);">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../styles.css']
})
export class AppComponent {
  constructor(
    private router: Router,
    private ubicacionService: UbicacionService) {}

  onOptionSelected(event: any) {
    const route = event.target.value;
    if (route) {
      this.router.navigateByUrl(route).then(() => {
        event.target.value = '';
      });
    }
  }

  ngOnInit(): void {
    this.actualizarUbicacion();
  }

  actualizarUbicacion() {
    this.ubicacionService.obtenerUbicacion().then(() => {
      const latitud = this.ubicacionService.getLatitud();
      const longitud = this.ubicacionService.getLongitud();
      // Puedes enviar la ubicación al backend si lo deseas
      console.log(`Ubicación actual: ${latitud}, ${longitud}`);
    }).catch((error) => {
      console.error('Error obteniendo la ubicación:', error);
    });
  }

}