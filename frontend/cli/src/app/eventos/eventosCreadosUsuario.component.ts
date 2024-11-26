import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-eventos-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: 'eventosCreadosUsuario.component.html',
  styleUrls: ['eventosCreadosUsuario.component.css']
})
export class EventosCreadosUsuarioComponent implements OnInit {
  eventosUsuario: Evento[] = []; // Arreglo para almacenar los eventos creados por el usuario
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  offset: number = 0; // Inicializar el offset
  limit: number = 4; // Número de eventos a cargar por solicitud
  loading: boolean = false; // Para manejar el estado de carga
  noMasEventos = false;
  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getEventosCreadosUsuario(); // Cargar las comunidades creadas por el usuario al inicializar el componente
  }



  getEventosCreadosUsuario(): void {
    if (this.loading || this.noMasEventos) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loading = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.eventoService
      .eventosCreadosPorUsuario(this.offset, this.limit)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Evento[]
          if (resultados && resultados.length > 0) {
            console.log(resultados);
            console.log("offset:",this.offset);
            console.log("limit:",this.limit);


            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerParticipantes(resultados); // Llamar a traerParticipantes después de cargar los eventos
            // for (const evento of resultados) {
            //   evento.ubicacion = evento.latitud && evento.longitud 
            //   ? await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud)
            //   : 'Ubicación desconocida';
            // }
            this.eventosUsuario = [
              ...this.eventosUsuario,
              ...resultados,
            ];
            this.offset += this.limit;

          } else {
            this.noMasEventos = true; // No hay más comunidades por cargar
          }
          this.loading = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loading = false;
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
          console.error(`Error al traer los participantes del evento ${evento.id}:`, error);
        }
      );
    }
  }

  irADetallesDelEvento(id: number): void {
    this.router.navigate(['/eventos', id]);
  }

  onScroll(): void {
    const element = document.querySelector('.eventos-list') as HTMLElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight-1 && !this.loading) {
      this.getEventosCreadosUsuario();
    }
  }
}
