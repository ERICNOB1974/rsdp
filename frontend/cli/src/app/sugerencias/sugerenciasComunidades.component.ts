import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Comunidad } from '../comunidades/comunidad';
import { ComunidadService } from '../comunidades/comunidad.service';
import { DataPackage } from '../data-package';
import { PaginationComponent } from '../pagination/pagination.component';
import { IdEncryptorService } from '../idEcnryptorService';

@Component({
    selector: 'app-sugerencias',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule,PaginationComponent ],
    templateUrl: 'sugerenciasComunidades.component.html',
    styleUrls: ['sugerenciasEventos.component.css'] 
})
export class SugerenciasComunidadesComponent implements OnInit {
    currentIndex: number = 0; // Índice actual del carrusel
    comunidades: Comunidad[] = []; // Arreglo para almacenar los eventos que provienen del backend
    results: Comunidad[] = [];
    motivos: { [key: number]: String } = {}; // Para almacenar comentarios por publicación
    page: number = 0;  // Página inicial
    size: number = 4;  // Tamaño de la página (cantidad de elementos)
    elementos: number = 0;
    totalPages: number = 0;
    isModalOpen: boolean = false; // Controla si el modal está abierto
    comunidadSeleccionada: any = null; // Almacena la comunidad seleccionada
    constructor(
        private comunidadService: ComunidadService,
        protected idEncryptorService: IdEncryptorService
      ) { }

    ngOnInit(): void {
        this.getComunidades()
    }


      getComunidades(): void {
        this.comunidadService.sugerencias(this.page, this.size).subscribe((dataPackage: DataPackage) => {
          const data = dataPackage.data as { data: any[], totalPaginas: number };

          if (Array.isArray(data.data)) {
            // Extrae solo los usuarios
            this.results = data.data.map(item => item.comunidad);  // Extrae solo los objetos 'evento'            // Llena el objeto `motivos` con pares id: motivo
            this.motivos = {};
            data.data.forEach(item => {
              this.motivos[item.comunidad.id] = item.motivo;
            });
            this.elementos = data.data.length
            this.totalPages = data.totalPaginas; // Accede correctamente a 'totalPaginas'
          }
        });
      }

      formatMotivo(motivo: string): string {
        if (!motivo) return "Motivo no disponible";
        
        const frasesUnicas = Array.from(new Set(motivo.split(" --- ")));
        return frasesUnicas.map(frase => `• ${frase}`).join("<br>");
      }

      onPageChangeRequested(newPage: number): void {
        // Convertir la página del frontend (base 1) a base 0
        this.page = newPage - 1; // Si el frontend usa páginas de 1, restamos 1 para enviar la página correcta al backend
        this.getComunidades();
    }
      
    openMotivoModal(id: number): void {
      this.isModalOpen = true;
      this.comunidadSeleccionada = this.results.find((comunidad) => comunidad.id === id);
    }
  
    // Método para cerrar el modal
    closeMotivoModal(): void {
      this.isModalOpen = false;
      this.comunidadSeleccionada = null;
    }
}
