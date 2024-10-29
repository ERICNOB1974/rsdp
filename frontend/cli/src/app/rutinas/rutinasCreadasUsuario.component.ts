import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../autenticacion/auth.service';
import { Rutina } from './rutina';
import { ComunidadService } from '../comunidades/comunidad.service';
import { RutinaService } from './rutina.service';

@Component({
  selector: 'app-comunidades-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: 'rutinasCreadasUsuario.component.html',
  styleUrls: ['rutinasCreadasUsuario.component.css']
})
export class RutinasCreadasUsuarioComponent implements OnInit, OnDestroy {
  rutinasUsuario: Rutina[] = []; // Arreglo para almacenar las comunidades creadas por el usuario
  offset: number = 0; // Inicializar el offset
  limit: number = 10; // Número de comunidades a cargar por solicitud
  loading: boolean = false; // Para manejar el estado de carga

  constructor(
    private rutinaService: RutinaService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getRutinasUsuario(); // Cargar las comunidades creadas por el usuario al inicializar el componente
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  private getRutinasUsuario(): void {
    if (this.loading) return; // Evitar cargar si ya se está cargando
    this.loading = true; // Establecer estado de carga
    this.rutinaService.rutinasCreadasPorUsuario(this.offset, this.limit).subscribe(
      (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.rutinasUsuario.push(...responseData); // Agregar comunidades a la lista existente
          this.traerDias(this.rutinasUsuario); // Llamar a traerDias después de cargar las rutinas
          this.traerEtiquetas(this.rutinasUsuario);
          this.offset += this.limit; // Aumentar el offset
        }
        this.loading = false; // Restablecer estado de carga
      },
      (error) => {
        console.error("Error al cargar las comunidades del usuario:", error);
        this.loading = false; // Restablecer estado de carga en caso de error
      }
    );
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

  traerDias(rutinas: Rutina[]): void {
    for (let rutina of rutinas) {
      console.info(rutina);
      this.rutinaService.obtenerDiasEnRutina(rutina.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            rutina.dias = dataPackage.data; // Asigna el número de días
          }
        },
        (error) => {
          console.error(`Error al traer los días de la rutina ${rutina.id}:`, error);
        }
      );
    }
  }
  

  irADetallesDeComunidad(id: number): void {
    this.router.navigate(['/rutinas', id]); // Navega a la ruta /comunidades/:id
  }

  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.loading) {
      this.getRutinasUsuario(); // Cargar más comunidades al llegar al final de la página
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this)); // Limpiar el listener
  }
}
