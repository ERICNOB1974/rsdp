import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { AuthService } from '../autenticacion/auth.service';
import { EtiquetaService } from '../etiqueta/etiqueta.service';

@Component({
  selector: 'app-eventos-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: 'eventosCreadosUsuario.component.html',
  styleUrls: ['eventosCreadosUsuario.component.css', '../css/etiquetas.css',  '../css/noCreados.css']
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
    private etiquetaService: EtiquetaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getEventosCreadosUsuario(); // Cargar las comunidades creadas por el usuario al inicializar el componente
  }



  getEventosCreadosUsuario(): void {
    if (this.loading || this.noMasEventos) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
  
    this.loading = true;
  
    this.eventoService
      .eventosCreadosPorUsuario(this.offset, this.limit)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Evento[];
  
          if (resultados && resultados.length > 0) {
            // Filtrar los resultados para evitar duplicados
            const nuevosEventos = resultados.filter(
              (eventoNuevo) =>
                !this.eventosUsuario.some(
                  (eventoExistente) => eventoExistente.id === eventoNuevo.id
                )
            );
  
            if (nuevosEventos.length > 0) {
              this.traerParticipantes(nuevosEventos); // Llamar a traerParticipantes después de cargar los eventos
              this.traerEtiquetas(nuevosEventos);
              this.eventosUsuario = [...this.eventosUsuario, ...nuevosEventos];
              this.offset += this.limit;
            } else {
              this.noMasEventos = true; // No hay más eventos nuevos
            }
          } else {
            this.noMasEventos = true; // No hay más eventos por cargar
          }
  
          this.loading = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más eventos:', error);
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

  traerEtiquetas(eventos: Evento[]): void {
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

  irACrearEvento(): void {
    this.router.navigate(['/eventos/crearEvento']);
  }
}
