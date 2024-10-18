import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';
import { NgIf } from '@angular/common';
import { AuthService } from './autenticacion/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf],
  template: `
    <div *ngIf="!esPantallaLogin" class="sidebar">
      <ul>
          <h5 style="text-align: center; margin: 10px;">RSDP</h5>
          <li class="logo">
              <a href="">
                  <span class="icon"><i class="fa fa-home"></i></span>
                  <span class="text">Inicio</span>
              </a>
          </li> 
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
          <li>
              <a (click)="logout()" class="logout-button" href="javascript:void(0);">
                  <span class="icon"><i class="fa fa-sign-out"></i></span>
                  <span class="text">Cerrar sesión</span>
              </a>
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
  esPantallaLogin = false;
  rutasSinSidebar: string[] = ['/login','/registro', '/verificar-codigo', '/recuperar-contrasena', '/verificar-codigo?tipo=registro', '/verificar-codigo?tipo=recuperacion', '/verificar-mail', '/cambiar-contrasena'];

  constructor(private router: Router, private ubicacionService: UbicacionService, private authService: AuthService) {}

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.esPantallaLogin = this.rutasSinSidebar.includes(event.urlAfterRedirects);
      }
    });

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

  logout(): void {
    this.authService.logout();
  }
}
