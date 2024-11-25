import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';
import { AuthService } from '../autenticacion/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-amigos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'amigos.component.html',
  styleUrls: ['amigos.component.css']
})
export class AmigosComponent implements OnInit {
  amigos: Usuario[] = []; // Arreglo para almacenar los amigos
  solicitudes: Usuario[] = []; // Arreglo para almacenar las solicitudes
  solicitudesEnviadas: Usuario[] = []; // Arreglo para almacenar las solicitudes enviadas
  estadoActual: 'amigos' | 'solicitudes' | 'usuarios' = 'amigos';
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  loadingAmigos = false;
  loadingUsuarios = false;
  loadingSolicitudesRecibidas = false;
  loadingSolicitudesEnviadas = false;
  noMasAmigos: boolean = false;
  noMasUsuarios: boolean = false;
  noMasSolicitudesEnviadas: boolean = false;
  noMasSolicitudesRecibidas: boolean = false;
  resultadosFiltradosPaginados: Usuario[] = [];
  currentIndexAmigos: number = 0;
  currentIndexUsuarios: number = 0;
  currentIndexSolicitudesRecibidas: number = 0;
  currentIndexSolicitudesEnviadas: number = 0;
  usuariosBuscados: Usuario[] = []; //PARA BUSCAR USUARIOS
  cantidadPorPagina = 6;
  textoBuscador: string = '';

  constructor(private usuarioService: UsuarioService,
    private authService: AuthService,  // Inyecta el AuthService
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef // Inyectar ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerAmigos(); // Obtener amigos al iniciar
    this.obtenerSolicitudes(); // Obtener solicitudes al iniciar
    this.obtenerSolicitudesEnviadas();
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
  }

