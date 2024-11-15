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
  cantidadPorPagina = 4; // Cantidad de comunidades a mostrar por cada carga
  currentIndexComunidadesDisponibles = 0;
  currentIndexComunidadesMiembro = 0;
  noMasComunidadesDisponibles = false;
  noMasComunidadesMiembro = false;
  loadingDisponibles = false;
  loadingMiembro = false;
  
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
    this.cargarComunidadesDisponibles(); // Cargar las primeras comunidades al iniciar
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.cargarComunidadesMiembro();

  }



  /*   async getComunidades(): Promise<void> {
      try {
        // Espera a que se carguen los eventos disponibles
        const dataPackage = await this.comunidadService.disponibles().toPromise();
        
        // Verificamos que dataPackage y su propiedad 'data' no sean undefined
        if (dataPackage && dataPackage.data) {
          this.results = dataPackage.data as Comunidad[];
    
          if (Array.isArray(this.results)) {
            this.traerMiembros(this.results); // Llamar a traerParticipantes después de cargar los eventos
            for (const evento of this.results) {
              evento.ubicacion = evento.latitud && evento.longitud 
                ? await this.comunidadService.obtenerUbicacion(evento.latitud, evento.longitud)
                : 'Ubicación desconocida';
            }
    
            await this.miembroUsuario();
            this.cargarComunidadesDisponibles();
            this.cargarComunidadesMiembroUsuario();
          }
        } else {
          console.error("dataPackage no contiene la propiedad 'data' o es undefined");
        }
      } catch (error) {
        console.error("Error al cargar eventos:", error);
      }
    } */


/*   async miembroUsuario(): Promise<void> {
    try {
      // Espera a que se obtenga la lista de eventos en los que participa el usuario
      const dataPackage = await this.comunidadService.miembroUsuario(this.idUsuarioAutenticado).toPromise();

      // Verificamos que dataPackage y su propiedad 'data' no sean undefined
      if (dataPackage && dataPackage.data) {
        const responseData = dataPackage.data;

        if (Array.isArray(responseData)) {
          this.comunidadesMiembroUsuario = responseData;
          this.traerMiembros(this.comunidadesMiembroUsuario);  // Cargar participantes
          for (const evento of this.comunidadesMiembroUsuario) {
            evento.ubicacion = evento.latitud && evento.longitud
              ? await this.comunidadService.obtenerUbicacion(evento.latitud, evento.longitud)
              : 'Ubicación desconocida';
          }
        }
      } else {
        console.error("dataPackage no contiene la propiedad 'data' o es undefined");
      }
    } catch (error) {
      console.error("Error al cargar comunidades de membrecia del usuario:", error);
    }
  }
 */

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
    //this.getComunidades(); // Recargar todos los eventos
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
    //  this.getComunidades(); // Recargar todos los eventos
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
    if (this.tabSeleccionada !== tab) {
      this.tabSeleccionada = tab;
    }
  }



  // Método para cargar más comunidades disponibles
  cargarComunidadesDisponibles(): void {
    if (this.loadingDisponibles || this.noMasComunidadesDisponibles) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loadingDisponibles = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.comunidadService
      .disponibles(this.currentIndexComunidadesDisponibles, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Comunidad[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerMiembros(resultados); // Llamar a traerParticipantes después de cargar los eventos
            
            for (const evento of resultados) {
              evento.ubicacion = evento.latitud && evento.longitud 
              ? await this.comunidadService.obtenerUbicacion(evento.latitud, evento.longitud)
              : 'Ubicación desconocida';
            }
            this.comunidadesDisponiblesAMostrar = [
              ...this.comunidadesDisponiblesAMostrar,
              ...resultados,
            ];
            this.currentIndexComunidadesDisponibles++; // Aumentar el índice para la siguiente carga
            console.info("llegue");

          } else {
            this.noMasComunidadesDisponibles = true; // No hay más comunidades por cargar
          }
          this.loadingDisponibles = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loadingDisponibles = false;
        }
      );
  }

  cargarComunidadesMiembro(): void {
    if (this.loadingMiembro || this.noMasComunidadesMiembro) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loadingMiembro = true;
    
    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.comunidadService
    .miembroUsuario(this.idUsuarioAutenticado,this.currentIndexComunidadesMiembro, this.cantidadPorPagina)
    .subscribe(
      async (dataPackage) => {
        const resultados = dataPackage.data as Comunidad[]
        console.info("HOLAA");
          console.info(resultados);
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerMiembros(resultados); // Llamar a traerParticipantes después de cargar los eventos
            
            for (const evento of resultados) {
              evento.ubicacion = evento.latitud && evento.longitud 
              ? await this.comunidadService.obtenerUbicacion(evento.latitud, evento.longitud)
              : 'Ubicación desconocida';
            }
            this.comunidadesMiembroUsuarioAMostrar = [
              ...this.comunidadesMiembroUsuarioAMostrar,
              ...resultados,
            ];
            this.currentIndexComunidadesMiembro++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasComunidadesMiembro = true; // No hay más comunidades por cargar
          }
          this.loadingMiembro = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loadingMiembro = false;
        }
      );
  }



  onScroll(): void {
    const element = document.querySelector('.grid-container') as HTMLElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
      if (this.tabSeleccionada === 'disponibles') {
        this.cargarComunidadesDisponibles();
      } else if (this.tabSeleccionada === 'miembro') {
        this.cargarComunidadesMiembro();
      }
    }
  }

}