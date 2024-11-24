import { Component, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-evento-detail',
  templateUrl: './eventos-detail.component.html',
  styleUrls: ['./eventos-detail.component.css'],
  imports: [MatProgressSpinnerModule,
    CommonModule,FormsModule,RouterModule],
  standalone: true
})
export class EventoDetailComponent implements OnInit {

  

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
  @ViewChild('modalInvitarAmigos') modalInvitarAmigos!: TemplateRef<any>;
  @ViewChild('modalExpulsion') modalExpulsion!: TemplateRef<any>; // Referencia al modal

  creador: boolean = false;
  miembros: Usuario[] = []; // Lista de miembros de la comunidad
  motivoExpulsion: string = '';
  usuarioEliminar: any;


  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private modalService: NgbModal 
  ) { }

  ngOnInit(): void {
    this.idUsuarioAutenticado = Number(this.authService.getUsuarioId());
    this.getEvento();
  }


  seleccionarUsuario(usuario: any): void {
    this.usuarioEliminar = usuario;
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
        if (this.evento.latitud && this.evento.longitud) {
          this.evento.ubicacion = await this.eventoService.obtenerUbicacion(this.evento.latitud, this.evento.longitud);
        } else {
          this.evento.ubicacion = 'Ubicación desconocida';
        }

        if (this.evento) {
          this.evento.fechaDeCreacion = new Date(this.evento.fechaDeCreacion);
          this.evento.fechaHora = new Date(this.evento.fechaHora);
        }
        await this.getCreadorEvento();
        this.traerParticipantes();
        this.checkParticipacion();
        this.traerMiembros();
        this.cargarAmigos();

      });
    }
  }

  traerParticipantes(): void {
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

  botonInvitar(): boolean {
    return this.participa && !this.evento.esPrivadoParaLaComunidad;
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
         this.cargarAmigos(); // Espera a obtener amigos
         this.filtrarParticipantesVisibles(); // Filtra miembros después de obtener amigos
      }
    });
  }




  abrirModalInvitarAmigos(): void {
    // Cargar listas de amigos antes de abrir el modal
    this.cargarAmigos();
    this.dialog.open(this.modalInvitarAmigos);
  }

  cerrarModal(): void {
    this.dialog.closeAll();
  }

  cargarAmigos(): void {
    const idEvento = this.evento.id;

    this.usuarioService.todosLosAmigosDeUnUsuarioNoPertenecientesAUnEvento(idEvento).subscribe((dataPackage) => {
      this.amigosNoEnEvento = dataPackage.data as Evento[];

      // Filtrar amigos ya invitados y ya en evento de la lista de no pertenecientes
      this.amigosNoEnEvento = this.amigosNoEnEvento.filter(
        amigoNoEnEvento => !this.amigosEnEvento.some(amigoEnEvento => amigoEnEvento.id === amigoNoEnEvento.id) &&
          !this.amigosYaInvitados.some(amigoYaInvitado => amigoYaInvitado.id === amigoNoEnEvento.id)
      );
    });

    this.usuarioService.todosLosAmigosDeUnUsuarioPertenecientesAUnEvento(idEvento).subscribe((dataPackage) => {
      this.amigosEnEvento = dataPackage.data as Evento[];
    });

    this.usuarioService.todosLosAmigosDeUnUsuarioYaInvitadosAUnEventoPorElUsuario(idEvento).subscribe((dataPackage) => {
      this.amigosYaInvitados = dataPackage.data as Evento[];
    });
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
      this.router.navigate(['/eventos']);
    });
  }

  filtrarParticipantesVisibles(): void {
    // Verificamos que los datos requeridos estén definidos
    if (!this.amigosEnEvento || !this.miembros) {
      console.error("Amigos o miembros no están definidos.");
      return;
    }

    const amigosIds = this.amigosEnEvento.map(amigo => amigo.id);
    this.participantesVisibles = []; // Reiniciamos la lista de miembros visibles
    this.usuariosAnonimos = 0; // Reiniciamos el conteo de usuarios anónimos


    // Iterar sobre los miembros y añadir solo aquellos que sean visibles
    this.miembros.forEach(miembro => {
      if (miembro.id === this.idUsuarioAutenticado) {
        // Siempre mostrar el usuario que está viendo la lista
        if (!this.participantesVisibles.some(m => m.id === miembro.id)) {
          this.participantesVisibles.push(miembro);
        }
      } else if (miembro.id == this.creadorEvento.id) {
        if (!this.participantesVisibles.some(m => m.id === miembro.id)) {
            this.participantesVisibles.push(miembro);
        }
      } else if (this.creador) {
        // Si es el creador , añadir todos los miembros
        if (!this.participantesVisibles.some(m => m.id === miembro.id)) {
          this.participantesVisibles.push(miembro);
        }
      } else {
        // Para miembros normales, aplicar la lógica de privacidad
        if (miembro.privacidadEventos === 'Pública') {
          if (!this.participantesVisibles.some(m => m.id === miembro.id)) {
            this.participantesVisibles.push(miembro);
          }
        } else if (miembro.privacidadEventos === 'Solo amigos' && amigosIds.includes(miembro.id)) {
          if (!this.participantesVisibles.some(m => m.id === miembro.id)) {
            this.participantesVisibles.push(miembro);
          }
        } else {
          this.usuariosAnonimos++; // Aumentar el conteo de anónimos si no se muestra
        }
      }
    });
    console.log(this.participantesVisibles);
    this.participantesVisiblesPaginados = this.participantesVisibles.slice(0, this.cargaInicial);
  }

  openModal(content: any) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
  }

  // Método que se llama al enviar la notificación
  enviarNotificacion() {
    if (this.mensaje && this.motivo) {
      const nombreActividad = "del evento, " + this.evento.nombre;
      this.eventoService.enviarNotificacionEvento(this.mensaje, this.motivo, this.miembros, nombreActividad).subscribe(
        response => {
          this.motivo = '';
          this.mensaje = '';
          this.closeModal();
          this.snackBar.open('Notificación enviada con éxito', 'Cerrar', {
            duration: 3000,
          });
        },
        error => {
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
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
      this.cargarMasParticipantes();
    }
  }

  cargarMasParticipantes(): void {
    const totalCargados = this.participantesVisiblesPaginados.length;
    const nuevosMiembros = this.participantesVisibles.slice(totalCargados, totalCargados + this.cargaIncremento);
  
    if (nuevosMiembros.length > 0) {
      this.participantesVisiblesPaginados = [...this.participantesVisiblesPaginados, ...nuevosMiembros];
    } else {
      console.log('No hay más participantes por cargar');
    }
  }


  abrirModalExpulsion(usuario: any): void {
    this.usuarioEliminar = usuario; // Asigna el usuario al abrir el modal
    this.modalService.open(this.modalExpulsion, {
      centered: true, // Centra el modal
      backdrop: 'static', // Impide cerrar al hacer clic fuera
      keyboard: false, // Desactiva el cierre con teclado
    });
  }
  eliminarMiembro(idUsuario: number, motivo:string) {
    this.eventoService.eliminarMiembro(this.evento.id, idUsuario, motivo).subscribe(dataPackage => {

      this.traerMiembros();
    });
  }


  confirmarExpulsion(): void {
    if (!this.motivoExpulsion.trim()) {
      alert('Por favor, ingresa un motivo válido.');
      return;
    }

   
    this.eliminarMiembro(this.usuarioEliminar.id, this.motivoExpulsion);

    // Limpia los datos
    this.motivoExpulsion = '';
    this.usuarioEliminar = null;
  }


}
