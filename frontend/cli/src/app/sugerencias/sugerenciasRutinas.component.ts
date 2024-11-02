import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Rutina } from '../rutinas/rutina';
import { RutinaService } from '../rutinas/rutina.service';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'sugerenciasRutinas.component.html',
  styleUrls: ['sugerencias.component.css']
})
export class SugerenciasRutinasComponent implements OnInit {
  sugerencias: Rutina[] = []; // Arreglo para almacenar las rutinas sugeridas
  currentIndex: number = 0; // Índice actual del carrusel

  constructor(
    private rutinaService: RutinaService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getSugerencias(); // Cargar las sugerencias al inicializar el componente
  }

getSugerencias(): void {
  const nombreUsuario = this.authService.getNombreUsuario();
  this.rutinaService.sugerencias(<string>nombreUsuario).subscribe((dataPackage) => {
    if (Array.isArray(dataPackage.data)) {
      this.sugerencias = dataPackage.data.map(item => item.rutina);
      console.info("Rutinas recibidas: ", this.sugerencias);
      
      // Llamar a los métodos para obtener días y etiquetas
      this.traerDias(this.sugerencias);
      this.traerEtiquetas(this.sugerencias);
    }
  });
}

  siguienteRutina(): void {
    this.currentIndex = (this.currentIndex + 1) % this.sugerencias.length; // Incrementa el índice
  }

  rutinaAnterior(): void {
    this.currentIndex = (this.currentIndex - 1 + this.sugerencias.length) % this.sugerencias.length; // Decrementa el índice
  }

  obtenerRutinasParaMostrar(): Rutina[] {
    const rutinasParaMostrar: Rutina[] = [];

    if (this.sugerencias.length === 0) {
      return rutinasParaMostrar;
    }

    const maxRutinas = Math.min(4, this.sugerencias.length);

    for (let i = 0; i < maxRutinas; i++) {
      const index = (this.currentIndex + i) % this.sugerencias.length;
      rutinasParaMostrar.push(this.sugerencias[index]);
    }

    return rutinasParaMostrar;
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

  irADetallesDeLaRutina(id: number | undefined): void {
    this.router.navigate(['/rutinas', id]); // Navega a la ruta /rutinas/:id
  }
}