  obtenerAmigos(): void {
    if (this.loadingAmigos || this.noMasAmigos) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
    this.loadingAmigos = true;


    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.usuarioService
      .obtenerAmigosPaginados(this.textoBuscador, this.currentIndexAmigos, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Usuario[]
          if (resultados && resultados.length > 0) {
            this.amigos = [...this.amigos, ...resultados,];
            this.currentIndexAmigos++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasAmigos = true; // No hay más comunidades por cargar
          }
          this.loadingAmigos = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más amigos:', error);
          this.loadingAmigos = false;
        }
      );
  }


  obtenerSolicitudes(): void {
    if (this.loadingSolicitudesRecibidas || this.noMasSolicitudesRecibidas) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
    this.loadingSolicitudesRecibidas = true;
    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.usuarioService
      .obtenerSolicitudesPaginadas(this.textoBuscador, this.currentIndexSolicitudesRecibidas, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Usuario[]
          if (resultados && resultados.length > 0) {

            this.solicitudes = [...this.solicitudes, ...resultados,];
            this.currentIndexSolicitudesRecibidas++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasSolicitudesRecibidas = true; // No hay más comunidades por cargar
          }
          this.loadingSolicitudesRecibidas = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más amigos:', error);
          this.loadingSolicitudesRecibidas = false;
        }
      );
  }

  todosLosUsuarios(): void {
    if (this.loadingUsuarios || this.noMasUsuarios) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
    this.loadingUsuarios = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.usuarioService
      .buscar(this.textoBuscador, this.currentIndexUsuarios, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Usuario[]
          if (resultados && resultados.length > 0) {

            this.usuariosBuscados = [...this.usuariosBuscados, ...resultados,];
            this.currentIndexUsuarios++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasUsuarios = true; // No hay más comunidades por cargar
          }
          this.loadingUsuarios = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más amigos:', error);
          this.loadingUsuarios = false;
        }
      );
  }

  obtenerSolicitudesEnviadas(): void {
    if (this.loadingSolicitudesEnviadas || this.noMasSolicitudesEnviadas) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
    this.loadingSolicitudesEnviadas = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.usuarioService
      .solicitudesAmistadEnviadasPaginadas(this.textoBuscador, this.currentIndexSolicitudesEnviadas, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Usuario[]
          if (resultados && resultados.length > 0) {
            this.solicitudesEnviadas = [...this.solicitudesEnviadas, ...resultados,];
            this.currentIndexSolicitudesEnviadas++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasSolicitudesEnviadas = true; // No hay más comunidades por cargar
          }
          this.loadingSolicitudesEnviadas = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más amigos:', error);
          this.loadingSolicitudesEnviadas = false;
        }
      );
  }

  gestionarSolicitud(usuario: Usuario, aceptar: boolean): void {
    this.usuarioService.gestionarSolicitudAmistad(usuario.id, this.idUsuarioAutenticado, aceptar).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          const mensaje = aceptar ? 'Solicitud de amistad aceptada exitosamente.' : 'Solicitud de amistad rechazada exitosamente.';
          this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
          }); 
          if (aceptar) {
            // Agregar a la lista de amigos
            this.amigos.push(usuario);
          }
          // Eliminar de la lista de solicitudes
          this.solicitudes = this.solicitudes.filter(solicitud => solicitud.id !== usuario.id);

          // Forzar la detección de cambios (aunque no debería ser necesario)
          this.cdr.detectChanges();
        } else {
          this.snackBar.open('Error: ' + dataPackage.message, 'Cerrar', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        const mensaje = aceptar ? 'Error al aceptar la solicitud de amistad.' : 'Error al rechazar la solicitud de amistad.';
        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }
  cambiarVista(nuevaVista: 'amigos' | 'solicitudes' | 'usuarios'): void {
    if (this.estadoActual !== nuevaVista) {
      this.estadoActual = nuevaVista; // Cambiar a la nueva vista

      // Reiniciar índices y resultados según la vista seleccionada
      if (nuevaVista === 'amigos') {
        this.currentIndexAmigos = 0;
        this.noMasAmigos = false;
        this.amigos = [];
        this.obtenerAmigos();
      } else if (nuevaVista === 'solicitudes') {
        this.currentIndexSolicitudesRecibidas = 0;
        this.noMasSolicitudesRecibidas = false;
        this.solicitudes = [];
        this.obtenerSolicitudes();

        this.currentIndexSolicitudesEnviadas = 0;
        this.noMasSolicitudesEnviadas = false;
        this.solicitudesEnviadas = [];
        this.obtenerSolicitudesEnviadas();
      } else if (nuevaVista === 'usuarios') {
        this.usuariosBuscados = [];
        this.todosLosUsuarios(); // Reiniciar búsqueda si aplica
      }

      // Limpiar texto del buscador
      this.textoBuscador = '';
    }
  }


  verPerfil(usuario: Usuario): void {
    this.router.navigate(['/perfil', usuario.id]); // Navega al perfil del usuario
  }

  buscarUsuarios(texto: string): void {
    this.textoBuscador = texto; // Actualizar el texto del buscador

    // Restablecer índices y datos de cada lista al buscar
    this.currentIndexAmigos = 0;
    this.currentIndexSolicitudesRecibidas = 0;
    this.currentIndexSolicitudesEnviadas = 0;
    this.currentIndexUsuarios = 0;
    this.noMasAmigos = false;
    this.noMasUsuarios = false;
    this.noMasSolicitudesRecibidas = false;
    this.noMasSolicitudesEnviadas = false;
    this.amigos = [];
    this.solicitudes = [];
    this.solicitudesEnviadas = [];
    this.usuariosBuscados = [];

    // Llamar al método correspondiente según el tab activo
    switch (this.estadoActual) {
      case 'amigos':
        this.obtenerAmigos();
        break;
      case 'solicitudes':
        this.obtenerSolicitudes();
        this.obtenerSolicitudesEnviadas();
        break;
      case 'usuarios':
        this.todosLosUsuarios();
        break;
      default:
        console.error('Vista no reconocida:', this.estadoActual);
    }
  }

  cancelarSolicitudDeAmistad(idUsuarioCancelar: number): void {
    this.usuarioService.cancelarSolicitudAmistad(idUsuarioCancelar).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          alert('Solicitud cancelada exitosamente.');
          window.location.reload(); // Recargar la página
        } else {
          this.snackBar.open('Error: ' + dataPackage.message, 'Cerrar', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al cancelar solicitud de amistad.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }


  onScroll(tabName: string): void {
    const element = document.querySelector('.scrollable-list') as HTMLElement;

    if (element) {
      // Detecta si se ha alcanzado el final del scroll
      const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

      if (isAtBottom) {
        switch (tabName) {
          case 'amigos':
            this.obtenerAmigos(); // Llama al método para cargar más amigos
            break;
          case 'solicitudes':
            this.obtenerSolicitudes(); // Llama al método para cargar más solicitudes
            break;
          case 'usuarios':
            this.todosLosUsuarios(); // Llama al método para cargar más usuarios
            break;
          default:
            console.error('Vista no reconocida:', tabName);
        }
      }
    } else {
      console.error('.scrollable-list no encontrado.');
    }
  }


}
