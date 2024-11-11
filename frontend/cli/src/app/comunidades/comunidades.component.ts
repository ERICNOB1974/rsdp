import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comunidad } from './comunidad';
import { ComunidadService } from './comunidad.service';
import { AuthService } from '../autenticacion/auth.service';
import { Etiqueta } from '../etiqueta/etiqueta';
import { catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-comunidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbTypeaheadModule],
  templateUrl: 'comunidades.component.html',
  styleUrls: ['comunidades.component.css', '../css/filtros.css'] // Ruta relativa correcta si está en la misma carpeta
})
export class ComunidadesComponent implements OnInit {
  currentIndexComunidades: number = 0; // Índice actual del carrusel
  currentIndexMiembro: number = 0; // Índice actual del carrusel
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  comunidadesMiembroUsuario: Comunidad[] = [];
  comunidadesMiembroUsuarioAMostrar: Comunidad[] = [];
  comunidades: Comunidad[] = []; // Arreglo para almacenar las comunidades que provienen del backend
  resultadosOriginales: Comunidad[] = []; // Nueva variable para mantener los datos originales
  results: Comunidad[] = [];
  comunidadesDisponiblesAMostrar: Comunidad[] = []; // Array que se muestra en pantalla (cargado de a poco)
  filtroNombreAbierto: boolean = false;
  filtroNombreActivo: boolean = true;
  nombreEventoFiltro: string = '';
  tabSeleccionada: string = 'disponibles';
  cantidadPorPagina = 3; // Cantidad de comunidades a mostrar por cada carga

  // Filtro por participantes
  filtroParticipantesAbierto: boolean = false;
  filtroParticipantesActivo: boolean = false;
  minParticipantes: number | null = null;
  maxParticipantes: number | null = null;


  fechaMinFiltro: string = '';
  fechaMaxFiltro: string = '';
  filtroEtiquetasAbierto: boolean = false;
  filtroEtiquetasActivo: boolean = false;
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;


  constructor(private comunidadService: ComunidadService,
    private authService: AuthService,  // Inyecta el AuthService
    private router: Router,
    private etiquetaService: EtiquetaService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getComunidades(); // Cargar las comunidades al inicializar el componente
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
 
      }


