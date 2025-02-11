import { Component, HostListener } from '@angular/core';
import { NavigationEnd, Router, RouterModule, RouterLink, RouterOutlet } from '@angular/router';
import { UbicacionService } from './ubicacion.service';
import { Location, NgIf } from '@angular/common';
import { AuthService } from './autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { NotificacionService } from './notificaciones/notificacion.service';
import { DataPackage } from './data-package';
import { Notificacion } from './notificaciones/notificacion';
import { ThemeService } from './themeservice';
import { UsuarioService } from './usuarios/usuario.service';
import { Usuario } from './usuarios/usuario';
import { WebSocketService } from './tiempoReal/webSocketService';


//import { ToastrService } from 'ngx-toastr';
//import { WebSocketService } from './notificaciones/webSocket.Service';
//import { Notificacion } from './notificaciones/notificacion';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgIf, CommonModule, RouterLink, RouterModule],
  templateUrl: './app.component.html',
  styleUrls: ['../styles.css', '../barras.css'],
  styles: [`
    .loading-overlay {
      position: fixed;
      top: 0; 
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    }
    .loading .header, .loading .container.white-div {
      pointer-events: none;
    }
    `],
})
export class AppComponent {
  isResponsive = false;
  menuAbierto: boolean = false;
  esPantallaLogin = false;
  rutasSinSidebar: string[] = ['/login', '/registro', '/verificar-codigo', '/recuperar-contrasena', '/verificar-codigo?tipo=registro', '/verificar-codigo?tipo=recuperacion', '/verificar-mail', '/cambiar-contrasena'];

  notificaciones: Notificacion[] = []; // Cambiamos el tipo a `any[]` para recibir cualquier tipo de datos de notificación
  idUsuarioAutenticado!: number; // Variable para almacenar el ID del usuario autenticado
  notificacionesNoLeidasCount = 0;
  usuario: Usuario | null = null;
  fotoPerfil: string = '';
  isCollapsed: boolean = false; // Estado por defecto
  loading: boolean = false;
  mostrarBotonActualizar: boolean = false; // Controlar visibilidad del botón

  posicionBoton = { top: 100, left: 500 }; // Posición inicial del botón

  constructor(private router: Router,
    private ubicacionService: UbicacionService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private notificacionService: NotificacionService,
    private webSocketService: WebSocketService, // Inyectar el servicio

  ) { }

  setLoading(isLoading: boolean) {
    this.loading = isLoading;
  }

  actualizarNotificaciones(): void {
    //window.location.reload()
    //this.loadPublicaciones(); // Recargar publicaciones
    this.cargarNotificaciones();
    this.mostrarBotonActualizar=false;
  }

