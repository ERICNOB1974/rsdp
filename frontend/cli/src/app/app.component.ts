import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="sidebar">
      <ul>
          <h5 style="text-align: center; margin: 10px;">RSDP</h5>
          <!-- <li class="logo">
              <a href="">
                  <span class="icon"><i class="fa fa-home"></i></span>
                  <span class="text">Inicio</span>
              </a>
          </li> -->
          <li class="dropdown">
              <a class="dropdown-toggle">
                  <span class="icon"><i class="fa fa-calendar"></i></span>
                  <span class="text">Eventos</span>
              </a>
              <ul class="dropdown-menu">
                  <li>
                      <a href="/eventos">Listar eventos</a>
                  </li>
                  <li>
                      <a href="/eventos/crearEvento">Crear evento</a>
                  </li>
              </ul>
          </li>
          <li class="dropdown">
              <a class="dropdown-toggle">
                <span class="icon"><i class="fa fa-users"></i></span>
                <span class="text">Comunidades</span>
              </a>
              <ul class="dropdown-menu">
                  <li>
                      <a href="/comunidades">Listar comunidades</a>
                  </li>
                  <li>
                      <a href="/comunidades/crearComunidad">Crear comunidad</a>
                  </li>
              </ul>
          </li>
          <li class="dropdown">
              <a class="dropdown-toggle">
                <span class="icon"><i class="fa fa-question-circle"></i></span>
                <span class="text">Sugerencias</span>
              </a>
              <ul class="dropdown-menu">
                  <li>
                      <a href="/sugerencias/amigos">En base a amigos</a>
                  </li>
                  <li>
                      <a href="/sugerencias/eventos">En base a eventos</a>
                  </li>
                  <li>
                      <a href="/sugerencias/comunidades">En base a comunidades</a>
                  </li>
              </ul>
          </li>
      </ul>
    </div>
    <div class="main-content">
      <router-outlet></router-outlet>
    </div>
  `,
  styleUrls: ['../styles.css']
})
export class AppComponent {
  constructor(
    private router: Router,
    private ubicacionService: UbicacionService) {}

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

  ngOnInit(): void {
    this.actualizarUbicacion();
  }

  actualizarUbicacion() {
    this.ubicacionService.obtenerUbicacion().then(() => {
      const latitud = this.ubicacionService.getLatitud();
      const longitud = this.ubicacionService.getLongitud();
      console.log(`Ubicación actual: ${latitud}, ${longitud}`);
    }).catch((error) => {
      console.error('Error obteniendo la ubicación:', error);
    });
  }
}
