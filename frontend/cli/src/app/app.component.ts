import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';
import { NgIf } from '@angular/common';
import { AuthService } from './autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { NotificacionService } from './notificaciones/notificacion.service';
import { DataPackage } from './data-package';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, CommonModule],
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
              <span class="icon"><i class="fa fa-user"></i></span>
              <span class="text">Perfil</span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a (click)="navigateToMiPerfil()">Mi perfil</a>
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
              <span class="icon"><i class="fa fa-question-circle"></i></span>
              <span class="text">Publicación</span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a href="/publicacion">Nueva</a>
              </li>
            </ul>
          </li>
          <li class="dropdown">
            <a class="dropdown-toggle">
              <span class="icon"><i class="fa fa-bell"></i></span>
              <span class="text">Notificaciones</span>
            </a>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <li *ngFor="let notificacion of notificaciones">
                <a class="dropdown-item" href="#">{{ notificacion.mensaje }}</a>
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
  rutasSinSidebar: string[] = ['/login', '/registro', '/verificar-codigo', '/recuperar-contrasena', '/verificar-codigo?tipo=registro', '/verificar-codigo?tipo=recuperacion', '/verificar-mail', '/cambiar-contrasena'];

  notificaciones: any[] = []; // Cambiamos el tipo a `any[]` para recibir cualquier tipo de datos de notificación
  idUsuarioAutenticado!: number; // Variable para almacenar el ID del usuario autenticado

  constructor(private router: Router, private ubicacionService: UbicacionService, private authService: AuthService, private notificacionService: NotificacionService,) { }


  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.esPantallaLogin = this.rutasSinSidebar.includes(event.urlAfterRedirects);
      }
    });
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.actualizarUbicacion();
    this.cargarNotificaciones();
  }

  navigateToMiPerfil() {
    if (this.idUsuarioAutenticado) {
      this.router.navigate(['/perfil', this.idUsuarioAutenticado]); // Navega al perfil del usuario autenticado
    }
  }

  cargarNotificaciones(): void {
    // Llama al servicio para obtener las notificaciones del usuario autenticado
    this.notificacionService.obtenerNotificaciones(this.idUsuarioAutenticado)
      .subscribe((dataPackage: DataPackage) => {
        // Verifica si el status de la respuesta es exitoso (por ejemplo, 200 OK)
        if (dataPackage.status === 200) {
          // Asigna las notificaciones del usuario autenticado
          this.notificaciones = dataPackage.data as any[];
          console.log('Notificaciones cargadas:', this.notificaciones);
        } else {
          // Maneja el error si el status no es exitoso
          console.error('Error al cargar las notificaciones:', dataPackage.message);
        }
      }, error => {
        // Maneja posibles errores de la llamada HTTP
        console.error('Error al comunicarse con el servicio de notificaciones:', error);
      });
  }

  getUltimasNotificaciones() {
    return this.notificaciones.slice(0, 5);
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

  navigateTo(route: string) {
    this.router.navigateByUrl(route);
  }

}
