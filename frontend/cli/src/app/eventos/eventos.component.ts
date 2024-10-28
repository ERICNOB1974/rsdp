import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Etiqueta } from '../etiqueta/etiqueta';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, NgbTypeaheadModule ],

  templateUrl: 'eventos.component.html',
  styleUrls: ['eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = []; // Arreglo para almacenar los eventos que provienen del backend
  currentIndex: number = 0; // Índice actual del carrusel
  results: Evento[] = [];
  filtroNombreAbierto: boolean = false;
  nombreEventoFiltro: string = '';

  // Filtro por participantes
  filtroParticipantesAbierto: boolean = false;
  minParticipantes: number | null = null;
  maxParticipantes: number | null = null;

  // Filtro por fecha
  filtroFechaAbierto: boolean = false;
  fechaMinFiltro: string = '';
  fechaMaxFiltro: string = '';
  filtroEtiquetasAbierto: boolean = false;
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;


  constructor(private eventoService: EventoService,
    private router: Router,
    private authService: AuthService,  // Inyecta el AuthService
    private cdr: ChangeDetectorRef,
    private etiquetaService: EtiquetaService,
  ) { }
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  eventosParticipaUsuario: Evento[] = [];


  ngOnInit(): void {
    this.getEventos(); // Cargar los eventos al inicializar el componente
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);    
    this.ParticipaUsuario();
  }

  agregarEtiqueta(event: any): void {
    const etiqueta = event.item;
    if (!this.etiquetasSeleccionadas.some(e => e.id === etiqueta.id)) {
      this.etiquetasSeleccionadas.push(etiqueta);
    }
    this.etiquetaSeleccionada = null;
    this.cdr.detectChanges();

  }

  removerEtiqueta(etiqueta: Etiqueta): void {
    this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(e => e.id !== etiqueta.id);
  }

  aplicarFiltroEtiquetas(): void {
    if (this.etiquetasSeleccionadas.length > 0) {
      const etiquetasIds = this.etiquetasSeleccionadas.map(e => e.nombre);
      this.eventoService.filtrarEtiqueta(etiquetasIds).subscribe(
        (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
          } else {
            console.log("No se obtuvieron datos de eventos");
          }
        },
        (error) => {
          console.error("Error al filtrar por etiquetas:", error);
        }
      );
    }
  }

  eliminarEtiqueta(etiqueta: Etiqueta): void {
    this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(e => e.id !== etiqueta.id);
  }

  toggleFiltroEtiquetas(): void {
    this.filtroEtiquetasAbierto = !this.filtroEtiquetasAbierto;
  }
  

  limpiarFiltroEtiquetas(): void {
    this.etiquetasSeleccionadas = [];
    this.getEventos(); // Recargar todos los eventos
  }


  searchEtiqueta = (text$: Observable<string>): Observable<Etiqueta[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.etiquetaService
          .search(term)
          .pipe(
            map((response) => response.data as Etiqueta[]),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    );


  resultFormatEtiqueta(value: Etiqueta) {
    return value.nombre;
  }

  inputFormatEtiqueta(value: Etiqueta) {
    return value ? value.nombre : '';
  }
  


  toggleFiltroNombre(): void {
    this.filtroNombreAbierto = !this.filtroNombreAbierto;
  }

  aplicarFiltroNombre(): void {
    if (this.nombreEventoFiltro) {
      this.results = this.results.filter(evento =>
        evento.nombre.toLowerCase().includes(this.nombreEventoFiltro.toLowerCase())
      );
    }
  }

  limpiarFiltroNombre(): void {
    this.nombreEventoFiltro = '';
    this.getEventos(); // Recargar todos los eventos
  }

  // Métodos para el filtro por participantes
  toggleFiltroParticipantes(): void {
    this.filtroParticipantesAbierto = !this.filtroParticipantesAbierto;
  }

  aplicarFiltroParticipantes(): void {
    if (this.minParticipantes !== null || this.maxParticipantes !== null) {
      this.eventoService.filtrarParticipantes(this.minParticipantes || 0, this.maxParticipantes || Number.MAX_SAFE_INTEGER).subscribe(
        (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
          } else {
            console.log("No se obtuvieron datos de eventos");
          }
        },
        (error) => {
          console.error("Error al filtrar participantes:", error);
        }
      );
    }
  }

  limpiarFiltroParticipantes(): void {
    this.minParticipantes = null;
    this.maxParticipantes = null;
    this.getEventos(); // Recargar todos los eventos
  }

  // Métodos para el filtro por fecha
  toggleFiltroFecha(): void {
    this.filtroFechaAbierto = !this.filtroFechaAbierto;
  }
  aplicarFiltroFecha(): void {
    if (this.fechaMinFiltro && this.fechaMaxFiltro) {
      const minDate = new Date(this.fechaMinFiltro);
      const maxDate = new Date(this.fechaMaxFiltro);

      this.eventoService.filtrarFecha(minDate.toISOString(), maxDate.toISOString()).subscribe(
        (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
          } else {
            console.log("No se obtuvieron datos de eventos");
          }
        },
        (error) => {
          console.error("Error al filtrar fecha:", error);
        }
      );
    } else {
      console.warn("Por favor, asegúrate de que las fechas mínimas y máximas estén definidas.");
    }
  }

  limpiarFiltroFecha(): void {
    this.fechaMinFiltro = '';
    this.fechaMaxFiltro = '';
    this.getEventos(); // Recargar todos los eventos
  }

  // Método para limpiar todos los filtros
  limpiarTodosLosFiltros(): void {
    this.limpiarFiltroNombre();
    this.limpiarFiltroParticipantes();
    this.limpiarFiltroFecha();
    this.limpiarFiltroEtiquetas();

  }


  async getEventos(): Promise<void> {
    this.eventoService.disponibles().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.results = responseData;
        this.traerParticipantes(this.results); // Llamar a traerParticipantes después de cargar los eventos
        for (const evento of this.results) {
          if (evento.latitud && evento.longitud) {
            evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
          } else {
            evento.ubicacion = 'Ubicación desconocida';
          }
        }
      }
    });
  }

  async ParticipaUsuario(): Promise<void> {
    this.eventoService.participaUsuario(this.idUsuarioAutenticado).subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.eventosParticipaUsuario = responseData;
        this.traerParticipantes(this.eventosParticipaUsuario); // Llamar a traerParticipantes después de cargar los eventos
        for (const evento of this.results) {
          if (evento.latitud && evento.longitud) {
            evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
          } else {
            evento.ubicacion = 'Ubicación desconocida';
          }
        }
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
          console.error(`Error al traer los participantes del evento ${evento.id}:`, error);
        }
      );
    }
  }
  actualizarFechaMaxMin(): void {
    if (this.fechaMinFiltro) {
      this.fechaMaxFiltro = this.fechaMinFiltro;
    }
  }

  // Método para mover al siguiente grupo de eventos en el carrusel
  siguienteEvento(): void {
    this.currentIndex = (this.currentIndex + 1) % this.results.length; // Incrementa el índice
  }

  // Método para mover al grupo anterior de eventos en el carrusel
  eventoAnterior(): void {
    this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length; // Decrementa el índice
  }

  // Método para obtener los eventos a mostrar en el carrusel
  // Método para obtener los eventos a mostrar en el carrusel
  obtenerEventosParaMostrar(): Evento[] {
    const eventosParaMostrar: Evento[] = [];

    if (this.results.length === 0) {
      return eventosParaMostrar; // Devuelve un arreglo vacío si no hay eventos
    }

    for (let i = 0; i < 4; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      const evento = this.results[index];

      // Excluir eventos en los que el usuario ya está participando
      const yaParticipa = this.eventosParticipaUsuario.some(
        (eventoParticipado) => eventoParticipado.id === evento.id
      );

      if (!yaParticipa) {
        eventosParaMostrar.push(evento); // Agregar solo si no está participando
      }
    }

    return eventosParaMostrar;
  }


  irADetallesDelEvento(id: number): void {
    this.router.navigate(['/eventos', id]); // Navega a la ruta /eventos/:id
  }
}