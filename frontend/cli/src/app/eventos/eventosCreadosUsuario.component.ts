import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-eventos-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: 'eventosCreadosUsuario.component.html',
  styleUrls: ['eventosCreadosUsuario.component.css', '../css/etiquetas.css', '../css/noCreados.css']
})
export class EventosCreadosUsuarioComponent implements OnInit {
  eventosUsuario: Evento[] = []; // Arreglo para almacenar los eventos creados por el usuario
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  offset: number = 0; // Inicializar el offset
  limit: number = 4; // Número de eventos a cargar por solicitud
  loading: boolean = false; // Para manejar el estado de carga
  noMasEventos = false;
  searchSubjectEventos: Subject<string> = new Subject<string>();
  searchText: string = ""
  constructor(
    private eventoService: EventoService,
    private etiquetaService: EtiquetaService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEventosCreadosUsuario(); // Cargar las comunidades creadas por el usuario al inicializar el componente
    this.searchSubjectEventos
      .pipe(debounceTime(500)) // Espera 0,5 segundo
      .subscribe((nombre: string) => {
        this.buscarEventos(nombre); // Cargar las comunidades creadas por el usuario al inicializar el componente
      });
  }


  buscarEventos(nombre: string): void {
    if (nombre != "") {
      this.loading = false; // Indicamos que estamos buscando
      this.offset = 0;  // Reiniciamos la paginación al buscar
      this.noMasEventos = false;  // Permitimos que se carguen más resultados
      this.eventosUsuario = [];  // Limpiamos los resultados previos
      this.getEventosCreadosUsuarioFiltrados(nombre); // Llamamos al método que carga las rutinas filtradas
    } else {
      this.loading = false;  // Si no hay filtro, indicamos que no estamos buscando
      this.offset = 0;  // Reiniciamos la paginación
      this.noMasEventos = false;  // Permitimos cargar más resultados
      this.eventosUsuario = [];  // Limpiamos los resultados previos
      this.getEventosCreadosUsuario(); // Llamamos al método que carga todas las rutinas
    }
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
              nuevosEventos.forEach((evento) => {
                evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
                const fechaUTC = new Date(evento.fechaHora);
                evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
              });
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

  getEventosCreadosUsuarioFiltrados(nombre: string): void {
    if (this.loading || this.noMasEventos) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loading = true;

    this.eventoService
      .eventosCreadosPorUsuarioFiltrados(nombre, this.offset, this.limit)
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
              nuevosEventos.forEach((evento) => {
                evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
                const fechaUTC = new Date(evento.fechaHora);
                evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
              });
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
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 1 && !this.loading) {
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

  onSearchInputEventos(nombre: string): void {
    this.searchSubjectEventos.next(nombre); // Emite el texto ingresado
  }

  irACrearEvento(): void {
    this.router.navigate(['/eventos/crearEvento']);
  }



}
