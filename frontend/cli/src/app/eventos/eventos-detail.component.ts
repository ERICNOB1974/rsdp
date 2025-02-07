import { AfterViewInit, Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventoService } from './evento.service';
import { Evento } from './evento';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; // Para permitir navegar de vuelta
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Usuario } from '../usuarios/usuario';
import { UsuarioService } from '../usuarios/usuario.service';
import { MatDialog } from '@angular/material/dialog'; // Importar MatDialog para el modal
import { ViewChild, TemplateRef } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, NgForm } from '@angular/forms';
import * as L from 'leaflet';
import { DataPackage } from '../data-package';
declare var bootstrap: any;  // Importa Bootstrap de forma global

@Component({
  selector: 'app-evento-detail',
  templateUrl: './eventos-detail.component.html',
  styleUrls: ['./eventos-detail.component.css'],
  imports: [MatProgressSpinnerModule,
    CommonModule, FormsModule, RouterModule],
  standalone: true
})
export class EventoDetailComponent implements OnInit, AfterViewInit {

  motivo: string = '';
  mensaje: string = '';
  evento!: Evento; // Evento específico que se va a mostrar
  isLoading: boolean = false;
  participa: boolean = false;
  amigosNoEnEvento: any[] = [];
  amigosEnEvento: any[] = [];
  amigosYaInvitados: any[] = [];
  participantesVisibles: any[] = [];
  participantesVisiblesPaginados: any[] = [];
  usuariosAnonimos: number = 0; // Inicializamos la variable
  idUsuarioAutenticado!: number;
  creadorEvento!: Usuario;
  cargaInicial: number = 5; // Número inicial de elementos visibles
  cargaIncremento: number = 5; // Número de elementos adicionales cargados en cada scroll
  marcador!: L.Marker; // Agregar una propiedad para el marcador
  @ViewChild('modalExpulsion') modalExpulsion!: TemplateRef<any>; // Referencia al modal
  searchTimeout: any // Variable para almacenar el timer

