import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../eventos/evento.service';
import { Evento } from '../eventos/evento';
import { PaginationComponent } from '../pagination/pagination.component';
import { DataPackage } from '../data-package';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, PaginationComponent],
  templateUrl: 'sugerenciasEventos.component.html',
  styleUrls: ['sugerenciasEventos.component.css']
})
export class SugerenciasEventosComponent implements OnInit {
  currentIndex: number = 0; // Índice actual del carrusel
  eventos: Evento[] = []; // Arreglo para almacenar los eventos que provienen del backend
  results: any[] = [];
  motivos: { [key: number]: String } = {}; // Para almacenar comentarios por publicación
  page: number = 0;  // Página inicial
  size: number = 4;  // Tamaño de la página (cantidad de elementos)
  elementos: number = 0;
  totalPages: number = 0;
  constructor(private eventoService: EventoService,
    private router: Router) { }

  ngOnInit(): void {
    this.getEventos();
    console.info(this.results);
  }

  getEventos(): void {
    this.eventoService.sugerencias(this.page, this.size).subscribe((dataPackage: DataPackage) => {
      // Cast de tipo para acceder a la propiedad 'data' dentro del objeto 'dataPackage'
      const data = dataPackage.data as { data: any[], totalPaginas: number };

      if (Array.isArray(data.data)) {
        this.results = data.data.map(item => item.evento);  // Extrae solo los objetos 'evento'
        console.info("Eventos recibidos: ", this.results);

        this.motivos = {};
        data.data.forEach(item => {
          this.motivos[item.evento.id] = item.motivo;
        });

        this.elementos = data.data.length
        this.totalPages = data.totalPaginas; // Accede correctamente a 'totalPaginas'
        console.info("Total de páginas:", this.totalPages);
      }
    });
  }


  // Método para manejar el cambio de página solicitado desde la paginación
  onPageChangeRequested(newPage: number): void {
    // Convertir la página del frontend (base 1) a base 0
    this.page = newPage - 1; // Si el frontend usa páginas de 1, restamos 1 para enviar la página correcta al backend
    this.getEventos();
}

}
