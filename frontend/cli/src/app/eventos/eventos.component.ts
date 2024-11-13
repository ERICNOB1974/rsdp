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
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, NgbTypeaheadModule],

  templateUrl: 'eventos.component.html',
  styleUrls: ['eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = []; // Arreglo para almacenar los eventos que provienen del backend
  currentIndexEventos: number = 0; // Índice actual del carrusel
  currentIndexParticipa: number = 0;
  results: Evento[] = [];
  filtroNombreAbierto: boolean = false;
  nombreEventoFiltro: string = '';
  filtroNombreActivo: boolean = true;
  resultadosOriginales: Evento[] = []; // Nueva variable para mantener los datos originales
  tabSeleccionada: string = 'disponibles';
  eventosDisponiblesAMostrar: Evento[] = [];
  cantidadPorPagina = 3; // Cantidad de comunidades a mostrar por cada carga
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  eventosParticipaUsuario: Evento[] = [];
  
  // Filtro por participantes
  filtroParticipantesAbierto: boolean = false;
  minParticipantes: number | null = null;
  maxParticipantes: number | null = null;
  // Variables para control de filtros activos
  filtroParticipantesActivo: boolean = false;
  filtroFechaActivo: boolean = false;
  filtroEtiquetasActivo: boolean = false;

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


  ngOnInit(): void {
    this.getEventos(); // Cargar los eventos al inicializar el componente
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
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
        async (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
            this.traerParticipantes(this.results); // Llamar a traerParticipantes después de cargar los eventos
            for (const evento of this.results) {
              if (evento.latitud && evento.longitud) {
                evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
              } else {
                evento.ubicacion = 'Ubicación desconocida';
              }
            }
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
    if (this.filtroNombreActivo && this.nombreEventoFiltro) {
      this.results = this.resultadosOriginales.filter(evento =>
        evento.nombre.toLowerCase().includes(this.nombreEventoFiltro.toLowerCase())
      );
    } else {
      this.results = [...this.resultadosOriginales]; // Restaurar todos los resultados si el filtro está desactivado
    }
  }

  limpiarFiltroNombre(): void {
    this.nombreEventoFiltro = '';
    this.filtroNombreActivo = false;
    this.results = [...this.resultadosOriginales];
  }

  // Métodos para el filtro por participantes
  toggleFiltroParticipantes(): void {
    this.filtroParticipantesAbierto = !this.filtroParticipantesAbierto;
  }

  aplicarFiltroParticipantes(): void {
    if (this.minParticipantes !== null || this.maxParticipantes !== null) {
      this.eventoService.filtrarParticipantes(this.minParticipantes || 0, this.maxParticipantes || Number.MAX_SAFE_INTEGER).subscribe(
        async (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
            this.traerParticipantes(this.results); // Llamar a traerParticipantes después de cargar los eventos
            for (const evento of this.results) {
              if (evento.latitud && evento.longitud) {
                evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
              } else {
                evento.ubicacion = 'Ubicación desconocida';
              }
            }
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
        async (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
            //this.traerParticipantes(this.results); // Llamar a traerParticipantes después de cargar los eventos
            for (const evento of this.results) {
              if (evento.latitud && evento.longitud) {
                evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
              } else {
                evento.ubicacion = 'Ubicación desconocida';
              }
            }
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
        this.resultadosOriginales = responseData; // Guardar los datos originales
        this.results = [...responseData];
        this.traerParticipantes(this.results); // Llamar a traerParticipantes después de cargar los eventos
        for (const evento of this.results) {
          if (evento.latitud && evento.longitud) {
            evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
          } else {
            evento.ubicacion = 'Ubicación desconocida';
          }
        }
        await this.ParticipaUsuario();
        this.cargarEventosDisponibles();
        this.cargarEventosParticipaUsuario();
        this.cargarMasEventos();
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
  // Métodos para el primer carrusel (eventos)
 
  seleccionarTab(tab: string) {
    this.tabSeleccionada = tab;
  }



  cargarEventosDisponibles() {
    // Suponiendo que 'comunidadesDisponibles' contiene todas las comunidades
    this.eventosDisponiblesAMostrar = this.results.slice(0, this.cantidadPorPagina);
  }

  cargarEventosParticipaUsuario() {
    this.eventosDisponiblesAMostrar = this.eventosDisponiblesAMostrar.slice(0, this.cantidadPorPagina);
  }
  
  cargarMasEventos(): void {
    const startIndex = this.eventosDisponiblesAMostrar.length;
    const moreComunidades = this.results.slice(startIndex, startIndex + this.cantidadPorPagina);
    this.eventosDisponiblesAMostrar = [...this.eventosDisponiblesAMostrar, ...moreComunidades];
  }

  onScroll(): void {
    const container = document.querySelector('.grid-container') as HTMLElement;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      this.cargarMasEventos();
    }
  }

  irADetallesDelEvento(id: number): void {
    this.router.navigate(['/eventos', id]); // Navega a la ruta /eventos/:id
  }



  aplicarTodosLosFiltros2(): void {
    // Reiniciar los resultados a todos los eventos
    this.getEventos().then(() => {
      // Aplicar cada filtro activo en secuencia
      if (this.filtroNombreActivo && this.nombreEventoFiltro) {
        this.aplicarFiltroNombre();
      }

      if (this.filtroParticipantesActivo && (this.minParticipantes !== null || this.maxParticipantes !== null)) {
        this.aplicarFiltroParticipantes();
      }

      if (this.filtroFechaActivo && this.fechaMinFiltro && this.fechaMaxFiltro) {
        this.aplicarFiltroFecha();
      }

      if (this.filtroEtiquetasActivo && this.etiquetasSeleccionadas.length > 0) {
        this.aplicarFiltroEtiquetas();
      }
    });
  }


  async aplicarTodosLosFiltros(): Promise<void> {
    // Comenzamos con todos los resultados originales
    let resultadosFiltrados = [...this.resultadosOriginales];

    // Aplicar filtro por nombre si está activo
    if (this.filtroNombreActivo && this.nombreEventoFiltro) {
      resultadosFiltrados = resultadosFiltrados.filter(comunidad =>
        comunidad.nombre.toLowerCase().includes(this.nombreEventoFiltro.toLowerCase())
      );
    }

    // Aplicar filtro por participantes si está activo
    if (this.filtroParticipantesActivo && (this.minParticipantes !== null || this.maxParticipantes !== null)) {
      const min = this.minParticipantes || 0;
      const max = this.maxParticipantes || Number.MAX_SAFE_INTEGER;

      resultadosFiltrados = resultadosFiltrados.filter(evento =>
        evento.participantes >= min && evento.participantes <= max
      );
    }

    // Aplicar filtro por etiquetas si hay etiquetas seleccionadas
    if (this.filtroEtiquetasActivo && this.etiquetasSeleccionadas.length > 0) {
      const etiquetasIds = this.etiquetasSeleccionadas.map(e => e.nombre);

      try {
        const response = await this.eventoService.filtrarEtiqueta(etiquetasIds).toPromise();
        if (response && response.data && Array.isArray(response.data)) {
          const comunidadesFiltradas = response.data as Evento[];
          resultadosFiltrados = resultadosFiltrados.filter(comunidad =>
            comunidadesFiltradas.some(c => c.id === comunidad.id)
          );
        }
      } catch (error) {
        console.error("Error al filtrar por etiquetas:", error);
      }
    }




    if (this.filtroFechaActivo && this.fechaMinFiltro && this.fechaMaxFiltro) {
      const minDate = new Date(this.fechaMinFiltro);
      const maxDate = new Date(this.fechaMaxFiltro);

      try {
        const response = await this.eventoService.filtrarFecha(
          minDate.toISOString(),
          maxDate.toISOString()
        ).toPromise();

        if (response && response.data && Array.isArray(response.data)) {
          const eventosFiltradosPorFecha = response.data as Evento[];
          resultadosFiltrados = resultadosFiltrados.filter(evento =>
            eventosFiltradosPorFecha.some(e => e.id === evento.id)
          );
        }
      } catch (error) {
        console.error("Error al filtrar por fecha:", error);
      }
    }

    // Actualizar los resultados filtrados
    this.results = resultadosFiltrados;

    // Actualizar información adicional para los resultados filtrados
    await this.actualizarInformacionAdicional();

  }


  private async actualizarInformacionAdicional(): Promise<void> {
    this.traerParticipantes(this.results); // Llamar a traerParticipantes después de cargar los eventos

    for (const comunidad of this.results) {
      if (comunidad.latitud && comunidad.longitud) {
        try {
          comunidad.ubicacion = await this.eventoService.obtenerUbicacion(
            comunidad.latitud,
            comunidad.longitud
          );
        } catch (error) {
          comunidad.ubicacion = 'Ubicación desconocida';
        }
      } else {
        comunidad.ubicacion = 'Ubicación desconocida';
      }
    }
  }





}