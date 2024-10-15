import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
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
                <span class="icon"><i class="fa fa-users"></i></span>
                <span class="text">Amigos</span>
              </a>
              <ul class="dropdown-menu">
                  <li>
                      <a href="/amigos">Amigos</a>
                  </li>
                  <li>
                      <a href="/amigos/solicitudes">Solicitudes</a>
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
                      <a href="/sugerencias/amigos">De amigos</a>
                  </li>
                  <li>
                      <a href="/sugerencias/eventos">De eventos</a>
                  </li>
                  <li>
                      <a href="/sugerencias/comunidades">De comunidades</a>
                  </li>
              </ul>
          </li>
          <li class="dropdown">
              <a class="dropdown-toggle">
                  <span class="icon"><i class="fa fa-bell"></i></span>
                  <span class="text">Notificaciones</span>
              </a>
              <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li *ngFor="let notificacion of getUltimasNotificaciones()">
                 <a class="dropdown-item" href="#">{{ notificacion }}</a>
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
  notificaciones: string[] = [];

  constructor(
    private router: Router,
    private ubicacionService: UbicacionService) {}

    
    navigateTo(route: string) {
      this.router.navigateByUrl(route);
    }

  ngOnInit(): void {
    this.actualizarUbicacion();
    this.cargarNotificaciones();
    console.log(this.notificaciones);
  }
  cargarNotificaciones() {
    // Simulación de notificaciones, puedes reemplazar esto con datos reales.
    this.notificaciones = [
      'Notificación 1: Evento creado.',
      'Notificación 2: Nueva comunidad disponible.',
      'Notificación 3: Amigo se unió.',
      'Notificación 4: Recordatorio de evento.',
      'Notificación 5: Mensaje nuevo.',
      'Notificación 6: yo nooo.'
    ];
  }

  getUltimasNotificaciones() {
    return this.notificaciones.slice(0, 5); // Devuelve solo las 5 primeras
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