  async getComunidades(): Promise<void> {
    this.comunidadService.disponibles().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.resultadosOriginales = responseData; // Guardar los datos originales
        this.results = [...responseData]; // Hacer una copia para los resultados filtrados
        this.traerMiembros(this.results);
        for (const comunidad of this.results) {
          if (comunidad.latitud && comunidad.longitud) {
            comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          } else {
            comunidad.ubicacion = 'Ubicación desconocida';
          }
          await this.miembroUsuario();
          this.cargarComunidadesDisponibles();
          this.cargarComunidadesMiembroUsuario();
          this.cargarMasComunidades();
        }
      } else {
        console.log("No trae nada");
      }
    });
  }

  async miembroUsuario(): Promise<void> {
    this.comunidadService.miembroUsuario(this.idUsuarioAutenticado).subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.comunidadesMiembroUsuario = responseData;
        this.traerMiembros(this.comunidadesMiembroUsuario); // Llamar a traerParticipantes después de cargar los eventos
        for (const comunidad of this.comunidadesMiembroUsuario) {
          if (comunidad.latitud && comunidad.longitud) {
            comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          } else {
            comunidad.ubicacion = 'Ubicación desconocida';
          }
        }
      }
    });
  }



  traerMiembros(comunidades: Comunidad[]): void {
    for (let comunidad of comunidades) {
      this.comunidadService.cantidadMiembrosEnComunidad(comunidad.id).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            comunidad.miembros = dataPackage.data; // Asignar el número de miembros
          }
        },
        (error) => {
          console.error(`Error al traer los miembros de la comunidad ${comunidad.id}:`, error);
        }
      );
    }
  }









  irADetallesDeLaComunidad(id: number): void {
    this.router.navigate(['/comunidad-muro', id]); // Navega a la ruta /comunidades/:id
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

  async aplicarFiltroEtiquetas(): Promise<void> {
    if (this.etiquetasSeleccionadas.length > 0) {
      const etiquetasIds = this.etiquetasSeleccionadas.map(e => e.nombre);
      this.comunidadService.filtrarEtiqueta(etiquetasIds).subscribe(
        async (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = <Comunidad[]>dataPackage.data;
            this.traerMiembros(this.results); // Llamar a traerMiembros después de cargar las comunidades
            for (const comunidad of this.results) {
              if (comunidad.latitud && comunidad.longitud) {
                comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
              } else {
                comunidad.ubicacion = 'Ubicación desconocida';
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

  aplicarFiltroParticipantes(): void {
    if (this.filtroParticipantesActivo && (this.minParticipantes !== null || this.maxParticipantes !== null)) {
      this.comunidadService.filtrarParticipantes(
        this.minParticipantes || 0,
        this.maxParticipantes || Number.MAX_SAFE_INTEGER
      ).subscribe(
        async (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
            this.traerMiembros(this.results);
            for (const comunidad of this.results) {
              if (comunidad.latitud && comunidad.longitud) {
                comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(
                  comunidad.latitud,
                  comunidad.longitud
                );
              } else {
                comunidad.ubicacion = 'Ubicación desconocida';
              }
            }
          }
        },
        (error) => {
          console.error("Error al filtrar participantes:", error);
        }
      );
    } else if (!this.filtroParticipantesActivo) {
      this.results = [...this.resultadosOriginales];
    }
  }


  aplicarFiltroNombre(): void {
    if (this.filtroNombreActivo && this.nombreEventoFiltro) {
      this.results = this.resultadosOriginales.filter(comunidad =>
        comunidad.nombre.toLowerCase().includes(this.nombreEventoFiltro.toLowerCase())
      );
    } else {
      this.results = [...this.resultadosOriginales]; // Restaurar todos los resultados si el filtro está desactivado
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
    this.getComunidades(); // Recargar todos los eventos
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


  limpiarFiltroNombre(): void {
    this.nombreEventoFiltro = '';
    this.filtroNombreActivo = false;
    this.results = [...this.resultadosOriginales];
  }

  // Métodos para el filtro por participantes
  toggleFiltroParticipantes(): void {
    this.filtroParticipantesAbierto = !this.filtroParticipantesAbierto;
  }



  limpiarFiltroParticipantes(): void {
    this.minParticipantes = null;
    this.maxParticipantes = null;
    this.filtroParticipantesActivo = false;
    this.results = [...this.resultadosOriginales];
  }


  limpiarFiltroFecha(): void {
    this.fechaMinFiltro = '';
    this.fechaMaxFiltro = '';
    this.getComunidades(); // Recargar todos los eventos
  }
  limpiarTodosLosFiltros(): void {
    this.limpiarFiltroNombre();
    this.limpiarFiltroParticipantes();
    this.limpiarFiltroFecha();
    this.limpiarFiltroEtiquetas();

    // Reiniciar los filtros
    this.filtroNombreActivo = false;
    this.filtroParticipantesActivo = false;
    this.filtroEtiquetasActivo = false;

    // Restaurar todos los resultados
    this.results = [...this.resultadosOriginales];
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

      resultadosFiltrados = resultadosFiltrados.filter(comunidad =>
        comunidad.miembros >= min && comunidad.miembros <= max
      );
    }

    // Aplicar filtro por etiquetas si hay etiquetas seleccionadas
    if (this.filtroEtiquetasActivo && this.etiquetasSeleccionadas.length > 0) {
      const etiquetasIds = this.etiquetasSeleccionadas.map(e => e.nombre);

      try {
        const response = await this.comunidadService.filtrarEtiqueta(etiquetasIds).toPromise();
        if (response && response.data && Array.isArray(response.data)) {
          const comunidadesFiltradas = response.data as Comunidad[];
          resultadosFiltrados = resultadosFiltrados.filter(comunidad =>
            comunidadesFiltradas.some(c => c.id === comunidad.id)
          );
        }
      } catch (error) {
        console.error("Error al filtrar por etiquetas:", error);
      }
    }

    // Actualizar los resultados filtrados
    this.results = resultadosFiltrados;

    // Actualizar información adicional para los resultados filtrados
    await this.actualizarInformacionAdicional();
  }

  private async actualizarInformacionAdicional(): Promise<void> {
    this.traerMiembros(this.results);

    for (const comunidad of this.results) {
      if (comunidad.latitud && comunidad.longitud) {
        try {
          comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(
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

  seleccionarTab(tab: string) {
    this.tabSeleccionada = tab;
  }



  cargarComunidadesDisponibles() {
    // Suponiendo que 'comunidadesDisponibles' contiene todas las comunidades
    this.comunidadesDisponiblesAMostrar = this.results.slice(0, this.cantidadPorPagina);
  }

  cargarComunidadesMiembroUsuario() {
    this.comunidadesMiembroUsuarioAMostrar = this.comunidadesMiembroUsuario.slice(0, this.cantidadPorPagina);
  }
  
  cargarMasComunidades(): void {
    const startIndex = this.comunidadesDisponiblesAMostrar.length;
    const moreComunidades = this.results.slice(startIndex, startIndex + this.cantidadPorPagina);
    this.comunidadesDisponiblesAMostrar = [...this.comunidadesDisponiblesAMostrar, ...moreComunidades];
  }

  onScroll(): void {
    const container = document.querySelector('.grid-container') as HTMLElement;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
      this.cargarMasComunidades();
    }
  }
}