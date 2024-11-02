import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';
import { NgIf } from '@angular/common';
import { AuthService } from './autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { NotificacionService } from './notificaciones/notificacion.service';
import { DataPackage } from './data-package';
import { Notificacion } from './notificaciones/notificacion';
//import { Notificacion } from './notificaciones/notificacion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, CommonModule],
  template: `

    <div *ngIf="!esPantallaLogin" class="sidebar">
      <ul>
        <li class="logo">
          <h5 (click)="navigateTo('/')" style="text-align: center; margin: 10px; cursor: pointer;">RSDP</h5> <!-- Enlace añadido -->
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
                  <li>
                      <a href="/eventosUsuario">Mis Eventos</a>
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
                    <li>
                      <a href="/comunidadesUsuario">Mis Comunidades</a>
                  </li>
              </ul>
          </li>
          <li class="dropdown">
            <a class="dropdown-toggle">
              <span class="icon"><i class="fa fa-user"></i></span>
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
              <span class="icon"><i class="fa fa-user-circle-o"></i></span>
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
                  <li>
                      <a href="/sugerencias/rutinas">De rutinas</a>
                  </li>
              </ul>
          </li>
          <li class="dropdown">
            <a class="dropdown-toggle">
              <span class="icon"><i class="fa fa-thumbs-o-up"></i></span>
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
              <span class="icon"><i class="fa fa-soccer-ball-o"></i></span>
              <span class="text">Rutinas</span>
            </a>
            <ul class="dropdown-menu">
              <li>
                <a href="/rutinas">Listar Rutinas</a>
              </li>
              <li>
                <a href="/rutinas/crearRutina">Nueva Rutina</a>
              </li>
              <li>
                <a href="/rutinasUsuario">Mis Rutinas Creadas</a>
              </li>
            </ul>
          </li>
            <li class="dropdown">
              <a class="dropdown-toggle">
                <span class="icon" style="position: relative;">
                  <i class="fa fa-bell"></i>
                  <span *ngIf="getNotificacionesNoLeidas().length > 0" class="notificacion-count">{{ getNotificacionesNoLeidas().length }}</span>
                </span>
                <span class="text">Notificaciones</span>
              </a>
              <ul class="dropdown-menu notificaciones-menu" aria-labelledby="dropdownMenuButton">
                <li *ngFor="let notificacion of getNotificacionesNoLeidas()">
                  <a class="dropdown-item" (click)="manejarClickNotificacion(notificacion)">
                    <div class="notificacion-item">
                      <p>{{ notificacion.mensaje }}</p>
                      <span *ngIf="!notificacion.leida" class="notificacion-nueva"></span>
                    </div>
                  </a>
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

  notificaciones: Notificacion[] = []; // Cambiamos el tipo a `any[]` para recibir cualquier tipo de datos de notificación
  idUsuarioAutenticado!: number; // Variable para almacenar el ID del usuario autenticado
  notificacionesNoLeidasCount = 0;

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
    this.notificacionService.obtenerNotificaciones(this.idUsuarioAutenticado)
      .subscribe((dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          this.notificaciones = dataPackage.data as Notificacion[];
          this.notificacionesNoLeidasCount = this.getNotificacionesNoLeidas().length; // Contar las no leídas
          console.log('Notificaciones cargadas:', this.notificaciones);
        } else {
          console.error('Error al cargar las notificaciones:', dataPackage.message);
        }
      }, error => {
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

  navegarPorNotificacion(notificacion: Notificacion): void {
    // Determinar la URL de destino basado en el tipo de notificación
    let urlDestino: string;

    switch (notificacion.tipo) {
      case 'ACEPTACION_PRIVADA':
      case 'UNION_PUBLICA':
        // Notificaciones relacionadas con comunidades
        urlDestino = `/comunidad-muro/${notificacion.entidadId}`;
        break;

      case 'INSCRIPCION_A_EVENTO':
      case 'RECORDATORIO_EVENTO_PROXIMO':
      case 'MODIFICACION_EVENTO':
        // Notificaciones relacionadas con eventos
        urlDestino = `/eventos/${notificacion.entidadId}`;
        break;

      case 'SOLICITUD_ENTRANTE':
      case 'SOLICITUD_ACEPTADA':
        // Notificaciones relacionadas con usuarios
        urlDestino = `/perfil/${notificacion.entidadId}`;
        break;

      case 'LIKE':
      case 'COMENTARIO':
        // Notificaciones relacionadas con publicaciones
        urlDestino = `/publicacion/${notificacion.entidadId}`;
        break;

      default:
        console.warn('Tipo de notificación no manejado:', notificacion.tipo);
        return; // Salir si el tipo no está manejado
    }

    // Navegar a la URL de destino
    this.router.navigate([urlDestino]);
  }

  marcarLeida(idNotificacion: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notificacionService.marcarLeida(idNotificacion).subscribe(
        (dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            const notificacion = this.notificaciones.find(n => n.id === idNotificacion);
            if (notificacion) {
              notificacion.leida = true;
            }
            resolve();
          } else {
            reject(new Error('No se pudo marcar la notificación como leída'));
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  getNotificacionesNoLeidas(): Notificacion[] {
    return this.notificaciones.filter(notificacion => !notificacion.leida);
  }



  manejarClickNotificacion(notificacion: Notificacion): void {
    this.marcarLeida(notificacion.id).then(() => {
      this.navegarPorNotificacion(notificacion);
    }).catch(error => {
      console.error('Error al manejar la notificación:', error);
    });
  
  }
}
