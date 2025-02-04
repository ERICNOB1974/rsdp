import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Comunidad } from './comunidad'; // Asegúrate de tener un modelo Comunidad
import { ComunidadService } from './comunidad.service'; // Crea este servicio
import { AuthService } from '../autenticacion/auth.service';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-comunidades-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: 'comunidadesCreadasUsuario.component.html',
  styleUrls: ['comunidadesCreadasUsuarioOrne.css', '../css/noCreados.css']
})
export class ComunidadesCreadasUsuarioComponent implements OnInit {
  comunidadesUsuario: Comunidad[] = []; // Arreglo para almacenar las comunidades creadas por el usuario
  offset: number = 0; // Inicializar el offset
  limit: number = 8; // Número de comunidades a cargar por solicitud
  loading: boolean = false; // Para manejar el estado de carga
  noMasComunidades = false;
  currentIndexComunidades: number = 0; // Índice actual de la página
  loadingRutinas: boolean = false; // Indicador de carga
  noMasRutinas: boolean = false; // Indicador de fin de publicaciones
  isSearching: boolean = false;  // Variable para indicar si estamos buscando
  searchSubjectComunidades: Subject<string> = new Subject<string>();
  searchText: string = ""

  constructor(
    private comunidadService: ComunidadService,
    private etiquetaService: EtiquetaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.getComunidadesUsuario();
    this.searchSubjectComunidades
    .pipe(debounceTime(500)) // Espera 0,5 segundo
    .subscribe((nombre: string) => {
      this.buscarComunidades(nombre); // Cargar las comunidades creadas por el usuario al inicializar el componente
    });
  }


  buscarComunidades(nombre: string): void {
    if (nombre != "") {
      this.isSearching = true; // Indicamos que estamos buscando
      this.currentIndexComunidades = 0;  // Reiniciamos la paginación al buscar
      this.noMasComunidades = false;  // Permitimos que se carguen más resultados
      this.comunidadesUsuario = [];  // Limpiamos los resultados previos
      this.cargarComunidadesFiltradas(nombre); // Llamamos al método que carga las rutinas filtradas
    } else {
      this.isSearching = false;  // Si no hay filtro, indicamos que no estamos buscando
      this.currentIndexComunidades = 0;  // Reiniciamos la paginación
      this.noMasComunidades = false;  // Permitimos cargar más resultados
      this.comunidadesUsuario = [];  // Limpiamos los resultados previos
      this.getComunidadesUsuario(); // Llamamos al método que carga todas las rutinas
    }
  }


  getComunidadesUsuario(): void {
    if (this.loading || this.noMasComunidades) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más

    this.loading = true;

    // Suponiendo que tienes un método que obtiene más comunidades con paginación
    this.comunidadService
      .comunidadesCreadasPorUsuario(this.offset, this.limit)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Comunidad[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerMiembros(resultados); // Llamar a traerParticipantes después de cargar los eventos
            this.traerEtiquetas(resultados);
            
            this.comunidadesUsuario = [
              ...this.comunidadesUsuario,
              ...resultados,
            ];
            this.offset += this.limit;
          } else {
            this.noMasComunidades = true; // No hay más comunidades por cargar
          }
          this.loading = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loading = false;
        }
      );
  }

  cargarComunidadesFiltradas(nombre: string): void {
   
    if (this.loading || this.noMasComunidades) return;  // Si ya estamos cargando o no hay más resultados, no hacemos nada

    this.loading = true;


    this.comunidadService
      .comunidadesCreadasPorUsuarioFiltradas(nombre, this.currentIndexComunidades,this.limit)
      .subscribe(
        async (dataPackage) => {
          const resultados = dataPackage.data as Comunidad[]
          if (resultados && resultados.length > 0) {
            // Agregar las comunidades obtenidas a la lista que se muestra
            this.traerMiembros(resultados); // Llamar a traerParticipantes después de cargar los eventos
            this.traerEtiquetas(resultados);
            
            this.comunidadesUsuario = [
              ...this.comunidadesUsuario,
              ...resultados,
            ];
            this.currentIndexComunidades++;  // Incrementamos el índice para la siguiente carga
            if (resultados.length < this.limit) {
              this.noMasComunidades = true;
            }
          } else {
            this.noMasComunidades = true; // No hay más comunidades por cargar
          }
          this.loading = false; // Desactivar el indicador de carga
        },
        (error) => {
          console.error('Error al cargar más comunidades:', error);
          this.loading = false;
        }
      );
  }



  
  traerMiembros(comunidades: Comunidad[]): void {
    for (let comunidad of comunidades) {
      this.comunidadService.cantidadMiembrosEnComunidad(comunidad.id).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            comunidad.miembros = dataPackage.data; // Asignar el número de miembros
            console.info("AOPSDAOPDSAPODPO"+ comunidad.miembros);
          }
        },
        (error) => {
          console.error(`Error al traer los miembros de la comunidad ${comunidad.id}:`, error);
        }
      );
    }
  }


  irADetallesDeComunidad(id: number): void {
    this.router.navigate(['/comunidad-muro', id]);
  }

  onScroll(): void {
    const element = document.querySelector('.comunidades-list') as HTMLElement;
    if (element.scrollTop + element.clientHeight >= element.scrollHeight-10 && !this.loading) {
      this.getComunidadesUsuario();
    }
  }

  traerEtiquetas(comunidades: Comunidad[]): void {
    for (let comunidad of comunidades) {
      this.etiquetaService.etiquetasEnComunidad(comunidad.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && Array.isArray(dataPackage.data)) {
            comunidad.etiquetas = dataPackage.data; // Asignar el número de días
          }
        },
        (error) => {
          console.error(`Error al traer las Etiquetas de la comunidad ${comunidad.id}:`, error);
        }
      );
    }
  }

  onSearchInputComunidades(nombre: string): void {
    this.searchSubjectComunidades.next(nombre); // Emite el texto ingresado
  }
  irACrearComunidad(): void {
    this.router.navigate(['/comunidades/crearComunidad']);
  }

}