  creador: boolean = false;
  miembros: Usuario[] = []; // Lista de miembros de la comunidad
  mapa!: L.Map;
  motivoExpulsion: string = '';
  usuarioEliminar: any;
  mostrarMotivo: boolean = false;
  expulsado: boolean = false; // Indica si el usuario fue expulsado
  searchTerm: string = '';  // Para almacenar el término de búsqueda
  page: number = 0;         // Página actual
  size: number = 5;
  loading: boolean = false;  // Para manejar el estado de carga
  loadingScroll: boolean = false;
  buscador: string = '';
  amigosNoEnEventoFiltrados: any[] = [];
  amigosEnEventoFiltrados: any[] = [];
  amigosYaInvitadosFiltrados: any[] = [];
  listaReferencia: any[] = [];
  generoUsuario!: string;
  mostrarAmigosNoEnEvento: boolean = true;
  mostrarAmigosEnEvento: boolean = true;
  mostrarAmigosYaInvitados: boolean = true;
  mostrarMasAmigosNoEnEvento: number = 4;
  mostrarMasAmigosEnEvento: number = 4;
  mostrarMasAmigosYaInvitados: number = 4;
  @ViewChild('tooltipContainer', { static: false }) tooltipContainer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal
  ) { }

  ngOnInit(): void {
    const state = window.history.state;
    if (state && state.mensajeSnackBar) {
      this.snackBar.open(state.mensajeSnackBar, 'Cerrar', {
        duration: 3000,
      });
    }
    this.idUsuarioAutenticado = Number(this.authService.getUsuarioId());
    this.getEvento();
    this.usuarioService.generoUsuario().subscribe((response: DataPackage) => {
      this.generoUsuario = response.data as unknown as string; // Extrae el string del objeto `data`
    });
  }
  toggleMotivo() {
    this.mostrarMotivo = !this.mostrarMotivo;
  }


  checkExpulsion() {
    // Lógica para llamar al backend y verificar si el usuario fue expulsado
    // Suponiendo que tienes un servicio que te permite hacer esto
    this.eventoService.verificarExpulsion(this.idUsuarioAutenticado, this.evento.id)
      .subscribe(response => {
        this.expulsado = response.data as unknown as boolean;
        this.motivoExpulsion = response.message; // Asumiendo que el backend devuelve el motivo
      });
  }
  seleccionarUsuario(usuario: any): void {
    this.usuarioEliminar = usuario;
  }

  private iniciarMapa(): void {
    if (this.evento.latitud !== null && this.evento.longitud !== null) {
      this.colocarCoordenadas(this.evento.latitud, this.evento.longitud); // Inicia el mapa con las coordenadas del usuario
    } else {
      this.colocarCoordenadas(-42.7692, -65.0385);
    }
  }

  private colocarCoordenadas(lat: number, lng: number): void {
    this.mapa = L.map('map').setView([lat, lng], 13);

    // Cambiamos a un mapa satelital usando Esri World Imagery
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(this.mapa);

    // Colocar el marcador en la ubicación del evento
    this.marcador = L.marker([lat, lng]).addTo(this.mapa)
      .bindPopup(`Ubicación: ${this.evento.ubicacion}`) // Cambiado para mostrar this.evento.ubicacion
      .openPopup();

    // Deshabilitar el evento de clic en el mapa
    this.mapa.off('click');
  }



  getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
      this.evento = <Evento>{};
      this.router.navigate(['eventos/crearEvento']);
    }
    else {
      this.eventoService.get(id).subscribe(async dataPackage => {
        this.evento = <Evento>dataPackage.data;
        // if (this.evento.latitud && this.evento.longitud) {
        //   this.evento.ubicacion = await this.eventoService.obtenerUbicacion(this.evento.latitud, this.evento.longitud);
        // } else {
        //   this.evento.ubicacion = 'Ubicación desconocida';
        // }
        if (this.evento) {
          this.evento.fechaDeCreacion = new Date(this.evento.fechaDeCreacion);
          const fechaUTC = new Date(this.evento.fechaHora);
          this.evento.fechaHora = new Date(fechaUTC.getTime() + (3 * 60 * 60 * 1000));
        }
        await this.getCreadorEvento();
        this.traerNumeroParticipantes();
        this.checkParticipacion();
        this.checkExpulsion();
        this.traerMiembros();
        this.traerParticipantes();
        this.contarUsuariosAnonimos();
        this.cargarAmigos();
        this.iniciarMapa();
      });
    }
  }

  traerNumeroParticipantes(): void {
    this.eventoService.participantesEnEvento(this.evento.id).subscribe(
      (dataPackage) => {
        if (dataPackage && typeof dataPackage.data === 'number') {
          this.evento.participantes = dataPackage.data;
        }
      }
    );
  }

  async getCreadorEvento(): Promise<void> {
    return new Promise((resolve) => {
      this.usuarioService.usuarioCreadorEvento(this.evento.id).subscribe(dataPackage => {
        this.creadorEvento = dataPackage.data as Usuario;
        if (this.creadorEvento.id == this.idUsuarioAutenticado) {
          this.creador = true;  // El usuario es el creador
        }
        resolve(); // Resuelve la promesa después de procesar el estado
      });
      this.usuarioService.usuarioCreadorEvento(this.evento.id).subscribe(dataPackage => {
        this.creadorEvento = dataPackage.data as Usuario;
        if (this.creadorEvento.id == this.idUsuarioAutenticado) {
          this.creador = true;  // El usuario es el creador
        }
        resolve(); // Resuelve la promesa después de procesar el estado
      });
    });
  }

  goBack(): void {
    this.location.back();
  }

  async inscribirse(): Promise<void> {
    if (this.inscribirseValid()) {
      this.isLoading = true;
      this.participa = true;

      try {
        const dataPackage = await lastValueFrom(this.eventoService.inscribirse(this.evento.id));
        this.snackBar.open('Inscripción guardada con éxito', 'Cerrar', {
          duration: 3000,
        });
        this.evento.participantes++;
        let nombre = this.authService.getNombreUsuario()!;
        let usuario: Usuario;
        this.usuarioService.findByNombreUsuario(nombre).subscribe(dataPackage => {
          usuario = dataPackage.data as Usuario;
          this.participantesVisibles.push(usuario);
        })
      } catch (error) {
        console.error('Error al inscribirse:', error);
        this.snackBar.open('Error al inscribirse', 'Cerrar', {
          duration: 3000,
        });
      } finally {
        this.isLoading = false; // Habilita el botón nuevamente
      }
    }
  }


  salir(): void {
    this.eventoService.salir(this.evento.id).subscribe(
      dataPackage => {
        this.isLoading = true;
        let mensaje = dataPackage.message;
        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 3000,
        });
        this.participa = false;
        this.evento.participantes--;
        this.participantesVisibles = this.participantesVisibles.filter(s => s.id != this.idUsuarioAutenticado)
        this.isLoading = false;
      },
      error => {
        console.error('Error al salir del evento:', error);
        this.snackBar.open('Error al salir del evento', 'Cerrar', {
          duration: 3000,
        });
        this.isLoading = false;
      }
    );
  }

  checkParticipacion(): void {
    this.eventoService.participa(this.evento.id).subscribe((dataPackage) => {
      this.participa = <boolean><unknown>dataPackage.data;
    });
    this.eventoService.creador(this.evento.id).subscribe((dataPackage) => {
      this.creador = <boolean><unknown>dataPackage.data;
    });
  }

  salirValid(): boolean {
    return this.participa;
  }


  ngAfterViewInit() {
    // Inicializar los tooltips de Bootstrap
    setTimeout(() => { // Esperar a que Angular renderice el DOM
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        new bootstrap.Tooltip(tooltipTriggerEl);
      });
    }, 500);
  }

  generoCompatible(): boolean {
    if (!this.evento || !this.generoUsuario) {
      return false; // Si no hay datos aún, deshabilita el botón por defecto
    }
    const generoEvento = this.evento.genero; // Asume que `this.evento.genero` contiene el género del evento
    return !(
      (this.generoUsuario === "masculino" && (generoEvento === "femenino" || generoEvento === "otros")) ||
      (this.generoUsuario === "femenino" && (generoEvento === "masculino" || generoEvento === "otros")) ||
      (this.generoUsuario === "otros" && (generoEvento === "masculino" || generoEvento === "femenino"))
    );
  }

  botonInvitar(): boolean {
    return this.participa;
  }

  inscribirseValid(): boolean {
    return (this.evento.participantes < this.evento.cantidadMaximaParticipantes) && !this.participa;
  }

  editarEvento(): void {
    this.router.navigate(['/eventos/editarEvento/', this.evento.id]);
  }

  traerMiembros(): void {
    this.eventoService.listaParticipantes(this.evento.id).subscribe(dataPackage => {
      if (Array.isArray(dataPackage.data)) {
        this.miembros = dataPackage.data as Usuario[];
        // this.filtrarParticipantesVisibles(); // Filtra miembros después de obtener amigos
      }
    });
  }


  async traerParticipantes(): Promise<void> {
    if (this.loading) return;  // Evitar solicitudes repetidas mientras se cargan datos
    this.loading = true;

    // Llamada al servicio para obtener miembros filtrados por el término de búsqueda
    this.usuarioService.buscarParticipante(this.evento.id, this.searchTerm, this.page, this.size)
      .subscribe(async dataPackage => {
        if (Array.isArray(dataPackage.data)) {

          // Si es la primera página, reinicia la lista de miembros
          if (this.page === 0) {
            this.participantesVisibles = dataPackage.data;

          } else {
            // Si no es la primera página, agrega los nuevos miembros a la lista
            this.participantesVisibles = [...this.participantesVisibles, ...dataPackage.data];
          }
          console.info(this.participantesVisibles);

        }
        this.loadingScroll = false;
        this.loading = false;
      });
  }

  contarUsuariosAnonimos(): void {
    this.usuarioService.contarParticipantesAnonimos(this.evento.id).subscribe((dataPackage: DataPackage) => {
      this.usuariosAnonimos = Number(dataPackage.data); // Convierte explícitamente a number
      console.info(this.usuariosAnonimos);
    });

  }


  cargarAmigos(): void {
    const idEvento = this.evento.id;

    // Obtener la lista de referencia con usuarios ordenados
    this.usuarioService.usuariosConMasInteracciones().subscribe((dataPackage) => {
      this.listaReferencia = dataPackage.data as Usuario[];

      // Cargar amigos que ya están en el evento
      this.usuarioService.todosLosAmigosDeUnUsuarioPertenecientesAUnEvento(idEvento).subscribe((dataPackage) => {
        this.amigosEnEvento = dataPackage.data as Usuario[];
        this.ordenarLista(this.amigosEnEvento);
        this.amigosEnEventoFiltrados = [...this.amigosEnEvento];
        this.mostrarCategorias();
      });

      // Cargar amigos ya invitados al evento
      this.usuarioService.todosLosAmigosDeUnUsuarioYaInvitadosAUnEventoPorElUsuario(idEvento).subscribe((dataPackage) => {
        this.amigosYaInvitados = dataPackage.data as Usuario[];
        this.ordenarLista(this.amigosYaInvitados);
        this.amigosYaInvitadosFiltrados = [...this.amigosYaInvitados];
        this.mostrarCategorias();
      });

      // Cargar amigos que no están en el evento
      if (!this.evento.esPrivadoParaLaComunidad) {
        this.usuarioService.todosLosAmigosDeUnUsuarioNoPertenecientesAUnEvento(idEvento).subscribe((dataPackage) => {
          this.amigosNoEnEvento = dataPackage.data as Usuario[];
          this.filtrarYOrdenarAmigosNoEnEvento();
          this.amigosNoEnEventoFiltrados = [...this.amigosNoEnEvento];
          this.mostrarCategorias();
        });
      } else {
        this.usuarioService.todosLosAmigosDeUnUsuarioNoPertenecientesAUnEventoPrivadoPeroSiALaComunidad(idEvento).subscribe((dataPackage) => {
          this.amigosNoEnEvento = dataPackage.data as Usuario[];
          this.filtrarYOrdenarAmigosNoEnEvento();
          this.amigosNoEnEventoFiltrados = [...this.amigosNoEnEvento];
          this.mostrarCategorias();
        });
      }
    });
  }

  // Método para ordenar una lista de usuarios en base a la lista de referencia
  ordenarLista(lista: Usuario[]): void {
    lista.sort((a, b) => {
      const indexA = this.listaReferencia.findIndex(usuario => usuario.id === a.id);
      const indexB = this.listaReferencia.findIndex(usuario => usuario.id === b.id);
      return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
    });
  }

  // Filtra y ordena amigos que no están en el evento
  filtrarYOrdenarAmigosNoEnEvento(): void {
    this.amigosNoEnEvento = this.amigosNoEnEvento.filter(
      amigoNoEnEvento =>
        !this.amigosEnEvento.some(amigoEnEvento => amigoEnEvento.id === amigoNoEnEvento.id) &&
        !this.amigosYaInvitados.some(amigoYaInvitado => amigoYaInvitado.id === amigoNoEnEvento.id)
    );
    this.ordenarLista(this.amigosNoEnEvento);
  }


  invitarAmigo(idUsuarioReceptor: number): void {
    const idEvento = this.evento.id;
    this.usuarioService.enviarInvitacionEvento(idUsuarioReceptor, idEvento).subscribe(() => {
      this.cargarAmigos();
      this.cdr.detectChanges(); // Fuerza la actualización del modal
      this.snackBar.open('Invitación enviada con éxito', 'Cerrar', {
        duration: 3000,
      });
    },
      error => {
        console.error('Error al invitar al amigo:', error);
        this.snackBar.open('Error al enviar la invitación', 'Cerrar', {
          duration: 3000,
        });
      });

    lastValueFrom(this.usuarioService.invitacionEvento(idUsuarioReceptor, idEvento)).catch(error => {
      console.error('Error al enviar el email de invitación:', error);
    });
  }

  eliminarEvento(): void {
    this.eventoService.eliminar(this.evento.id).subscribe(dataPackage => {
      let mensaje = dataPackage.message;
      this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000,
      });
      this.location.back()
      //this.router.navigate(['/eventos']);
    });
  }


  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  enviarNotificacion() {
    if (this.mensaje && this.motivo) {
      this.isLoading = true;
      setTimeout(() => {
        this.isLoading = false;
        this.closeModal();
      }, 1000);

      const nombreActividad = "del evento, " + this.evento.nombre;
      this.eventoService.enviarNotificacionEvento(this.mensaje, this.motivo, this.miembros, nombreActividad).subscribe(
        () => {
          this.motivo = '';
          this.mensaje = '';
          this.snackBar.open('Notificación enviada con éxito', 'Cerrar', {
            duration: 3000,
          });
        },
        () => {
          this.snackBar.open('Error al enviar notificación', 'Cerrar', {
            duration: 3000,
          });
        }
      );
    } else {
      console.log('Ambos campos son obligatorios');
    }
  }



  // Método para cerrar el modal
  closeModal() {
    this.modalService.dismissAll();
  }


  onScroll(): void {
    const element = document.querySelector('.members-list') as HTMLElement;
    if (!this.loadingScroll && element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
      this.loadingScroll = true;  // Marca como en proceso de carga
      this.page++;
      this.traerParticipantes();  // Llama a la función de carga de miembros con la nueva página
    }
  }



  abrirModalExpulsion(usuario: any, event: Event): void {
    event.stopPropagation(); // Evita que el clic se propague al `div` con `routerLink`
    this.usuarioEliminar = usuario; // Asigna el usuario al abrir el modal
    this.modalService.open(this.modalExpulsion, {
      centered: true, // Centra el modal
      backdrop: 'static', // Impide cerrar al hacer clic fuera
      keyboard: false, // Desactiva el cierre con teclado
    });
  }

  eliminarMiembro(idUsuario: number, motivo: string) {
    this.eventoService.eliminarMiembro(this.evento.id, idUsuario, motivo).subscribe(dataPackage => {
      this.participantesVisibles = this.participantesVisibles.filter(m => m.id !== idUsuario);
      this.evento.participantes = this.evento.participantes - 1;
    });
  }


  confirmarExpulsion(): void {
    if (!this.motivoExpulsion.trim()) {
      this.snackBar.open('Por favor, ingresa un motivo válido.', 'Cerrar', {
        duration: 3000,
      });
      return;
    }


    this.eliminarMiembro(this.usuarioEliminar.id, this.motivoExpulsion);

    // Limpia los datos
    this.motivoExpulsion = '';
    this.usuarioEliminar = null;
  }

  filtrarAmigos(): void {
    const textoBusqueda = this.buscador.trim().toLowerCase();

    if (textoBusqueda) {
      this.amigosNoEnEventoFiltrados = this.amigosNoEnEvento.filter(amigo =>
        amigo.nombreUsuario.toLowerCase().includes(textoBusqueda)
      );
      this.amigosEnEventoFiltrados = this.amigosEnEvento.filter(amigo =>
        amigo.nombreUsuario.toLowerCase().includes(textoBusqueda)
      );
      this.amigosYaInvitadosFiltrados = this.amigosYaInvitados.filter(amigo =>
        amigo.nombreUsuario.toLowerCase().includes(textoBusqueda)
      );
    } else {
      this.amigosNoEnEventoFiltrados = [...this.amigosNoEnEvento];
      this.amigosEnEventoFiltrados = [...this.amigosEnEvento];
      this.amigosYaInvitadosFiltrados = [...this.amigosYaInvitados];
    }

    this.mostrarCategorias(); // Siempre actualizar visibilidad
  }


  mostrarCategorias(): void {
    this.mostrarAmigosNoEnEvento = this.amigosNoEnEventoFiltrados.length > 0;
    this.mostrarAmigosEnEvento = this.amigosEnEventoFiltrados.length > 0;
    this.mostrarAmigosYaInvitados = this.amigosYaInvitadosFiltrados.length > 0;
  }

  verMasAmigos(categoria: string): void {
    switch (categoria) {
      case 'noEnEvento':
        this.mostrarMasAmigosNoEnEvento += 4;
        break;
      case 'enEvento':
        this.mostrarMasAmigosEnEvento += 4;
        break;
      case 'yaInvitados':
        this.mostrarMasAmigosYaInvitados += 4;
        break;
    }
  }

  buscarParticipantes(): void {
    // Limpia el timer anterior, si existe
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    // Configura un nuevo timer para ejecutar después de 2 segundos
    this.searchTimeout = setTimeout(() => {
      this.page = 0; // Reinicia la página cuando cambia el término de búsqueda
      this.traerParticipantes(); // Trae los miembros con el nuevo término
    }, 1000); // Retraso de 2 segundos
  }

  eventoEsAntiguo(): boolean {
    const hoy = new Date();
    const fechaEvento = new Date(this.evento.fechaHora); // Asegúrate de que `this.evento.fecha` es un string válido para `Date`
    return fechaEvento < hoy;
  }

}
