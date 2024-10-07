import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Evento } from './evento';
import { EventoService } from './evento.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'eventos.component.html',
  styleUrls: ['eventos.component.css'] // Ruta relativa correcta si está en la misma carpeta
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = []; // Arreglo para almacenar los eventos que provienen del backend
  currentIndex: number = 0; // Índice actual del carrusel
  results: Evento[] = [];

  constructor(private eventoService: EventoService,
              private router: Router) {}

  ngOnInit(): void {
    this.getEventos(); // Cargar los eventos al inicializar el componente
  }

  async getEventos(): Promise<void> {
    this.eventoService.all().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      console.log(responseData);
      if (Array.isArray(responseData)) {
        this.results = responseData;
        this.traerParticipantes(); // Llamar a traerParticipantes después de cargar los eventos
        for (const evento of this.results) {
          if (evento.latitud && evento.longitud) {
            evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
          } else {
            evento.ubicacion = 'Ubicación desconocida';
          }
        }
      } else {
        console.log("no traenada");
      }
    });
  }

  traerParticipantes(): void {
    // Recorrer todos los eventos y obtener el número de participantes
    for (let evento of this.results) {
      this.eventoService.participantesEnEvento(evento.id).subscribe(
        (dataPackage) => {
          // Asignar el número de participantes al evento
          if (dataPackage && typeof dataPackage.data === 'number') {
            evento.participantes = dataPackage.data; // Asignar el número de participantes
          }
        },
        (error) => {
          console.error(`Error al traer los participantes del evento ${evento.id}:`, error);
        }
      );
    }
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
  obtenerEventosParaMostrar(): Evento[] {
    const eventosParaMostrar: Evento[] = [];

    if (this.results.length === 0) {
      return eventosParaMostrar; // Devuelve un arreglo vacío si no hay eventos
    }

    for (let i = 0; i < 4; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      eventosParaMostrar.push(this.results[index]);
    }

    console.log(eventosParaMostrar); // Verificar qué eventos se están mostrando
    return eventosParaMostrar;
  }

  irADetallesDelEvento(id: number): void {
    this.router.navigate(['/eventos', id]); // Navega a la ruta /eventos/:id
  }
}
