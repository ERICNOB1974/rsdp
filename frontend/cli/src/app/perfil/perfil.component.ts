import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
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
import { debounceTime, Subject } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { IdEncryptorService } from '../idEcnryptorService';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgIf],
  templateUrl: 'perfil.component.html',
  styleUrls: ['perfil.component.css', '../css/etiquetas.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;  // Objeto para almacenar los datos del perfil que se está viendo
  idUsuario!: number;  // ID del perfil que se está viendo (viene de la URL o lógica del componente)
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  esMiPerfil: boolean = false;  // Para determinar si es el perfil del usuario autenticado
  publicaciones: Publicacion[] = [];
  relacion: string = '';
  rutinasFiltradas: Rutina[] = [];
  isOwnPublication: any;
  historicoRutinas: Rutina[] = [];
  historicoEventos: Evento[] = [];
  historicoComunidades: Comunidad[] = [];
  tabSeleccionada: string = 'publicaciones';
  currentIndexPublicaciones: number = 0; // Índice actual de la página
  cantidadPorPagina: number = 4; // Cantidad de publicaciones por página
  loadingPublicaciones: boolean = false; // Indicador de carga
  noMasPublicaciones: boolean = false; // Indicador de fin de publicaciones
  currentIndexRutinas: number = 0; // Índice actual de la página
  loadingRutinas: boolean = false; // Indicador de carga
  noMasRutinas: boolean = false; // Indicador de fin de publicaciones
  isSearching: boolean = false;  // Variable para indicar si estamos buscando
  currentIndexEventos: number = 0; // Índice actual de la página
  loadingEventos: boolean = false; // Indicador de carga
  noMasEventos: boolean = false; // Indicador de fin de publicaciones
  currentIndexComunidades: number = 0; // Índice actual de la página
  loadingComunidades: boolean = false; // Indicador de carga
  noMasComunidades: boolean = false; // Indicador de fin de publicaciones
  searchText: string = ''
  subTabSeleccionada: string = 'todas'; // 'todas' o 'favoritas'
  subTabRutinasSeleccionada: string = 'todas';

  searchSubjectRutinas: Subject<string> = new Subject<string>();
  searchSubjectComunidades: Subject<string> = new Subject<string>();

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,
    private eventoService: EventoService,
    private comunidadService: ComunidadService,
    private rutinaService: RutinaService,
    private authService: AuthService,  // Inyecta el AuthService
    private router: Router,
    private snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private etiquetaService: EtiquetaService,
    private idEncryptorService: IdEncryptorService
  ) { }

  ngOnInit(): void {
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);

    //this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));


    const idCifrado = this.route.snapshot.paramMap.get('id');
    if (idCifrado) {
      this.idUsuario = this.idEncryptorService.decodeId(idCifrado);
    }
    
    this.cargarPerfil();  // Cargar la información del perfil
    this.searchSubjectRutinas
      .pipe(debounceTime(500)) // Espera 1 segundo
      .subscribe((nombre: string) => {
        this.buscarRutinas(nombre);
      });

    this.searchSubjectComunidades
      .pipe(debounceTime(500)) // Espera 0,5 segundo
      .subscribe((nombre: string) => {
        this.buscarComunidades(nombre);
      });
  }




  onSearchInput(nombre: string): void {
    this.searchSubjectRutinas.next(nombre); // Emite el texto ingresado
  }

  onSearchInputComunidades(nombre: string): void {
    this.searchSubjectComunidades.next(nombre); // Emite el texto ingresado
  }


  // Obtén el usuario autenticado desde el AuthService

  cambiarSubTab(tab: string): void {
    if (this.subTabSeleccionada === tab) {
      return;
    }
    this.subTabSeleccionada = tab;
    this.currentIndexComunidades = 0;
    this.cantidadPorPagina = 4
    this.noMasComunidades = false;
    this.historicoComunidades = [];
    this.cargarComunidades();

  }

  cambiarSubTabRutinas(tab: string): void {
    if (this.subTabRutinasSeleccionada === tab) {
      return;
    }
    this.subTabRutinasSeleccionada = tab;
    this.currentIndexRutinas = 0;
    this.cantidadPorPagina = 4
    this.noMasRutinas = false;
    this.historicoRutinas = [];
    this.cargarRutinas();
  }


  // Cargar el perfil que se está viendo
  cargarPerfil(): void {

    this.usuarioService.get(this.idUsuario).subscribe((dataPackage: DataPackage) => {
      if (dataPackage.status === 200) {
        this.usuario = dataPackage.data as Usuario;
        this.esMiPerfil = this.usuario.id === this.idUsuarioAutenticado;
        if (!this.esMiPerfil) {
          this.verificarRelacion().then(() => {
            this.traerPublicacionesSegunPrivacidad();
            console.info(this.publicaciones);

          }).catch((error) => {
            console.error('Error en la verificación de relación:', error);
          });
        } else {
          this.traerPublicacionesSegunPrivacidad();

        }
      } else {
        console.error(dataPackage.message);
      }
    });
  }

  // Navega a la página de edición de perfil
  editarPerfil(): void {
    this.router.navigate(['/perfilEditable', this.idEncryptorService.encodeId(this.idUsuarioAutenticado)]);
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
          this.relacion = 'solicitudEnviada';
          this.cargarPerfil();
          this.cdr.detectChanges();
          this.snackBar.open('Solicitud de amistad enviada exitosamente.', 'Cerrar', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Error: ' + dataPackage.message, 'Cerrar', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al enviar la solicitud de amistad.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  // Lógica para enviar una solicitud de amistad
  eliminarAmigo(): void {
    this.usuarioService.eliminarAmigo(this.usuario.id).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          this.relacion = '';
          this.cargarPerfil();
          this.cdr.detectChanges();
          this.snackBar.open('Amigo eliminado exitosamente.', 'Cerrar', {
            duration: 3000,
          });
        } else {
          this.snackBar.open('Error: ' + dataPackage.message, 'Cerrar', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        this.snackBar.open('Error al eliminar amigo.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  cancelarSolicitudDeAmistad(): void {
    this.usuarioService.cancelarSolicitudAmistad(this.usuario.id).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          this.relacion = '';
          this.cargarPerfil();
          this.cdr.detectChanges();
          this.snackBar.open('Solicitud cancelada exitosamente.', 'Cerrar', {
            duration: 3000,
          });
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


  traerPublicacionesSegunPrivacidad() {
    // Lógica para determinar la visibilidad de las publicaciones
    if (this.esMiPerfil) {
      // Si el usuario está viendo su propio perfil, mostrar todas las publicaciones
      this.getPublicacionesPaginadas(); // Cargar todas las publicaciones del usuario
    } else if (this.usuario.privacidadPerfil === 'Privada') {
      console.info("entreporaca1111", this.noMasPublicaciones);
      this.publicaciones = []; // No mostrar publicaciones
    } else if (this.usuario.privacidadPerfil === 'Solo amigos') {
      if (this.relacion === 'amigos') {
        this.getPublicacionesPaginadas(); // Cargar publicaciones si son amigos
      } else {
        this.publicaciones = []; // No mostrar publicaciones si no son amigos
      }
    } else if (this.usuario.privacidadPerfil === 'Pública') {
      this.getPublicacionesPaginadas(); // Cargar publicaciones si son públicas
    }

  }

  getPublicacionesPaginadas(): void {
    if (this.loadingPublicaciones || this.noMasPublicaciones) return;

    this.loadingPublicaciones = true;

    this.publicacionService.publicacionesPaginadas(this.idUsuario, this.currentIndexPublicaciones, this.cantidadPorPagina)
      .subscribe({
        next: (dataPackage) => {
          if (dataPackage.status === 200 && Array.isArray(dataPackage.data)) {
            const nuevasPublicaciones = dataPackage.data;

            if (nuevasPublicaciones.length > 0) {
              this.publicaciones = [...this.publicaciones, ...nuevasPublicaciones]; // Añadir las nuevas publicaciones
              this.currentIndexPublicaciones++;
              if (nuevasPublicaciones.length < this.cantidadPorPagina) {
                this.noMasPublicaciones = true;
              }
            } else {
              this.noMasPublicaciones = true;

            }
          } else {
            console.error('Error al obtener las publicaciones:', dataPackage.message);
          }
          this.loadingPublicaciones = false;
        },
        error: (error) => {
          console.error('Error al obtener las publicaciones:', error);
          this.loadingPublicaciones = false;
        }
      });
  }

  gestionarSolicitud(aceptar: boolean): void {
    this.usuarioService.gestionarSolicitudAmistad(this.usuario.id, this.idUsuarioAutenticado, aceptar).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          const mensaje = aceptar ? 'Solicitud de amistad aceptada exitosamente.' : 'Solicitud de amistad rechazada exitosamente.';
          if (aceptar) {
            this.relacion = 'amigos';
            this.cargarPerfil();
            this.cdr.detectChanges();
            this.snackBar.open(mensaje, 'Cerrar', {
              duration: 3000,
            });
          } else {
            this.relacion = '';
            this.cargarPerfil();
            this.cdr.detectChanges();
            this.snackBar.open(mensaje, 'Cerrar', {
              duration: 3000,
            });
          }
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

  confirmarEliminarPublicacion(idPublicacion: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      this.eliminarPublicacion(idPublicacion);
    }
  }

  eliminarPublicacion(idPublicacion: number): void {
    this.publicacionService.eliminar(idPublicacion).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          this.snackBar.open('Publicación eliminada exitosamente.', 'Cerrar', {
            duration: 3000,
          });
          // Actualizar la lista de publicaciones
          //this.getPublicacionesPaginadas();
          this.publicaciones = this.publicaciones.filter(pub => pub.id !== idPublicacion);
        } else {
          this.snackBar.open('Error: ' + dataPackage.message, 'Cerrar', {
            duration: 3000,
          });
        }
      },
      error: (error) => {
        console.error('Error al eliminar la publicación:', error);
        this.snackBar.open('Error al eliminar la publicación.', 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }


  buscarRutinas(nombre: string): void {
    if (this.usuario.privacidadPerfil === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadPerfil === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (nombre != "") {
      this.isSearching = true; // Indicamos que estamos buscando
      this.currentIndexRutinas = 0;  // Reiniciamos la paginación al buscar
      this.noMasRutinas = false;  // Permitimos que se carguen más resultados
      this.historicoRutinas = [];  // Limpiamos los resultados previos
      this.cargarRutinasFiltradas(nombre); // Llamamos al método que carga las rutinas filtradas
    } else {
      this.isSearching = false;  // Si no hay filtro, indicamos que no estamos buscando
      this.currentIndexRutinas = 0;  // Reiniciamos la paginación
      this.noMasRutinas = false;  // Permitimos cargar más resultados
      this.historicoRutinas = [];  // Limpiamos los resultados previos
      this.cargarRutinas(); // Llamamos al método que carga todas las rutinas
    }
  }

  // Método para cargar todas las rutinas (sin filtro)
  cargarRutinas(): void {
    if (this.usuario.privacidadPerfil === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadPerfil === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (this.loadingRutinas || this.noMasRutinas) return;  // Si ya estamos cargando o no hay más resultados, no hacemos nada
    this.loadingRutinas = true;

    const serviceCall =
      this.subTabRutinasSeleccionada === 'todas'
        ? this.rutinaService.rutinasRealizaUsuario(this.idUsuario, "", this.currentIndexRutinas, this.cantidadPorPagina)
        : this.rutinaService.rutinasFavoritas(this.idUsuario, "", this.currentIndexRutinas, this.cantidadPorPagina);


    serviceCall.subscribe(
      (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData) && responseData.length > 0) {
          this.traerDias(responseData);
          this.traerEtiquetasRutina(responseData);
          this.historicoRutinas = [...this.historicoRutinas, ...responseData];  // Agregamos las nuevas rutinas
          this.currentIndexRutinas++;  // Incrementamos el índice para la siguiente carga
          if (responseData.length < this.cantidadPorPagina) {
            this.noMasRutinas = true;
          }
        } else {
          this.noMasRutinas = true;  // No hay más resultados
        }
        this.loadingRutinas = false;  // Desactivamos el indicador de carga
      },
      (error) => {
        console.error('Error al cargar todas las rutinas:', error);
        this.loadingRutinas = false;
      }
    );
  }

  cargarRutinasFiltradas(nombre: string): void {
    if (this.usuario.privacidadPerfil === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadPerfil === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (this.loadingRutinas || this.noMasRutinas) return;  // Si ya estamos cargando o no hay más resultados, no hacemos nada

    this.loadingRutinas = true;

    const serviceCall =
      this.subTabRutinasSeleccionada === 'todas'
        ? this.rutinaService.busquedaRutinasRealizaUsuarioGoogle(this.idUsuario, nombre, this.currentIndexComunidades, this.cantidadPorPagina)
        : this.rutinaService.busquedaRutinasFavoritasUsuarioGoogle(this.idUsuario, nombre, this.currentIndexComunidades, this.cantidadPorPagina);


    serviceCall.subscribe((dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData) && responseData.length > 0) {
        this.traerDias(responseData);
        this.traerEtiquetasRutina(responseData);
        this.historicoRutinas = [...this.historicoRutinas, ...responseData];  // Agregamos las nuevas rutinas
        this.currentIndexRutinas+=this.cantidadPorPagina;  // Incrementamos el índice para la siguiente carga
        if (responseData.length < this.cantidadPorPagina) {
          this.noMasRutinas = true;
        }
      } else {
        this.noMasRutinas = true;  // No hay más resultados
      }
      this.loadingRutinas = false;  // Desactivamos el indicador de carga
    },
      (error) => {
        console.error('Error al cargar rutinas filtradas:', error);
        this.loadingRutinas = false;
      }
    );
  }


  traerEtiquetasRutina(rutinas: Rutina[]): void {
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


  buscarEventos(nombre: string): void {
    if (this.usuario.privacidadEventos === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadEventos === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (nombre != "") {
      this.isSearching = true; // Indicamos que estamos buscando
      this.currentIndexEventos = 0;  // Reiniciamos la paginación al buscar
      this.noMasEventos = false;  // Permitimos que se carguen más resultados
      this.historicoEventos = [];  // Limpiamos los resultados previos
      this.cargarEventosFiltrados(nombre); // Llamamos al método que carga las rutinas filtradas
    } else {
      this.isSearching = false;  // Si no hay filtro, indicamos que no estamos buscando
      this.currentIndexEventos = 0;  // Reiniciamos la paginación
      this.noMasEventos = false;  // Permitimos cargar más resultados
      this.historicoEventos = [];  // Limpiamos los resultados previos
      this.cargarEventos(); // Llamamos al método que carga todas las rutinas
    }
  }

  cargarEventos(): void {
    if (this.usuario.privacidadEventos === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadEventos === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (this.loadingEventos || this.noMasEventos) return;  // Si ya estamos cargando o no hay más resultados, no hacemos nada
    this.loadingEventos = true;

    this.eventoService.participaUsuario(this.idUsuario, "", this.currentIndexEventos, this.cantidadPorPagina).subscribe(
      async (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData) && responseData.length > 0) {
          this.traerParticipantes(responseData);
          this.traerEtiquetasEvento(responseData);
          responseData.forEach((evento) => {
            evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
            const fechaUTC = new Date(evento.fechaHora);
            evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
          });
          this.historicoEventos = [...this.historicoEventos, ...responseData];  // Agregamos las nuevas rutinas
          this.currentIndexEventos++;  // Incrementamos el índice para la siguiente carga
          if (responseData.length < this.cantidadPorPagina) {
            this.noMasEventos = true;
          }
        } else {
          this.noMasEventos = true;  // No hay más resultados
        }
        this.loadingEventos = false;  // Desactivamos el indicador de carga
      },
      (error) => {
        console.error('Error al cargar todas las rutinas:', error);
        this.loadingEventos = false;
      }
    );
  }

  cargarEventosFiltrados(nombre: string): void {
    if (this.usuario.privacidadEventos === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadEventos === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (this.loadingEventos || this.noMasEventos) return;  // Si ya estamos cargando o no hay más resultados, no hacemos nada

    this.loadingEventos = true;


    this.eventoService.busquedaEventosParticipaHistoricoGoogle(this.idUsuario, nombre, this.currentIndexEventos, this.cantidadPorPagina).subscribe(
      async (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData) && responseData.length > 0) {
          responseData.forEach((evento) => {
            evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
            const fechaUTC = new Date(evento.fechaHora);
            evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
          });
          this.traerParticipantes(responseData);
          this.traerEtiquetasEvento(responseData);
          this.historicoEventos = [...this.historicoEventos, ...responseData];  // Agregamos las nuevas rutinas
          this.currentIndexEventos+=this.cantidadPorPagina;  // Incrementamos el índice para la siguiente carga
          if (responseData.length < this.cantidadPorPagina) {
            this.noMasEventos = true;
          }
        } else {
          this.noMasEventos = true;  // No hay más resultados
        }
        this.loadingEventos = false;  // Desactivamos el indicador de carga
      },
      (error) => {
        console.error('Error al cargar rutinas filtradas:', error);
        this.loadingEventos = false;
      }
    );
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



  buscarComunidades(nombre: string): void {
    if (this.usuario.privacidadComunidades === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadComunidades === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (nombre != "") {
      this.isSearching = true; // Indicamos que estamos buscando
      this.currentIndexComunidades = 0;  // Reiniciamos la paginación al buscar
      this.noMasComunidades = false;  // Permitimos que se carguen más resultados
      this.historicoComunidades = [];  // Limpiamos los resultados previos
      this.cargarComunidadesFiltradas(nombre); 
    
    } else {
      this.isSearching = false;  // Si no hay filtro, indicamos que no estamos buscando
      this.currentIndexComunidades = 0;  // Reiniciamos la paginación
      this.noMasComunidades = false;  // Permitimos cargar más resultados
      this.historicoComunidades = [];  // Limpiamos los resultados previos
      this.cargarComunidades(); // Llamamos al método que carga todas las rutinas
    }
  }



  cargarComunidades(): void {
    if (this.usuario.privacidadComunidades === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadComunidades === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;

    if (this.loadingComunidades || this.noMasComunidades) return;  // Si ya estamos cargando o no hay más resultados, no hacemos nada
    this.loadingComunidades = true;

    const serviceCall =
      this.subTabSeleccionada === 'todas'
        ? this.comunidadService.miembroUsuario(this.idUsuario, "", this.currentIndexComunidades, this.cantidadPorPagina)
        : this.comunidadService.comunidadesFavoritas(this.idUsuario, "", this.currentIndexComunidades, this.cantidadPorPagina);

    serviceCall.subscribe(
      async (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData) && responseData.length > 0) {
          this.traerMiembros(responseData); // Llamar a traerParticipantes después de cargar los eventos

          // for (const comunidad of responseData) {
          //   if (comunidad.latitud && comunidad.longitud) {
          //     comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          //   } else {
          //     comunidad.ubicacion = 'Ubicación desconocida';
          //   }
          // }
          this.traerEtiquetasComunidades(responseData);
          this.historicoComunidades = [...this.historicoComunidades, ...responseData];  // Agregamos las nuevas rutinas
          this.currentIndexComunidades++;  // Incrementamos el índice para la siguiente carga
          if (responseData.length < this.cantidadPorPagina) {
            this.noMasComunidades = true;
          }
        } else {
          this.noMasComunidades = true;  // No hay más resultados
        }
        this.loadingComunidades = false;  // Desactivamos el indicador de carga

      },
      (error) => {
        console.error('Error al cargar todas las rutinas:', error);
        this.loadingComunidades = false;
      }
    );
  }

  cargarComunidadesFiltradas(nombre: string): void {
    if (this.usuario.privacidadComunidades === 'Privada' && !this.esMiPerfil) return;
    if (this.usuario.privacidadComunidades === 'Solo amigos' && this.relacion !== 'amigos' && !this.esMiPerfil) return;
    if (this.loadingComunidades || this.noMasComunidades) return;  // Si ya estamos cargando o no hay más resultados, no hacemos nada

    this.loadingComunidades = true;

    const serviceCall =
      this.subTabSeleccionada === 'todas'
        ? this.comunidadService.busquedaComunidadesParticipaUsuarioGoogle(this.idUsuario,nombre, this.currentIndexComunidades, this.cantidadPorPagina)
        : this.comunidadService.busquedaComunidadesFavoritasUsuarioGoogle(this.idUsuario, nombre, this.currentIndexComunidades, this.cantidadPorPagina);

    serviceCall.subscribe(
      async (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData) && responseData.length > 0) {

          this.traerMiembros(responseData); // Llamar a traerParticipantes después de cargar los eventos

          // for (const comunidad of responseData) {
          //   if (comunidad.latitud && comunidad.longitud) {
          //     comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          //   } else {
          //     comunidad.ubicacion = 'Ubicación desconocida';
          //   }
          // }
          this.traerEtiquetasComunidades(responseData);
          this.historicoComunidades = [...this.historicoComunidades, ...responseData];  // Agregamos las nuevas rutinas
          this.currentIndexComunidades+=this.cantidadPorPagina;  // Incrementamos el índice para la siguiente carga
          if (responseData.length < this.cantidadPorPagina) {
            this.noMasComunidades = true;
          }
        } else {
          this.noMasComunidades = true;  // No hay más resultados
        }
        this.loadingComunidades = false;  // Desactivamos el indicador de carga
      },
      (error) => {
        console.error('Error al cargar rutinas filtradas:', error);
        this.loadingComunidades = false;
      }
    );
  }



  traerMiembros(comunidades: Comunidad[]): void {
    for (let comunidad of comunidades) {
      this.comunidadService.cantidadMiembrosEnComunidad(comunidad.id).subscribe(
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
    if (tab !== this.tabSeleccionada) {
      this.tabSeleccionada = tab;
      this.searchText = '';
      this.isSearching = false;

      switch (tab) {
        case 'eventos':
          // Si el tab seleccionado es 'eventos', reiniciamos o configuramos lo necesario para eventos
          this.historicoEventos = [];
          this.loadingEventos = false;
          this.noMasEventos = false;
          this.currentIndexEventos = 0;

          this.cargarEventos(); // O cualquier acción que necesites para eventos
          break;

        case 'rutinas':
          // Si el tab seleccionado es 'rutinas', reiniciamos o configuramos lo necesario para rutinas
          this.historicoRutinas = [];
          this.loadingRutinas = false;
          this.noMasRutinas = false;
          this.currentIndexRutinas = 0;
          this.cargarRutinas(); // O cualquier acción que necesites para rutinas
          break;

        case 'comunidades':
          // Si el tab seleccionado es 'comunidades', reiniciamos o configuramos lo necesario para comunidades
          this.historicoComunidades = [];
          this.loadingComunidades = false;
          this.noMasComunidades = false;
          this.currentIndexComunidades = 0;
          this.cargarComunidades(); // O cualquier acción que necesites para comunidades
          break;

        default:
          // Si el tab no es ninguno de los anteriores, puedes manejarlo de alguna forma si es necesario
          break;
      }
    }
  }

  irADetallePublicacion(idPublicacion: number): void {
    this.router.navigate(['/publicacion', this.idEncryptorService.encodeId(idPublicacion)]);
  }
  irADetalleComunidad(idComunidad: number): void {
    this.router.navigate(['/comunidad-muro', this.idEncryptorService.encodeId(idComunidad)]);
  }
  irADetalleRutina(idRutina: number): void {
    this.router.navigate(['/rutinas', this.idEncryptorService.encodeId(idRutina)]);
  }
  irADetalleEvento(idEvento: number): void {
    this.router.navigate(['/eventos', this.idEncryptorService.encodeId(idEvento)]);
  }

  cargarMasRutinas(): void {
    if (this.isSearching) {
      this.cargarRutinasFiltradas("");  // Si estamos buscando, cargamos más resultados filtrados
    } else {
      this.cargarRutinas();  // Si no estamos buscando, cargamos más rutinas sin filtro
    }
  }

  cargarMasEventos(): void {

    if (this.isSearching && this.searchText.trim() !== '') {
      this.cargarEventosFiltrados(this.searchText);  // Si estamos buscando y el texto no está vacío, cargamos los eventos filtrados
    } else {
      this.cargarEventos();  // Si no estamos buscando o el texto está vacío, cargamos eventos sin filtro
    }
  }

  cargarMasComunidades(): void {

    if (this.isSearching && this.searchText.trim() !== '') {
      this.cargarComunidadesFiltradas(this.searchText);  // Si estamos buscando y el texto no está vacío, cargamos los eventos filtrados
    } else {
      this.cargarComunidades();  // Si no estamos buscando o el texto está vacío, cargamos eventos sin filtro
    }
  }

  irAPublicar() {
    this.router.navigate(['/publicacion']);
  }


  traerEtiquetasEvento(eventos: Evento[]): void {
    for (let evento of eventos) {
      this.etiquetaService.obtenerEtiquetasDeEvento(evento.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && Array.isArray(dataPackage.data)) {
            evento.etiquetas = dataPackage.data; // Asignar el número de días
          }
        },
        (error) => {
          console.error(`Error al traer las Etiquetas del evento ${evento.id}:`, error);
        }
      );
    }
  }
  traerEtiquetasComunidades(comunidades: Comunidad[]): void {
    for (let comunidad of comunidades) {
      this.etiquetaService.etiquetasEnComunidad(comunidad.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && Array.isArray(dataPackage.data)) {
            comunidad.etiquetas = dataPackage.data; // Asignar el número de días
          }
        },
        (error) => {
          console.error(`Error al traer las Etiquetas de la comunidad ${comunidad.id}:`, error);
        }
      );
    }
  }
}
