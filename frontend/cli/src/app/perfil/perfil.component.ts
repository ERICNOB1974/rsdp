import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';
import { AuthService } from '../autenticacion/auth.service';
import { Publicacion } from '../publicaciones/publicacion';
import { PublicacionService } from '../publicaciones/publicacion.service';
import { Rutina } from '../rutinas/rutina';
import { Evento } from '../eventos/evento';
import { Comunidad } from '../comunidades/comunidad';
import { EventoService } from '../eventos/evento.service';
import { ComunidadService } from '../comunidades/comunidad.service';
import { RutinaService } from '../rutinas/rutina.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'perfil.component.html',
  styleUrls: ['perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;  // Objeto para almacenar los datos del perfil que se está viendo
  idUsuario!: number;  // ID del perfil que se está viendo (viene de la URL o lógica del componente)
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  esMiPerfil: boolean = false;  // Para determinar si es el perfil del usuario autenticado
  publicaciones!: Publicacion[];
  relacion: string = '';
  isOwnPublication: any;
  historicoRutinas: Rutina[] = [];
  historicoEventos: Evento[] = [];
  historicoComunidades: Comunidad[] = [];
  tabSeleccionada: string = 'publicaciones';

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private eventoService: EventoService, 
    private comunidadService: ComunidadService, 
    private rutinaService: RutinaService,
    private authService: AuthService,  // Inyecta el AuthService
    private router: Router
  ) { }

  ngOnInit(): void {
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPerfil();  // Cargar la información del perfil
  }

  // Obtén el usuario autenticado desde el AuthService


  // Cargar el perfil que se está viendo
  cargarPerfil(): void {
    
    this.usuarioService.get(this.idUsuario).subscribe((dataPackage: DataPackage) => {
      if (dataPackage.status === 200) {
        this.usuario = dataPackage.data as Usuario;
        this.esMiPerfil = this.usuario.id === this.idUsuarioAutenticado;

        if (!this.esMiPerfil) {
          this.verificarRelacion().then(() => {
            this.traerPublicacionesSegunPrivacidad();
            this.getRutinaRealizaUsuario();
            this.traerHistoricoEventos();
            this.traerHistoricoComunidades();
          }).catch((error) => {
            console.error('Error en la verificación de relación:', error);
          });
        } else {
          this.traerPublicacionesSegunPrivacidad();
          this.getRutinaRealizaUsuario();
          this.traerHistoricoEventos();
          this.traerHistoricoComunidades();
        }
      } else {
        console.error(dataPackage.message);
      }
    });
    console.info(this.historicoRutinas);
  }

  // Navega a la página de edición de perfil
  editarPerfil(): void {
    this.router.navigate(['/perfilEditable', this.idUsuarioAutenticado]);
  }

  verificarRelacion(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.idUsuarioAutenticado && this.idUsuario) {
        // Verificar si son amigos
        this.usuarioService.sonAmigos(this.idUsuarioAutenticado, this.idUsuario).subscribe((dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            let amigos = dataPackage.data;
            if (amigos) {
              this.relacion = 'amigos';
            }
          } else {
            console.error('Error al verificar si son amigos:', dataPackage.message);
            reject(dataPackage.message);
          }

          // Verificar si hay una solicitud de amistad pendiente
          this.usuarioService.verificarSolicitudAmistad(this.idUsuarioAutenticado, this.idUsuario).subscribe((dataPackage: DataPackage) => {
            if (dataPackage.status === 200) {
              let solicitudAmistadPendiente = dataPackage.data;
              if (solicitudAmistadPendiente) {
                this.relacion = 'solicitudEnviada';
              }
            } else {
              console.error('Error al verificar si son amigos:', dataPackage.message);
              reject(dataPackage.message);
            }

            // Verificar si hay una solicitud de amistad pendiente desde el otro lado
            this.usuarioService.verificarSolicitudAmistad(this.idUsuario, this.idUsuarioAutenticado).subscribe((dataPackage: DataPackage) => {
              if (dataPackage.status === 200) {
                let solicitudAmistadPendiente = dataPackage.data;
                if (solicitudAmistadPendiente) {
                  this.relacion = 'solicitudPendiente';
                }
              } else {
                console.error('Error al verificar si son amigos:', dataPackage.message);
                reject(dataPackage.message);
              }

              // Si no hay relación, asignar el valor predeterminado
              if (!this.relacion) {
                this.relacion = 'noSonAmigos';
              }
              resolve(); // Resuelve la promesa cuando todas las verificaciones han terminado
            });
          });
        });
      } else {
        reject('IDs de usuario no válidos');
      }
    });
  }




  // Lógica para enviar una solicitud de amistad
  enviarSolicitudDeAmistad(): void {
    this.usuarioService.enviarSolicitudAmistad(this.idUsuarioAutenticado, this.usuario.id).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          alert('Solicitud de amistad enviada exitosamente.');
          window.location.reload(); // Recargar la página
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        alert('Error al enviar la solicitud de amistad.');
      }
    });
  }

  // Lógica para enviar una solicitud de amistad
  eliminarAmigo(): void {
    this.usuarioService.eliminarAmigo(this.usuario.id).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          alert('Amigo eliminado exitosamente.');
          window.location.reload(); // Recargar la página
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        alert('Error al eliminar amigo.');
      }
    });
  }

  cancelarSolicitudDeAmistad(): void {
    this.usuarioService.cancelarSolicitudAmistad(this.usuario.id).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          alert('Solicitud canceladda exitosamente.');
          window.location.reload(); // Recargar la página
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        alert('Error al cancelar solicitud de amistad.');
      }
    });
  }


  traerPublicacionesSegunPrivacidad() {
    // Lógica para determinar la visibilidad de las publicaciones
    if (this.esMiPerfil) {
      // Si el usuario está viendo su propio perfil, mostrar todas las publicaciones
      this.getPublicaciones(); // Cargar todas las publicaciones del usuario
    } else if (this.usuario.privacidadPerfil === 'Privada') {
      this.publicaciones = []; // No mostrar publicaciones
    } else if (this.usuario.privacidadPerfil === 'Solo amigos') {
      console.info(this.relacion);
      if (this.relacion === 'amigos') {
        this.getPublicaciones(); // Cargar publicaciones si son amigos
      } else {
        this.publicaciones = []; // No mostrar publicaciones si no son amigos
      }
    } else if (this.usuario.privacidadPerfil === 'Pública') {
      this.getPublicaciones(); // Cargar publicaciones si son públicas
    }

  }

  getPublicaciones(): void {
    this.publicacionService.publicaciones(this.idUsuario).subscribe({
      next: (dataPackage) => {
        if (dataPackage.status === 200 && Array.isArray(dataPackage.data)) {
          this.publicaciones = dataPackage.data;
        } else {
          console.error('Error al obtener las publicaciones:', dataPackage.message);
          this.publicaciones = []; // Asigna un array vacío en caso de error
        }
      },
      error: (error) => {
        console.error('Error al obtener las publicaciones:', error);
        this.publicaciones = []; // Asigna un array vacío en caso de error
      }
    });
  }



  gestionarSolicitud(aceptar: boolean): void {
    this.usuarioService.gestionarSolicitudAmistad(this.usuario.id, this.idUsuarioAutenticado, aceptar).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          const mensaje = aceptar ? 'Solicitud de amistad aceptada exitosamente.' : 'Solicitud de amistad rechazada exitosamente.';
          alert(mensaje);
          window.location.reload(); // Recargar la página
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        const mensaje = aceptar ? 'Error al aceptar la solicitud de amistad.' : 'Error al rechazar la solicitud de amistad.';
        alert(mensaje);
      }
    });
  }

  confirmarEliminarPublicacion(idPublicacion: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      this.eliminarPublicacion(idPublicacion);
    }
  }

  eliminarPublicacion(idPublicacion: number): void {
    this.publicacionService.eliminar(idPublicacion).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          alert('Publicación eliminada exitosamente.');
          // Actualizar la lista de publicaciones
          this.getPublicaciones();
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        console.error('Error al eliminar la publicación:', error);
        alert('Error al eliminar la publicación.');
      }
    });
  }
  
  
  getRutinaRealizaUsuario(): void {
    this.rutinaService.rutinasRealizaUsuario(this.idUsuario).subscribe(
      (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.historicoRutinas= dataPackage.data as Rutina[]; // Agregar comunidades a la lista existente
          this.traerDias(this.historicoRutinas); // Llamar a traerDias después de cargar las rutinas
          this.traerEtiquetas(this.historicoRutinas);
        }
      },
      (error) => {
        console.error("Error al cargar las comunidades del usuario:", error);
      }
    );
  }
  
  
  
  traerEtiquetas(rutinas: Rutina[]): void {
    for (let rutina of rutinas) {
      this.rutinaService.obtenerEtiquetasDeRutina(rutina.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && Array.isArray(dataPackage.data)) {
            rutina.etiquetas = dataPackage.data; 
          } else {
            rutina.etiquetas = []; // Aseguramos que etiquetas sea siempre un array
          }
        },
        (error) => {
          console.error(`Error al traer las etiquetas de la rutina ${rutina.id}:`, error);
          rutina.etiquetas = []; // En caso de error, etiquetas será un array vacío
        }
      );
    }
  }
  
  traerDias(rutinas: Rutina[]): void {
    for (let rutina of rutinas) {
      console.info(rutina);
      this.rutinaService.obtenerDiasEnRutina(rutina.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            rutina.dias = dataPackage.data; // Asigna el número de días
          }
        },
        (error) => {
          console.error(`Error al traer los días de la rutina ${rutina.id}:`, error);
        }
      );
    }
  }
  
  
  async traerHistoricoEventos(): Promise<void> {
    if (this.usuario.privacidadPerfil === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadPerfil === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    
    this.eventoService.participaUsuario(this.idUsuario).subscribe(async (dataPackage) => {
      if (Array.isArray(dataPackage.data)) {
        this.historicoEventos = dataPackage.data;
        console.info(this.historicoEventos);
        this.traerParticipantes(this.historicoEventos);
        for (const evento of this.historicoEventos) {
          if (evento.latitud && evento.longitud) {
            evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
          } else {
            evento.ubicacion = 'Ubicación desconocida';
          }
        }
      } else {
        console.error(dataPackage.message);
      }
    });
  }
  
  traerParticipantes(eventos: Evento[]): void {
    // Recorrer todos los eventos y obtener el número de participantes
    for (let evento of eventos) {
      this.eventoService.participantesEnEvento(evento.id).subscribe(
        (dataPackage) => {
          // Asignar el número de participantes al evento
          if (dataPackage && typeof dataPackage.data === 'number') {
            evento.participantes = dataPackage.data; // Asignar el número de participantes
          }
        },
        (error) => {
          console.error('Error al traer los participantes del evento ${evento.id}:', error);
        }
      );
    }
  }
  
  async traerHistoricoComunidades(): Promise<void> {
    if (this.usuario.privacidadPerfil === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadPerfil === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    
    this.comunidadService.miembroUsuario(this.idUsuario).subscribe(async(dataPackage) => {
      if (Array.isArray(dataPackage.data)) {
        this.historicoComunidades = dataPackage.data;
        console.info(this.historicoComunidades);
        this.traerMiembros(this.historicoComunidades); // Llamar a traerParticipantes después de cargar los eventos
        for (const comunidad of this.historicoComunidades) {
          if (comunidad.latitud && comunidad.longitud) {
            comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          } else {
            comunidad.ubicacion = 'Ubicación desconocida';
          }
        }
      } else {
        console.error(dataPackage.message);
      }
    });
  }
  
  traerMiembros(comunidades: Comunidad[]): void {
    for (let comunidad of comunidades) {
      this.comunidadService.miembrosEnComunidad(comunidad.id).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            comunidad.miembros = dataPackage.data; // Asignar el número de miembros
          }
        },
        (error) => {
          console.error('Error al traer los miembros de la comunidad ${comunidad.id}:', error);
        }
      );
    }
  }
  
  
  // Método para alternar entre pestañas
  seleccionarTab(tab: string): void {
    this.tabSeleccionada = tab;
  }
  irADetallePublicacion(idPublicacion: number): void {
    this.router.navigate(['/publicacion', idPublicacion]);
  }
  irADetalleComunidad(idComunidad: number): void {
    this.router.navigate(['/comunidad-muro', idComunidad]);
  }
  irADetalleRutina(idRutina: number): void {
    this.router.navigate(['/rutinas', idRutina]);
  }


}
