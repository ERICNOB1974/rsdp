import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Rutina } from '../rutinas/rutina';
import { RutinaService } from '../rutinas/rutina.service';
import { AuthService } from '../autenticacion/auth.service';
import { DataPackage } from '../data-package';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: './sugerenciasRutinas.component.html',
  styleUrls: ['sugerenciasRutinas.component.css']
})
export class SugerenciasRutinasComponent implements OnInit {
  sugerencias: Rutina[] = []; // Arreglo para almacenar las rutinas sugeridas
  currentIndex: number = 0; // Índice actual del carrusel
  motivos: { [key: number]: String } = {}; // Para almacenar comentarios por publicación
  page: number = 0;  // Página inicial
  size: number = 4;  // Tamaño de la página (cantidad de elementos)
  elementos: number = 0;
  totalPages: number = 0;

  constructor(
    private rutinaService: RutinaService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getRutinas()
  }

  formatMotivo(motivo: string): string {
    if (!motivo) return "Motivo no disponible";
  
    const frasesUnicas = Array.from(new Set(motivo.split(" --- ")))
      .map(frase => {
        if (/\d/.test(frase) && !frase.includes("1")) {
          return frase.replace(/\//g, ""); // Eliminar todas las barras "/"
        }
        if (frase.includes("1")) {
          return frase.replace(/\/s|\/n|\/es/g, ""); // Eliminar "/s", "/n" y "/es"
        }
        return frase;
      });
  
    return frasesUnicas.map(frase => `• ${frase}`).join("<br>");
  }
  
  

  getRutinas(): void {
    this.rutinaService.sugerencias(this.page, this.size).subscribe((dataPackage: DataPackage) => {
      const data = dataPackage.data as { data: any[], totalPaginas: number };

      if (Array.isArray(data.data)) {
        // Extrae solo los usuarios
        this.sugerencias = data.data.map(item => {
          item.rutina;  // Extrae solo los objetos 'rutina'
          const rutina = item.rutina;
          rutina.dias = rutina.dias || [];  // Asegura que 'dias' sea un arreglo
          rutina.etiquetas = rutina.etiquetas || [];  // Asegura que 'etiquetas' sea un arreglo
          return rutina;          
        });
        this.motivos = {};
        data.data.forEach(item => {
          this.motivos[item.rutina.id] = item.motivo;
        });
        setTimeout(() => this.traerDias(this.sugerencias), 0);
        setTimeout(() => this.traerEtiquetas(this.sugerencias), 0);
        this.elementos = data.data.length
        this.totalPages = data.totalPaginas; // Accede correctamente a 'totalPaginas'
      }
    });
  }

  onPageChangeRequested(newPage: number): void {
    // Convertir la página del frontend (base 1) a base 0
    this.page = newPage - 1; // Si el frontend usa páginas de 1, restamos 1 para enviar la página correcta al backend
    this.getRutinas();
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
