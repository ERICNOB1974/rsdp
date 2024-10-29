import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Comunidad } from '../comunidades/comunidad';
import { ComunidadService } from '../comunidades/comunidad.service';

@Component({
    selector: 'app-sugerencias',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: 'sugerenciasComunidades.component.html',
    styleUrls: ['sugerencias.component.css'] 
})
export class SugerenciasComunidadesComponent implements OnInit {
    currentIndex: number = 0; // Índice actual del carrusel
    comunidades: Comunidad[] = []; // Arreglo para almacenar los eventos que provienen del backend
    results: Comunidad[] = [];
  
    constructor(
        private comunidadService: ComunidadService,
        private router: Router) { }

    ngOnInit(): void {
        this.getEventos()
    }


    getEventos(): void {
        this.comunidadService.sugerencias().subscribe((dataPackage) => {
          if (Array.isArray(dataPackage.data)) {
            this.results = dataPackage.data.map(item => item.comunidad); // Extrae solo los objetos 'evento'
          }
        });
      }

      // Método para mover al siguiente grupo de eventos en el carrusel
      siguienteEvento(): void {
        this.currentIndex = (this.currentIndex + 1) % this.results.length; // Incrementa el índice
      }
    
      // Método para mover al grupo anterior de eventos en el carrusel
      eventoAnterior(): void {
        this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length; // Decrementa el índice
      }
    
      // Método para obtener los eventos a mostrar en el carrusel
      obtenerComunidadesParaMostrar(): Comunidad[] {
        const comunidadesParaMostrar: Comunidad[] = [];
      
        if (this.results.length === 0) {
          return comunidadesParaMostrar; // Devuelve un arreglo vacío si no hay comunidades
        }
      
        // Si hay menos de 4 comunidades, se muestran solo las disponibles sin repetir
        const cantidadComunidadesAMostrar = Math.min(4, this.results.length);
      
        for (let i = 0; i < cantidadComunidadesAMostrar; i++) {
          const index = (this.currentIndex + i) % this.results.length;
          comunidadesParaMostrar.push(this.results[index]);
        }
      
        return comunidadesParaMostrar;
      }
      
}
