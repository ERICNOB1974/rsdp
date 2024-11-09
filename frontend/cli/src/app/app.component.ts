import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';
import { NgIf } from '@angular/common';
import { AuthService } from './autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { NotificacionService } from './notificaciones/notificacion.service';
import { DataPackage } from './data-package';
import { Notificacion } from './notificaciones/notificacion';
import { ThemeService } from './themeservice';
//import { Notificacion } from './notificaciones/notificacion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, CommonModule, RouterLink, RouterModule],
  templateUrl:'./app.component.html',
  styleUrls: ['../styles.css']
})
export class AppComponent {
  esPantallaLogin = false;
  rutasSinSidebar: string[] = ['/login', '/registro', '/verificar-codigo', '/recuperar-contrasena', '/verificar-codigo?tipo=registro', '/verificar-codigo?tipo=recuperacion', '/verificar-mail', '/cambiar-contrasena'];

  notificaciones: Notificacion[] = []; // Cambiamos el tipo a `any[]` para recibir cualquier tipo de datos de notificación
  idUsuarioAutenticado!: number; // Variable para almacenar el ID del usuario autenticado
  notificacionesNoLeidasCount = 0;

  constructor(private router: Router, 
    private ubicacionService: UbicacionService,
     private authService: AuthService, 
     private notificacionService: NotificacionService,
     private themeService: ThemeService) { }

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
  toggleTheme(): void {
    this.themeService.toggleTheme();
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
      case 'INVITACION_COMUNIDAD':
        // Notificaciones relacionadas con comunidades
        urlDestino = `/comunidad-muro/${notificacion.entidadId}`;
        break;

      case 'INSCRIPCION_A_EVENTO':
      case 'RECORDATORIO_EVENTO_PROXIMO':
      case 'MODIFICACION_EVENTO':
      case 'INVITACION_EVENTO':
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
