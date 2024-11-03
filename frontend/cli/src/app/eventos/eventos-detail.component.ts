import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-evento-detail',
  templateUrl: './eventos-detail.component.html',
  styleUrls: ['./eventos-detail.component.css'],
  imports: [MatProgressSpinnerModule,
    CommonModule],
  standalone: true
})
export class EventoDetailComponent implements OnInit {
  
  eliminarMiembro(_t21: any) {
    throw new Error('Method not implemented.');
  }

  evento!: Evento; // Evento específico que se va a mostrar
  isLoading: boolean = false;
  participa: boolean = false;
  amigosNoEnEvento: any[] = [];
  amigosEnEvento: any[] = [];
  amigosYaInvitados: any[] = [];

  @ViewChild('modalInvitarAmigos') modalInvitarAmigos!: TemplateRef<any>;

  creador: boolean = false;
  miembros: Usuario[] = []; // Lista de miembros de la comunidad


  constructor(
    private route: ActivatedRoute,
    private eventoService: EventoService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef // Inyección de ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getEvento();
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

  goBack(): void {
    this.location.back();
  }


  inscribirse(): void {
    if (this.inscribirseValid()) {
      this.isLoading = true;
      this.participa = true;
      this.eventoService.inscribirse(this.evento.id).subscribe(
        () => {
          this.snackBar.open('Inscripción guardada con éxito', 'Cerrar', {
            duration: 3000,
          });
          this.evento.participantes++;
          this.isLoading = false; // Habilita el botón nuevamente en caso de error
        },
        error => {
          console.error('Error al inscribirse:', error);
          this.snackBar.open('Error al inscribirse', 'Cerrar', {
            duration: 3000,
          });
          this.isLoading = false; // Habilita el botón nuevamente

        }
      );
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

  inscribirseValid(): boolean {
    return (this.evento.participantes < this.evento.cantidadMaximaParticipantes) && !this.participa;
  }

  editarEvento(): void {
    this.router.navigate(['/eventos/editarEvento/', this.evento.id]);
  }

  traerMiembros(): void {
    this.eventoService.listaParticipantes(this.evento.id).subscribe(dataPackage => {
      this.miembros = <Usuario[]>dataPackage.data;
      
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
}
