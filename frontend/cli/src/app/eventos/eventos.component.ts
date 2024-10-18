import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { AuthService } from '../usuarios/auntenticacion.service';

@Component({
  selector: 'app-eventos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'eventos.component.html',
  styleUrls: ['eventos.component.css']
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = []; // Arreglo para almacenar los eventos que provienen del backend
  currentIndex: number = 0; // Índice actual del carrusel
  results: Evento[] = [];
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  eventosParticipaUsuario: Evento[] = [];

  constructor(private eventoService: EventoService,
    private authService: AuthService,  // Inyecta el AuthService

    private router: Router) { }

  ngOnInit(): void {
    this.getEventos(); // Cargar los eventos al inicializar el componente
    this.obtenerUsuarioAutenticado();
    this.ParticipaUsuario();
  }

  obtenerUsuarioAutenticado(): void {
    const usuarioAutenticado = this.authService.obtenerUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.idUsuarioAutenticado = usuarioAutenticado.id;
    }
  }

  async getEventos(): Promise<void> {
    this.eventoService.disponibles().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.results = responseData;
        this.traerParticipantes(this.results); // Llamar a traerParticipantes después de cargar los eventos
        for (const evento of this.results) {
          if (evento.latitud && evento.longitud) {
            evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
          } else {
            evento.ubicacion = 'Ubicación desconocida';
          }
        }
      }
    });
  }

  async ParticipaUsuario(): Promise<void> {
    this.eventoService.participaUsuario(this.idUsuarioAutenticado).subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.eventosParticipaUsuario = responseData;
        this.traerParticipantes(this.eventosParticipaUsuario); // Llamar a traerParticipantes después de cargar los eventos
        for (const evento of this.results) {
          if (evento.latitud && evento.longitud) {
            evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
          } else {
            evento.ubicacion = 'Ubicación desconocida';
          }
        }
      }
    });
  }

  traerParticipantes(eventos: Evento[]): void {
    // Recorrer todos los eventos y obtener el número de participantes
    for (let evento of eventos) {
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
  // Método para obtener los eventos a mostrar en el carrusel
  obtenerEventosParaMostrar(): Evento[] {
    const eventosParaMostrar: Evento[] = [];

    if (this.results.length === 0) {
      return eventosParaMostrar; // Devuelve un arreglo vacío si no hay eventos
    }

    for (let i = 0; i < 4; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      const evento = this.results[index];

      // Excluir eventos en los que el usuario ya está participando
      const yaParticipa = this.eventosParticipaUsuario.some(
        (eventoParticipado) => eventoParticipado.id === evento.id
      );

      if (!yaParticipa) {
        eventosParaMostrar.push(evento); // Agregar solo si no está participando
      }
    }

    return eventosParaMostrar;
  }


  irADetallesDelEvento(id: number): void {
    this.router.navigate(['/eventos', id]); // Navega a la ruta /eventos/:id
  }
}
