import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Rutina } from './rutina';
import { RutinaService } from './rutina.service';
import { AuthService } from '../autenticacion/auth.service';
import { Etiqueta } from '../etiqueta/etiqueta';
import { catchError, debounceTime, distinctUntilChanged, filter, lastValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-rutinas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbTypeaheadModule],
  templateUrl: 'rutinas.component.html',
  styleUrls: ['rutinas.component.css', '../css/filtros.css']
})
export class RutinasComponent implements OnInit {
  rutinasDisponibles: Rutina[] = []; // Arreglo para almacenar las rutinas que provienen del backend
  currentIndex: number = 0; // Índice actual del carrusel
  results: Rutina[] = [];
  rutinasRealizaUsuario: Rutina[] = []; // Rutinas en las que el usuario está inscrito
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  diasRutina: number[] = []; // Arreglo para almacenar los días de cada rutina
  resultadosOriginales: Rutina[] = []; // Nueva variable para mantener los datos originales
  tabSeleccionada: string = 'disponibles';
  cantidadPorPagina = 4; // Cantidad de comunidades a mostrar por cada carga
  currentIndexRutinasDisponibles = 0;
  currentIndexRutinasMiembro = 0;
  noMasRutinasDisponibles = false;
  noMasRutinasRealiza = false;
  loadingDisponibles = false;
  loadingRealiza = false;
  filtroNombreAbierto: boolean = false;
  nombreEventoFiltro: string = '';
  hayResultadosFiltrados: boolean = false;
  resultadosFiltradosPaginados: Rutina[] = [];
  currentIndexFiltrados: number = 0;
  noMasResultadosFiltrados: boolean = false;
  loadingFiltrados: boolean = false;
  resultadosFiltrados: Rutina[] = []; // Nueva variable para mantener los datos originales

  // Filtro por participantes
  filtroParticipantesAbierto: boolean = false;
  filtroEtiquetasActivo: boolean = false;
  filtroNombreActivo: boolean = false;

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

  constructor(private rutinaService: RutinaService,
    private authService: AuthService,
    private etiquetaService: EtiquetaService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargarRutinasDisponibles();
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    // this.getRutinasUsuario(); // Cargar las rutinas del usuario
    this.cargarRutinasRealizaUsuario();
  }


