import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comunidad } from './comunidad';
import { ComunidadService } from './comunidad.service';
import { AuthService } from '../autenticacion/auth.service';
import { Etiqueta } from '../etiqueta/etiqueta';
import { catchError, debounceTime, distinctUntilChanged, filter, lastValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
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
  comunidadesMiembroUsuarioAMostrar: Comunidad[] = [];
  resultadosFiltrados: Comunidad[] = []; // Nueva variable para mantener los datos originales
  comunidadesDisponiblesAMostrar: Comunidad[] = []; // Array que se muestra en pantalla (cargado de a poco)
  filtroNombreAbierto: boolean = false;
  filtroNombreActivo: boolean = false;
  nombreEventoFiltro: string = '';
  tabSeleccionada: string = 'disponibles';
  cantidadPorPagina = 4; // Cantidad de comunidades a mostrar por cada carga
  currentIndexComunidadesDisponibles = 0;
  currentIndexComunidadesMiembro = 0;
  noMasComunidadesDisponibles = false;
  noMasComunidadesMiembro = false;
  loadingDisponibles = false;
  loadingMiembro = false;
  resultadosFiltradosPaginados: Comunidad[] = [];
  currentIndexFiltrados: number = 0;
  noMasResultadosFiltrados: boolean = false;
  loadingFiltrados: boolean = false;
  hayResultadosFiltrados: boolean = false;
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
  filtersVisible: boolean = false;
  filtersAnimating: boolean = false;

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

  async aplicarFiltroEtiquetas2(): Promise<Comunidad[]> {
    try {
      const etiquetasIds = this.etiquetasSeleccionadas.map(e => e.nombre);
      const dataPackage = await lastValueFrom(this.comunidadService.filtrarEtiqueta(etiquetasIds,this.tabSeleccionada,this.idUsuarioAutenticado));
      if (Array.isArray(dataPackage.data)) {
        return dataPackage.data;
      }
      return []; // Devuelve lista vacía si no es un array válido
    } catch (error) {
      console.error("Error al filtrar etiquetas:", error);
      return []; // Manejo de errores devolviendo una lista vacía
    }
  }
  
  async aplicarFiltroParticipantes2(): Promise<Comunidad[]> {
    try {
      const dataPackage = await lastValueFrom(
        this.comunidadService.filtrarParticipantes( this.tabSeleccionada,this.idUsuarioAutenticado,
          this.minParticipantes || 0,
          this.maxParticipantes || Number.MAX_SAFE_INTEGER
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

  async aplicarFiltroNombre2(): Promise<Comunidad[]> {
    try {
      const dataPackage = await lastValueFrom(
        this.comunidadService.filtrarNombre(this.nombreEventoFiltro, this.tabSeleccionada,this.idUsuarioAutenticado)
      );
      return dataPackage.data as Comunidad[];
    } catch (error) {
      console.error('Error al filtrar comunidades por nombre:', error);
      return []; // Devuelve una lista vacía en caso de error
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


  limpiarFiltroNombre(): void {
    this.nombreEventoFiltro = '';
    this.filtroNombreActivo = false;
    this.aplicarTodosLosFiltros();
  }

  // Métodos para el filtro por participantes
  toggleFiltroParticipantes(): void {
    this.filtroParticipantesAbierto = !this.filtroParticipantesAbierto;
  }



  limpiarFiltroParticipantes(): void {
    this.minParticipantes = null;
    this.maxParticipantes = null;
    this.filtroParticipantesActivo = false;
    this.aplicarTodosLosFiltros();
  }


  limpiarFiltroFecha(): void {
    this.fechaMinFiltro = '';
    this.fechaMaxFiltro = '';
    this.aplicarTodosLosFiltros();
  }

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
    this.currentIndexComunidadesDisponibles = 0;
    this.currentIndexComunidadesMiembro=0;

  }


  async aplicarTodosLosFiltros(): Promise<void> {
    let lista1: Comunidad[] = [];
    let lista2: Comunidad[] = [];
    let lista3: Comunidad[] = [];
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
    this.comunidadesDisponiblesAMostrar=[];
    this.comunidadesMiembroUsuarioAMostrar=[]
    if(this.hayResultadosFiltrados){
      
      
      let listasActivas = [lista1, lista2, lista3].filter(lista => lista.length > 0);

      if (listasActivas.length > 0) {
        // Realizamos la intersección de las listas
        this.resultadosFiltrados = listasActivas.reduce((interseccion, listaActual) => {
        return interseccion.filter(item => 
          listaActual.some(actualItem => actualItem.id === item.id)
        );
      });
    } else {
      this.resultadosFiltrados = [];
    }
    this.currentIndexFiltrados = 0;
    this.noMasResultadosFiltrados = false;
    //await this.actualizarInformacionAdicional();
    this.cargarMasResultadosFiltrados(); // Cargar la primera página de resultados
  }else{
    this.currentIndexComunidadesDisponibles=0;
    this.currentIndexComunidadesMiembro=0;
    if (this.tabSeleccionada === 'disponibles') {
      this.cargarComunidadesDisponibles();
    } else if (this.tabSeleccionada === 'miembro') {
      this.cargarComunidadesMiembro();
    }
  }
}

cargarMasResultadosFiltrados(): void {
  if (this.loadingFiltrados || this.noMasResultadosFiltrados) return;

  this.loadingFiltrados = true;
  const inicio = this.currentIndexFiltrados * this.cantidadPorPagina;
  const fin = inicio + this.cantidadPorPagina;

  const nuevosResultados = this.resultadosFiltrados.slice(inicio, fin);

  if (nuevosResultados.length > 0) {
    this.traerMiembros(nuevosResultados); // Agregar datos adicionales como ubicación y miembros
    if (this.tabSeleccionada === 'disponibles') {
      this.comunidadesDisponiblesAMostrar = [
        ...this.comunidadesDisponiblesAMostrar,
        ...nuevosResultados
      ];
    } else if (this.tabSeleccionada === 'miembro') {
      this.comunidadesMiembroUsuarioAMostrar = [
        ...this.comunidadesMiembroUsuarioAMostrar,
        ...nuevosResultados
      ];
    }
    this.currentIndexFiltrados++;
  } else {
    this.noMasResultadosFiltrados = true;
  }

  this.loadingFiltrados = false;
}

  private async actualizarInformacionAdicional(): Promise<void> {
    this.traerMiembros(this.resultadosFiltrados);

    // for (const comunidad of this.resultadosFiltrados) {
    //   if (comunidad.latitud && comunidad.longitud) {
    //     try {
    //       comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(
    //         comunidad.latitud,
    //         comunidad.longitud
    //       );
    //     } catch (error) {
    //       comunidad.ubicacion = 'Ubicación desconocida';
    //     }
    //   } else {
    //     comunidad.ubicacion = 'Ubicación desconocida';
    //   }
    // }
  }


  seleccionarTab(tab: string) {
    if (this.tabSeleccionada !== tab) {
      this.tabSeleccionada = tab;
      this.filtroParticipantesActivo = false;
      this.filtroEtiquetasActivo = false;
      this.filtroNombreActivo =false
      if(this.tabSeleccionada==='disponibles'){
        this.loadingDisponibles=false;
        this.cargarComunidadesDisponibles();
      }else if (this.tabSeleccionada==='miembro'){
        this.loadingMiembro=false;

        this.cargarComunidadesMiembro();
      } else if (this.tabSeleccionada === 'filtros') {
        
      }
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

            // for (const evento of resultados) {
            //   evento.ubicacion = evento.latitud && evento.longitud
            //     ? await this.comunidadService.obtenerUbicacion(evento.latitud, evento.longitud)
            //     : 'Ubicación desconocida';
            // }

            this.comunidadesDisponiblesAMostrar = [...this.comunidadesDisponiblesAMostrar, ...resultados,];
            this.currentIndexComunidadesDisponibles++; // Aumentar el índice para la siguiente carga

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
      .miembroUsuario(this.idUsuarioAutenticado,"", this.currentIndexComunidadesMiembro, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Comunidad[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerMiembros(resultados); // Llamar a traerParticipantes después de cargar los eventos

            // for (const evento of resultados) {
            //   evento.ubicacion = evento.latitud && evento.longitud
            //     ? await this.comunidadService.obtenerUbicacion(evento.latitud, evento.longitud)
            //     : 'Ubicación desconocida';
            // }
            console.info("muestro",this.comunidadesMiembroUsuarioAMostrar);
            console.info("traigo",resultados);
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
    const element = document.querySelector('.grid') as HTMLElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight-1) {
      if(this.hayResultadosFiltrados){
        this.cargarMasResultadosFiltrados();
      }else{
        if (this.tabSeleccionada === 'disponibles') {
          this.cargarComunidadesDisponibles();
        } else if (this.tabSeleccionada === 'miembro') {
          this.cargarComunidadesMiembro();
        }
      }
    }
  }

}