  ngOnInit(): void {
    this.updateResponsiveState();
    const storedState = localStorage.getItem('sidebarState');
    if (storedState) {
      this.isCollapsed = storedState === 'true'; // Convierte el valor guardado a booleano
    }
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.esPantallaLogin = this.rutasSinSidebar.includes(event.urlAfterRedirects);
      }
    });
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.getUsuario();
    this.actualizarUbicacion();
    this.cargarNotificaciones();
    this.webSocketService.connect(); // Establecer conexión con WebSocket
    this.webSocketService.nuevasNotificaciones$.subscribe(() => {
      this.mostrarBotonActualizar = true; // Mostrar botón cuando haya una nueva publicación
      console.log('Nueva notificación recibida');
    });
  }


  isDropdownOpen: { [key: string]: boolean } = {
    eventos: false,
    comunidades: false,
    sugerencias: false,
    publicacion: false,
    rutinas: false,
  };

  toggleDropdown(menu: string): void {
    // Cierra todos los dropdowns excepto el actual
    Object.keys(this.isDropdownOpen).forEach(key => {
      if (key !== menu) {
        this.isDropdownOpen[key] = false;
      }
    });
  
    // Alterna el estado del dropdown actual
    this.isDropdownOpen[menu] = !this.isDropdownOpen[menu];
  
    // Si se abre un dropdown, expande la sidebar
    if (this.isDropdownOpen[menu]) {
      this.isCollapsed = false;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateResponsiveState();
  }

  private updateResponsiveState(): void {
    this.isResponsive = window.innerWidth <= 984; // Cambia el valor según el límite deseado
  }

  cerrarBarra() {
    if (!this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

  closeAllDropdown() {

    //aca solo cuando plegas la barrra o siempre. ver eso. 
    Object.keys(this.isDropdownOpen).forEach(key => {
      this.isDropdownOpen[key] = false; // Asigna false a cada clave
    });
  }

  closeDropdown(menu: string) {
    this.isDropdownOpen[menu] = false;
  }

  manejarNuevaNotificacion(notificacion: Notificacion): void {
    // Agregar la notificación a la lista
    this.notificaciones.unshift(notificacion);
    this.notificacionesNoLeidasCount++;
  }

  getUsuario() {
    this.usuarioService.get(this.idUsuarioAutenticado).subscribe(dataPackage => {
      this.usuario = dataPackage.data as Usuario;
    }, error => {
      console.error('Error al cargar el usuario:', error);
      this.usuario = null; // Para manejar el estado de error
    });
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
        urlDestino = `/comunidad-muro/${notificacion.entidadId}`;
        break;
      case 'UNION_PUBLICA':
        urlDestino = `/comunidad-muro/${notificacion.entidadId}`;
        break;
      case 'INVITACION_COMUNIDAD':
        urlDestino = `/comunidad-muro/${notificacion.entidadId}`;
        break;
      case 'EXPULSION_COMUNIDAD':
        // Notificaciones relacionadas con comunidades
        urlDestino = `/comunidad-muro/${notificacion.entidadId}`;
        break;

      case 'INSCRIPCION_A_EVENTO':
        urlDestino = `/eventos/${notificacion.entidadId}`;
        break;
      case 'RECORDATORIO_EVENTO_PROXIMO':
        urlDestino = `/eventos/${notificacion.entidadId}`;
        break;
      case 'MODIFICACION_EVENTO':
        urlDestino = `/eventos/${notificacion.entidadId}`;
        break;
      case 'INVITACION_EVENTO':
        urlDestino = `/eventos/${notificacion.entidadId}`;
        break;
      case 'EXPULSION_EVENTO':
        // Notificaciones relacionadas con eventos
        urlDestino = `/eventos/${notificacion.entidadId}`;
        break;

      case 'SOLICITUD_ENTRANTE':
        urlDestino = `/perfil/${notificacion.entidadId}`;
        break;
      case 'SOLICITUD_ACEPTADA':
        // Notificaciones relacionadas con usuarios
        urlDestino = `/perfil/${notificacion.entidadId}`;
        break;

      case 'LIKE':
        urlDestino = `/publicacion/${notificacion.entidadId}`;
        break;
      case 'ARROBA_PUBLICACION':
        urlDestino = `/publicacion/${notificacion.entidadId}`;
        break;
      case 'ARROBA_COMENTARIO':
        urlDestino = `/publicacion/${notificacion.entidadId}`;
        break;
      case 'LIKE_COMENTARIO':
        urlDestino = `/publicacion/${notificacion.entidadId}`;
        break;
      case 'RESPUESTA':
        urlDestino = `/publicacion/${notificacion.entidadId}`;
        break;
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

  getNotificacionesNoLeidas(): Notificacion[] {
    return this.notificaciones.filter(notificacion => !notificacion.leida);
  }

  marcarLeida(idNotificacion: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notificacionService.marcarLeida(idNotificacion).subscribe(
        (dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            // Encuentra y actualiza el estado de la notificación a "leída"
            const notificacionIndex = this.notificaciones.findIndex(n => n.id === idNotificacion);
            if (notificacionIndex !== -1) {
              this.notificaciones[notificacionIndex].leida = true;
              // Reordenar la lista para mover la notificación leída hacia abajo
              this.actualizarOrdenNotificaciones();
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

  marcarTodasLeidas(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notificacionService.marcarLeidasTodasLasNotificaciones(this.idUsuarioAutenticado).subscribe(
        (dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            // Marcar todas las notificaciones como leídas en la lista local
            this.notificaciones.forEach(n => n.leida = true);
            // Reordenar la lista después de actualizar las notificaciones
            this.actualizarOrdenNotificaciones();
            resolve();
          } else {
            reject(new Error('No se pudieron marcar todas las notificaciones como leídas'));
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  

  eliminarNotificacion(notificacion: Notificacion): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notificacionService.eliminarNotificacion(notificacion.id).subscribe(
        (dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            // Elimina la notificación de la lista
            this.notificaciones = this.notificaciones.filter(n => n.id !== notificacion.id);
            resolve();
          } else {
            reject(new Error('No se pudo eliminar la notificación'));
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }

  eliminarTodasLasNotificaciones(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.notificacionService.eliminarTodas(this.idUsuarioAutenticado).subscribe(
        (dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            // Vaciar la lista de notificaciones
            this.notificaciones = [];
            resolve();
          } else {
            reject(new Error('No se pudieron eliminar todas las notificaciones'));
          }
        },
        error => {
          reject(error);
        }
      );
    });
  }
  

  // Reordenar las notificaciones para mantener las no leídas al inicio y las más recientes primero
  private actualizarOrdenNotificaciones(): void {
    this.notificaciones.sort((a, b) => {
      if (a.leida === b.leida) {
        return new Date(b.fecha).getTime() - new Date(a.fecha).getTime(); // Más recientes primero
      }
      return a.leida ? 1 : -1; // No leídas primero
    });
  }

  manejarClickNotificacion(notificacion: Notificacion): void {
    this.marcarLeida(notificacion.id).then(() => {
      this.navegarPorNotificacion(notificacion);
    }).catch(error => {
      console.error('Error al manejar la notificación:', error);
    });
  }

  toggleMenu(): void {
    if (this.isResponsive) {
      if (!this.isCollapsed) {
        this.isCollapsed = true;
        localStorage.setItem('sidebarState', String(this.isCollapsed)); // Guarda el estado de la sidebar
      }
      this.menuAbierto = !this.menuAbierto;
    } else {
      this.menuAbierto = !this.menuAbierto;
    }
  }

  toggleSidebar(): void {
    if (this.isResponsive) {
      if (this.menuAbierto) {
        this.menuAbierto = false;
      }
      this.isCollapsed = !this.isCollapsed;
      localStorage.setItem('sidebarState', String(this.isCollapsed)); // Guarda el estado de la sidebar
    } else {
      this.isCollapsed = !this.isCollapsed; // Alterna el estado de la sidebar
        // Guardar el nuevo estado en localStorage
    localStorage.setItem('sidebarState', String(this.isCollapsed));
    }
  }

}
