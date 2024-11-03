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
  comunidades: Comunidad[] = []; // Arreglo para almacenar las comunidades que provienen del backend
  currentIndexComunidades: number = 0; // Índice actual del carrusel
  currentIndexMiembro: number = 0; // Índice actual del carrusel
  results: Comunidad[] = [];
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  comunidadesMiembroUsuario: Comunidad[] = [];

  filtroNombreAbierto: boolean = false;
  filtroNombreActivo: boolean = false;
  nombreEventoFiltro: string = '';

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
    this.miembroUsuario();
  }



  async getComunidades(): Promise<void> {
    this.comunidadService.disponibles().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.results = responseData;
        this.traerMiembros(this.results); // Llamar a traerMiembros después de cargar las comunidades
        // Recorrer todas las comunidades y asignar la ubicación
        for (const comunidad of this.results) {
          if (comunidad.latitud && comunidad.longitud) {
            comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          } else {
            comunidad.ubicacion = 'Ubicación desconocida';
          }
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
      this.comunidadService.miembrosEnComunidad(comunidad.id).subscribe(
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


  // Método para mover al siguiente grupo de comunidades en el carrusel
  siguienteComunidad(): void {
    this.currentIndexComunidades = (this.currentIndexComunidades + 1) % this.results.length; // Incrementa el índice
  }

  // Método para mover al grupo anterior de comunidades en el carrusel
  comunidadAnterior(): void {
    this.currentIndexComunidades = (this.currentIndexComunidades - 1 + this.results.length) % this.results.length; // Decrementa el índice
  }

  siguienteComunidadParticipa(): void {
    this.currentIndexMiembro = (this.currentIndexMiembro + 1) % this.comunidadesMiembroUsuario.length; // Incrementa el índice del segundo carrusel
  }
  
  comunidadAnteriorParticipa(): void {
    this.currentIndexMiembro = (this.currentIndexMiembro - 1 + this.comunidadesMiembroUsuario.length) % this.comunidadesMiembroUsuario.length; // Decrementa el índice del segundo carrusel
  }
  



// Método para obtener las comunidades a mostrar en el carrusel
obtenerComunidadesParaMostrar(): Comunidad[] {
  const comunidadesParaMostrar: Comunidad[] = [];
  
  if (this.results.length === 0) {
    return comunidadesParaMostrar; // Devuelve un arreglo vacío si no hay comunidades
  }
  
  // Definir cuántas comunidades mostrar, máximo 4 o el número total de comunidades disponibles
  const cantidadComunidadesAMostrar = Math.min(this.results.length, 4);
  
  for (let i = 0; i < cantidadComunidadesAMostrar; i++) {
    const index = (this.currentIndexComunidades + i) % this.results.length;
    const comunidad = this.results[index];
    
    // Excluir comunidades en las que el usuario ya es miembro
    if (!this.comunidadesMiembroUsuario.some(c => c.id === comunidad.id)) {
      comunidadesParaMostrar.push(comunidad);
    }
  
  }
  return comunidadesParaMostrar;
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
    if (this.minParticipantes !== null || this.maxParticipantes !== null) {
      this.comunidadService.filtrarParticipantes(this.minParticipantes || 0, this.maxParticipantes || Number.MAX_SAFE_INTEGER).subscribe(
        async (dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data;
            this.traerMiembros(this.results); // Llamar a traerMiembros después de cargar las comunidades
            for (const comunidad of this.results) {
              if (comunidad.latitud && comunidad.longitud) {
                comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
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
    }
  }

  aplicarFiltroNombre(): void {
    if (this.filtroNombreActivo) {
      this.results = this.results.filter(comunidad =>
        comunidad.nombre.toLowerCase().includes(this.nombreEventoFiltro.toLowerCase())
      );
    }
  }

  

  aplicarFiltrosActivados(): void {
    console.log("filtro nombre " +this  .nombreEventoFiltro);
    this.getComunidades(); 

    if (this.filtroNombreActivo) {
      this.aplicarFiltroNombre()
    }
    if (this.filtroParticipantesActivo) {
      this.aplicarFiltroParticipantes()
    }
    if (this.filtroEtiquetasActivo) {
      this.aplicarFiltroEtiquetas()
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
    this.getComunidades(); // Recargar todos los eventos
  }

  // Métodos para el filtro por participantes
  toggleFiltroParticipantes(): void {
    this.filtroParticipantesAbierto = !this.filtroParticipantesAbierto;
  }



  limpiarFiltroParticipantes(): void {
    this.minParticipantes = null;
    this.maxParticipantes = null;
    this.getComunidades(); // Recargar todos los eventos
  }



  limpiarFiltroFecha(): void {
    this.fechaMinFiltro = '';
    this.fechaMaxFiltro = '';
    this.getComunidades(); // Recargar todos los eventos
  }

  // Método para limpiar todos los filtros
  limpiarTodosLosFiltros(): void {
    this.limpiarFiltroNombre();
    this.limpiarFiltroParticipantes();
    this.limpiarFiltroFecha();
    this.limpiarFiltroEtiquetas();

  }



}