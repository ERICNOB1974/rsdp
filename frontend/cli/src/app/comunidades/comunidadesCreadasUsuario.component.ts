import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Comunidad } from './comunidad'; // Asegúrate de tener un modelo Comunidad
import { ComunidadService } from './comunidad.service'; // Crea este servicio
import { AuthService } from '../autenticacion/auth.service';
import { EtiquetaService } from '../etiqueta/etiqueta.service';

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

  constructor(
    private comunidadService: ComunidadService,
    private etiquetaService: EtiquetaService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    console.info("pepepepepe");
    this.getComunidadesUsuario(); // Cargar las comunidades creadas por el usuario al inicializar el componente
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
            console.info(this.comunidadesUsuario);
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

  irACrearComunidad(): void {
    this.router.navigate(['/comunidades/crearComunidad']);
  }

}
