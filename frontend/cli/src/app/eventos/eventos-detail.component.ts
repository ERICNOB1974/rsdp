import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from './evento.service';
import { Evento } from './evento';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; // Para permitir navegar de vuelta
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';



@Component({
  selector: 'app-evento-detail',
  templateUrl: './eventos-detail.component.html',
  styleUrls: ['./eventos-detail.component.css'],
  imports: [MatProgressSpinnerModule,
    CommonModule],
  standalone: true
})
export class EventoDetailComponent implements OnInit {

  evento!: Evento; // Evento específico que se va a mostrar
  isLoading: boolean = false;
  participa: boolean = false;
  creador: boolean = false;

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private eventoService: EventoService, // Servicio para obtener el evento por ID
    private location: Location, // Para manejar la navegación
    private router: Router,
    private snackBar: MatSnackBar // Agrega MatSnackBar en el constructor
  ) { }


  ngOnInit(): void {
    this.getEvento();
    //this.traerParticipantes();
  }


  getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
      this.evento = <Evento>{};
      this.router.navigate(['eventos/crearEvento']);
    }
    else {
      this.eventoService.get(parseInt(id)).subscribe(async dataPackage => {
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
        this.checkParticipacion()

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

  editarEvento():void{
    
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


}
