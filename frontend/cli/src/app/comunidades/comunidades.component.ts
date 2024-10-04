import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';

@Component({
  selector: 'app-comunidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'comunidades.component.html',
})
export class ComunidadesComponent implements OnInit {
  eventos: Comunidad[] = []; // Arreglo para almacenar las comunidades que provienen del backend
  currentIndex: number = 0; // Índice actual del carrusel
  results: Comunidad[] = [];

  constructor(private eventoService: ComunidadService,
              private router: Router) {}

  ngOnInit(): void {
    this.getEventos(); // Cargar los comunidades al inicializar el componente
  }

  getEventos(): void {
    this.eventoService.all().subscribe((dataPackage) => {
      const responseData = dataPackage.data;
      console.log(responseData);
      if (Array.isArray(responseData)) {
        this.results = responseData;
      }
    });
  }

  // Método para mover al siguiente grupo de comunidades en el carrusel
  siguienteEvento(): void {
    this.currentIndex = (this.currentIndex + 1) % this.results.length; // Incrementa el índice
  }

  // Método para mover al grupo anterior de comunidades en el carrusel
  comunidadAnterior(): void {
    this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length; // Decrementa el índice
  }

  // Método para obtener los comunidades a mostrar en el carrusel
  obtenerEventosParaMostrar(): Comunidad[] {
    const eventosParaMostrar: Comunidad[] = [];

    if (this.results.length === 0) {
      return eventosParaMostrar; // Devuelve un arreglo vacío si no hay comunidades
    }

    for (let i = 0; i < 4; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      eventosParaMostrar.push(this.results[index]);
    }

    console.log(eventosParaMostrar); // Verificar qué comunidades se están mostrando
    return eventosParaMostrar;
  }

  irADetallesDelEvento(id: number): void {
    this.router.navigate(['/comunidades', id]); // Navega a la ruta /comunidades/:id
  }
}
