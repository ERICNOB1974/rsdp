import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Etiqueta } from '../etiqueta/etiqueta';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { catchError, debounceTime, distinctUntilChanged, filter, lastValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../autenticacion/auth.service';
import { IdEncryptorService } from '../idEcnryptorService';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, NgbTypeaheadModule],

  templateUrl: 'eventos.component.html',
  styleUrls: ['eventos.component.css', '../css/filtros.css', '../css/etiquetas.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = []; // Arreglo para almacenar los eventos que provienen del backend
  currentIndexEventos: number = 0; // Índice actual del carrusel
  currentIndexParticipa: number = 0;
  results: Evento[] = [];
  filtroNombreAbierto: boolean = false;
  nombreEventoFiltro: string = '';
  filtroNombreActivo: boolean = false;
  resultadosOriginales: Evento[] = []; // Nueva variable para mantener los datos originales
  eventosDisponiblesAMostrar: Evento[] = [];
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  eventosParticipaUsuario: Evento[] = [];
  tabSeleccionada: string = 'disponibles';
  cantidadPorPagina = 4; // Cantidad de comunidades a mostrar por cada carga
  currentIndexEventosDisponibles = 0;
  currentIndexEventosParticipante = 0;
  noMasEventosDisponibles = false;
  noMasEventosParticipante = false;
  loadingDisponibles = false;
  loadingParticipante = false;
  resultadosFiltradosPaginados: Evento[] = [];
  resultadosFiltrados: Evento[] = []; // Nueva variable para mantener los datos originales
  currentIndexFiltrados: number = 0;
  noMasResultadosFiltrados: boolean = false;
  loadingFiltrados: boolean = false;
  hayResultadosFiltrados: boolean = false;
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
  filtersVisible: boolean = false;
  filtersAnimating: boolean = false;
  private searchTimeout: any; // Variable para almacenar el timeout

  mapaCreadorEventos: Map<number, Usuario> = new Map();

  constructor(private eventoService: EventoService,
    private router: Router,
    private authService: AuthService,  // Inyecta el AuthService
    private cdr: ChangeDetectorRef,
    private etiquetaService: EtiquetaService,
    private idEncryptorService: IdEncryptorService,
    private usuarioService: UsuarioService

  ) { }


  ngOnInit(): void {

    this.cargarEventosDisponibles(); // Cargar las primeras comunidades al iniciar
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.cargarEventosParticipante();

  }

  toggleFilters() {
    if (this.filtersAnimating) return;

    this.filtersAnimating = true;

    if (this.filtersVisible) {
      this.filtersVisible = false;
      setTimeout(() => {
        this.filtersAnimating = false;
      }, 500);
    } else {
      this.filtersVisible = true;
      setTimeout(() => {
        this.filtersAnimating = false;
      }, 500);
    }
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

  async aplicarFiltroEtiquetas2(): Promise<Evento[]> {
    try {
      const etiquetasIds = this.etiquetasSeleccionadas.map(e => e.nombre);
      const dataPackage = await lastValueFrom(this.eventoService.filtrarEtiqueta(etiquetasIds, this.tabSeleccionada, this.idUsuarioAutenticado));
      if (Array.isArray(dataPackage.data)) {
        return dataPackage.data;
      }
      return []; // Devuelve lista vacía si no es un array válido
    } catch (error) {
      console.error("Error al filtrar etiquetas:", error);
      return []; // Manejo de errores devolviendo una lista vacía
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
    this.aplicarTodosLosFiltros();
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


  /*   async aplicarFiltroNombre2(): Promise<Evento[]> {
      try {
        const dataPackage = await lastValueFrom(
          this.eventoService.filtrarNombre(this.nombreEventoFiltro, this.tabSeleccionada, this.idUsuarioAutenticado)
        );
        return dataPackage.data as Evento[];
      } catch (error) {
        console.error('Error al filtrar eventos por nombre:', error);
        return []; // Devuelve una lista vacía en caso de error
      }
    } */


  async aplicarFiltroNombre2(): Promise<Evento[]> {
    try {
      let dataPackage;

      if (this.tabSeleccionada === 'disponibles') {
        dataPackage = await lastValueFrom(
          this.eventoService.busquedaEventosDisponiblesGoogle(
            this.idUsuarioAutenticado,
            this.nombreEventoFiltro,
            0,
            99999999
          )
        );
      } else if (this.tabSeleccionada === 'miembro') {
        dataPackage = await lastValueFrom(
          this.eventoService.busquedaEventosParticipaFuturoGoogle(
            this.idUsuarioAutenticado,
            this.nombreEventoFiltro,
            0,
            99999999
          )
        );
      } else {
        throw new Error('Pestaña seleccionada inválida');
      }

      return dataPackage.data as Evento[];
    } catch (error) {
      console.error('Error al filtrar comunidades por nombre:', error);
      return []; // Devuelve una lista vacía en caso de error
    }
  }

  limpiarFiltroNombre(): void {
    this.nombreEventoFiltro = '';
    this.filtroNombreActivo = false;
    this.aplicarTodosLosFiltros();
  }



  // Métodos para el filtro por participantes
  toggleFiltroParticipantes(): void {
    this.filtroParticipantesAbierto = !this.filtroParticipantesAbierto;
  }


  async aplicarFiltroParticipantes2(): Promise<Evento[]> {
    try {
      const params: any = {
        tipo: this.tabSeleccionada,
        usuarioId: this.idUsuarioAutenticado,
        min: this.minParticipantes || 0,
      };

      if (this.maxParticipantes !== undefined && this.maxParticipantes !== null) {
        params.max = this.maxParticipantes;
      }

      const dataPackage = await lastValueFrom(
        this.eventoService.filtrarParticipantes(params)
      );

      if (Array.isArray(dataPackage.data)) {
        return dataPackage.data;
      }
      return []; // Devuelve lista vacía si no es un array válido
    } catch (error) {
      console.error("Error al filtrar participantes:", error);
      return []; // Manejo de errores devolviendo una lista vacía
    }
  }


  limpiarFiltroParticipantes(): void {
    this.minParticipantes = null;
    this.maxParticipantes = null;
    this.filtroParticipantesActivo = false;
    this.aplicarTodosLosFiltros();
  }

  // Métodos para el filtro por fecha
  toggleFiltroFecha(): void {
    this.filtroFechaAbierto = !this.filtroFechaAbierto;
  }

  async aplicarFiltroFecha(): Promise<Evento[]> {
    try {
      let minDate = this.fechaMinFiltro ? new Date(this.fechaMinFiltro).toISOString() : null;
      let maxDate = this.fechaMaxFiltro ? new Date(this.fechaMaxFiltro).toISOString() : null;

      const dataPackage = await lastValueFrom(
        this.eventoService.filtrarFecha(
          this.tabSeleccionada,
          this.idUsuarioAutenticado,
          minDate ?? "", // Si minDate es null, envía una cadena vacía
          maxDate ?? ""  // Si maxDate es null, envía una cadena vacía
        )
      );

      if (Array.isArray(dataPackage.data)) {
        return dataPackage.data;
      }
      return []; // Devuelve lista vacía si no es un array válido
    } catch (error) {
      console.error("Error al filtrar participantes:", error);
      return []; // Manejo de errores devolviendo una lista vacía
    }
  }




  limpiarFiltroFecha(): void {
    this.fechaMinFiltro = '';
    this.fechaMaxFiltro = '';
    this.aplicarTodosLosFiltros();
  }

  // Método para limpiar todos los filtros
  limpiarTodosLosFiltros(): void {
    this.nombreEventoFiltro = '';
    this.filtroNombreActivo = false;
    this.minParticipantes = null;
    this.maxParticipantes = null;
    this.filtroParticipantesActivo = false;
    this.fechaMinFiltro = '';
    this.fechaMaxFiltro = '';
    this.etiquetasSeleccionadas = [];
    this.filtroEtiquetasActivo = false;

    // Restaurar todos los resultados
    this.currentIndexEventosDisponibles = 0;
    this.currentIndexEventosParticipante = 0;
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

  seleccionarTab(tab: string) {
    if (this.tabSeleccionada !== tab) {
      this.tabSeleccionada = tab;
      this.filtroParticipantesActivo = false;
      this.filtroEtiquetasActivo = false;
      this.filtroNombreActivo = false
      if (this.tabSeleccionada === 'disponibles') {
        this.loadingDisponibles = false;
        this.cargarEventosDisponibles();
      } else if (this.tabSeleccionada === 'participante') {
        this.loadingParticipante = false;
        this.cargarEventosParticipante();
      } else if (this.tabSeleccionada === 'filtros') {

      }
    }
  }



  // Método para cargar más comunidades disponibles
  cargarEventosDisponibles(): void {
    if (this.loadingDisponibles || this.noMasEventosDisponibles) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loadingDisponibles = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.eventoService
      .disponibles(this.currentIndexEventosDisponibles, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Evento[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerParticipantes(resultados); // Llamar a traerParticipantes después de cargar los eventos
            this.traerEtiquetas(resultados);
            resultados.forEach(async (evento) => {
              evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
              const fechaUTC = new Date(evento.fechaHora);
              evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
              await this.getCreadorEvento(evento);
            });
            this.eventosDisponiblesAMostrar = [
              ...this.eventosDisponiblesAMostrar,
              ...resultados,
            ];
            this.currentIndexEventosDisponibles++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasEventosDisponibles = true; // No hay más comunidades por cargar
          }
          this.loadingDisponibles = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loadingDisponibles = false;
        }
      );
  }

  cargarEventosParticipante(): void {
    if (this.loadingParticipante || this.noMasEventosParticipante) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loadingParticipante = true;
    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.eventoService
      .participaUsuarioAFuturo(this.idUsuarioAutenticado, "", this.currentIndexEventosParticipante, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Evento[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerParticipantes(resultados); // Llamar a traerParticipantes después de cargar los eventos
            resultados.forEach(async (evento) => {
              evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
              const fechaUTC = new Date(evento.fechaHora);
              evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
              await this.getCreadorEvento(evento);

            });
            this.traerEtiquetas(resultados);
            this.eventosParticipaUsuario = [
              ...this.eventosParticipaUsuario,
              ...resultados,
            ];
            this.currentIndexEventosParticipante++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasEventosParticipante = true; // No hay más comunidades por cargar
          }
          this.loadingParticipante = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loadingParticipante = false;
        }
      );
  }

  cargarMasResultadosFiltrados(): void {
    if (this.loadingFiltrados || this.noMasResultadosFiltrados) return;

    this.loadingFiltrados = true;
    const inicio = this.currentIndexFiltrados * this.cantidadPorPagina;
    const fin = inicio + this.cantidadPorPagina;

    const nuevosResultados = this.resultadosFiltrados.slice(inicio, fin);

    if (nuevosResultados.length > 0) {
      nuevosResultados.forEach(async (evento) => {
        evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
        const fechaUTC = new Date(evento.fechaHora);
        evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
        await this.getCreadorEvento(evento);
      });
      this.traerParticipantes(nuevosResultados); // Agregar datos adicionales como ubicación y miembros
      if (this.tabSeleccionada === 'disponibles') {
        this.eventosDisponiblesAMostrar = [
          ...this.eventosDisponiblesAMostrar,
          ...nuevosResultados
        ];
      } else if (this.tabSeleccionada === 'participante') {
        this.eventosParticipaUsuario = [
          ...this.eventosParticipaUsuario,
          ...nuevosResultados
        ];
      }
      this.currentIndexFiltrados++;
    } else {
      this.noMasResultadosFiltrados = true;
    }

    this.loadingFiltrados = false;
  }


  onScroll(): void {
    const element = document.querySelector('.grid') as HTMLElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
      if (this.hayResultadosFiltrados) {
        this.cargarMasResultadosFiltrados();
      } else {
        if (this.tabSeleccionada === 'disponibles') {
          this.cargarEventosDisponibles();
        } else if (this.tabSeleccionada === 'participante') {
          this.cargarEventosParticipante();
        }
      }
    }
  }

  irADetallesDelEvento(id: number): void {
    const idCifrado = this.idEncryptorService.encodeId(id);
    this.router.navigate(['/eventos', idCifrado]);

    //this.router.navigate(['/eventos', id]); // Navega a la ruta /eventos/:id
  }


  async aplicarTodosLosFiltros(): Promise<void> {
    let lista1: Evento[] = [];
    let lista2: Evento[] = [];
    let lista3: Evento[] = [];
    let lista4: Evento[] = [];
    this.hayResultadosFiltrados = false; // Inicializar en false

    if (this.filtroNombreActivo && this.nombreEventoFiltro) {
      lista1 = await this.aplicarFiltroNombre2();
      this.hayResultadosFiltrados = true; // Entró en el if
    }
    if (this.filtroParticipantesActivo && (this.minParticipantes !== null || this.maxParticipantes !== null)) {
      lista2 = await this.aplicarFiltroParticipantes2();
      this.hayResultadosFiltrados = true; // Entró en el if
    }
    if (this.filtroEtiquetasActivo && this.etiquetasSeleccionadas.length > 0) {
      lista3 = await this.aplicarFiltroEtiquetas2();
      this.hayResultadosFiltrados = true; // Entró en el if
    }
    if (this.filtroFechaActivo && this.fechaMinFiltro) {
      lista4 = await this.aplicarFiltroFecha();
      this.hayResultadosFiltrados = true;
    }
    this.eventosDisponiblesAMostrar = [];
    this.eventosParticipaUsuario = []
    if (this.hayResultadosFiltrados) {
      let listasActivas = [lista1, lista2, lista3, lista4].filter(lista => lista.length > 0);

      if (listasActivas.length > 0) {
        // Realizamos la intersección de las listas
        this.resultadosFiltrados = listasActivas.reduce((interseccion, listaActual) => {

          let aux = interseccion.filter(item =>
            listaActual.some(actualItem => actualItem.id === item.id)
          );
          return aux;
        });
        this.traerEtiquetas(this.resultadosFiltrados);
        this.resultadosFiltrados.forEach((evento) => {
          evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
          const fechaUTC = new Date(evento.fechaHora);
          evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);
        });

      } else {
        this.resultadosFiltrados = [];
      }
      this.currentIndexFiltrados = 0;
      this.noMasResultadosFiltrados = false;
      //await this.actualizarInformacionAdicional();
      this.cargarMasResultadosFiltrados(); // Cargar la primera página de resultados
    } else {
      this.currentIndexEventosDisponibles = 0;
      this.currentIndexEventosParticipante = 0;
      if (this.tabSeleccionada === 'disponibles') {
        this.cargarEventosDisponibles();
      } else if (this.tabSeleccionada === 'participante') {
        this.cargarEventosParticipante();
      }
    }
  }

  traerEtiquetas(eventos: Evento[]): void {
    for (let evento of eventos) {
      this.etiquetaService.obtenerEtiquetasDeEvento(evento.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && Array.isArray(dataPackage.data)) {
            evento.etiquetas = dataPackage.data;
          }
        },
        (error) => {
          console.error(`Error al traer las Etiquetas del evento ${evento.id}:`, error);
        }
      );
    }
  }

  esContenidoLargo(evento: { descripcion: string; ubicacion: string; etiquetas?: { nombre: string }[] }): boolean {
    const etiquetasTexto = evento.etiquetas?.map((e: { nombre: string }) => e.nombre).join(', ') || '';
    const texto = `${evento.descripcion} ${evento.ubicacion} ${etiquetasTexto}`;
    return texto.length > 150; // Ajusta este valor según lo necesario
  }

  onSearchInputComunidades(): void {
    clearTimeout(this.searchTimeout); // Limpia cualquier timeout previo
  
    this.searchTimeout = setTimeout(() => {
      this.filtroNombreActivo = true;
      this.aplicarTodosLosFiltros(); // Emite el texto ingresado
    }, 300); // Espera 300ms después del último input
  }
  
  async getCreadorEvento(evento: Evento): Promise<void> {
    return new Promise((resolve) => {
      this.usuarioService.usuarioCreadorEvento(evento.id).subscribe(dataPackage => {
        const creador = dataPackage.data as Usuario;
        this.mapaCreadorEventos.set(evento.id, creador); // Guardar en el mapa
        resolve();
      });
    });
  }

}