  traerDias(rutinas: Rutina[]): void {
    for (let rutina of rutinas) {
      this.rutinaService.obtenerDiasEnRutina(rutina.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            rutina.dias = dataPackage.data; // Asignar el número de días
          }
        },
        (error) => {
          console.error(`Error al traer los días de la rutina ${rutina.id}:`, error);
        }
      );
    }
  }

  traerEtiquetas(rutinas: Rutina[]): void {
    for (let rutina of rutinas) {
      this.rutinaService.obtenerEtiquetasDeRutina(rutina.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && Array.isArray(dataPackage.data)) {
            rutina.etiquetas = dataPackage.data; // Asignar el número de días
          }
        },
        (error) => {
          console.error(`Error al traer las Etiqeutas días de la rutina ${rutina.id}:`, error);
        }
      );
    }
  }

  irADetallesDeLaRutina(rutinaId: number | undefined) {
    const id = rutinaId ?? 0; // Valor predeterminado si es undefined
    this.router.navigate(['/rutinas', id]); // Navega a la ruta /rutinas/:id
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

  async aplicarFiltroEtiquetas2(): Promise<Rutina[]> {
    try {
      const etiquetasIds = this.etiquetasSeleccionadas.map(e => e.nombre);
      const dataPackage = await lastValueFrom(this.rutinaService.filtrarEtiqueta(etiquetasIds,this.tabSeleccionada,this.idUsuarioAutenticado));
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

  async aplicarFiltroNombre2(): Promise<Rutina[]> {
    try {
      const dataPackage = await lastValueFrom(
        this.rutinaService.filtrarNombre(this.nombreEventoFiltro, this.tabSeleccionada,this.idUsuarioAutenticado)
      );
      return dataPackage.data as Rutina[];
    } catch (error) {
      console.error('Error al filtrar rutinas por nombre:', error);
      return []; // Devuelve una lista vacía en caso de error
    }
  }

  limpiarFiltroNombre(): void {
    this.nombreEventoFiltro = '';
    this.filtroNombreActivo = false;
    this.aplicarTodosLosFiltros();
  }
  limpiarTodosLosFiltros(): void {
    this.nombreEventoFiltro = '';
    this.filtroNombreActivo = false;
    this.etiquetasSeleccionadas = [];
    this.filtroEtiquetasActivo = false;

    // Restaurar todos los resultados
    this.currentIndexRutinasDisponibles = 0;
    this.currentIndexRutinasMiembro=0;
  }



  async aplicarTodosLosFiltros(): Promise<void> {
    let lista1: Rutina[] = [];
    let lista2: Rutina[] = [];
    this.hayResultadosFiltrados = false; // Inicializar en false

    if (this.filtroNombreActivo && this.nombreEventoFiltro) {
        lista1 = await this.aplicarFiltroNombre2();
        this.hayResultadosFiltrados = true; // Entró en el if
      }

    if (this.filtroEtiquetasActivo && this.etiquetasSeleccionadas.length > 0) {
      lista2 = await this.aplicarFiltroEtiquetas2();
      this.hayResultadosFiltrados = true; // Entró en el if
    }
    this.rutinasDisponibles=[];
    this.rutinasRealizaUsuario=[]
    if(this.hayResultadosFiltrados){
      
      
      let listasActivas = [lista1, lista2].filter(lista => lista.length > 0);

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
    this.currentIndexRutinasDisponibles=0;
    this.currentIndexRutinasMiembro=0;
    if (this.tabSeleccionada === 'disponibles') {
      this.cargarRutinasDisponibles();
    } else if (this.tabSeleccionada === 'realizaRutina') {
      this.cargarRutinasRealizaUsuario();
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
      this.traerDias(nuevosResultados); // Agregar datos adicionales como ubicación y miembros
      this.traerEtiquetas(nuevosResultados);
      if (this.tabSeleccionada === 'disponibles') {
        this.rutinasDisponibles = [
          ...this.rutinasDisponibles,
          ...nuevosResultados
        ];
      } else if (this.tabSeleccionada === 'realizaRutina') {
        this.rutinasRealizaUsuario = [
          ...this.rutinasRealizaUsuario,
          ...nuevosResultados
        ];
      }
      this.currentIndexFiltrados++;
    } else {
      this.noMasResultadosFiltrados = true;
    }
  
    this.loadingFiltrados = false;
  }

  seleccionarTab(tab: string) {
    if (this.tabSeleccionada !== tab) {
      this.tabSeleccionada = tab;
      this.filtroEtiquetasActivo = false;
      this.filtroNombreActivo = false
      if (this.tabSeleccionada === 'disponibles') {
        this.loadingDisponibles = false;
        //this.cargarRutinasDisponibles();
      } else if (this.tabSeleccionada === 'realizaRutina') {
        this.loadingRealiza = false;
        //this.cargarRutinasRealizaUsuario();
      }
    }
  }

  // Método para cargar más comunidades disponibles
  cargarRutinasDisponibles(): void {
    if (this.loadingDisponibles || this.noMasRutinasDisponibles) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
    this.loadingDisponibles = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.rutinaService
      .disponibles(this.currentIndexRutinasDisponibles, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Rutina[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerDias(resultados); // Llamar a traerDias para las rutinas del usuario
            this.traerEtiquetas(resultados); // Llamar a traerEtiquetas después de cargar las rutinas

            this.rutinasDisponibles = [...this.rutinasDisponibles, ...resultados,];
            this.currentIndexRutinasDisponibles++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasRutinasDisponibles = true; // No hay más comunidades por cargar
          }
          this.loadingDisponibles = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loadingDisponibles = false;
        }
      );
  }

  cargarRutinasRealizaUsuario(): void {
    if (this.loadingRealiza || this.noMasRutinasRealiza) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loadingRealiza = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.rutinaService
      .rutinasRealizaUsuario(this.idUsuarioAutenticado, "", this.currentIndexRutinasMiembro, this.cantidadPorPagina)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Rutina[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerDias(resultados); // Llamar a traerDias para las rutinas del usuario
            this.traerEtiquetas(resultados); // Llamar a traerEtiquetas después de cargar las rutinas


            this.rutinasRealizaUsuario = [
              ...this.rutinasRealizaUsuario,
              ...resultados,
            ];
            this.currentIndexRutinasMiembro++; // Aumentar el índice para la siguiente carga

          } else {
            this.noMasRutinasRealiza = true; // No hay más comunidades por cargar
          }
          this.loadingRealiza = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loadingRealiza = false;
        }
      );

  }



  onScroll(): void {
    const element = document.querySelector('.content-container') as HTMLElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight) {
      if (this.hayResultadosFiltrados) {
        this.cargarMasResultadosFiltrados();
      } else {
        if (this.tabSeleccionada === 'disponibles') {
          this.cargarRutinasDisponibles();
        } else if (this.tabSeleccionada === 'realizaRutina') {
          this.cargarRutinasRealizaUsuario();
        }
      }
    }
  }

}