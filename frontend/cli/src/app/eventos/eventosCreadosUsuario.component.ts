import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-eventos-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: 'eventosCreadosUsuario.component.html',
  styleUrls: ['eventosCreadosUsuario.component.css']
})
export class EventosCreadosUsuarioComponent implements OnInit, OnDestroy {
  eventosUsuario: Evento[] = []; // Arreglo para almacenar los eventos creados por el usuario
  currentIndex: number = 0;
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  offset: number = 0; // Inicializar el offset
  limit: number = 10; // Número de eventos a cargar por solicitud
  loading: boolean = false; // Para manejar el estado de carga

  constructor(
    private eventoService: EventoService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);  
    this.getEventosUsuario(); // Cargar los eventos creados por el usuario al inicializar el componente
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  private getEventosUsuario(): void {
    if (this.loading) return; // Evitar cargar si ya se está cargando
    this.loading = true; // Establecer estado de carga
    this.eventoService.eventosCreadosPorUsuario(this.offset, this.limit).subscribe(
      (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.eventosUsuario.push(...responseData); // Agregar eventos a la lista existente
          this.offset += this.limit; // Aumentar el offset
        }
        this.loading = false; // Restablecer estado de carga
      },
      (error) => {
        console.error("Error al cargar los eventos del usuario:", error);
        this.loading = false; // Restablecer estado de carga en caso de error
      }
    );
  }

  irADetallesDelEvento(id: number): void {
    this.router.navigate(['/eventos', id]); // Navega a la ruta /eventos/:id
  }

  siguienteEvento(): void {
    this.currentIndex = (this.currentIndex + 1) % this.eventosUsuario.length;
  }

  eventoAnterior(): void {
    this.currentIndex = (this.currentIndex - 1 + this.eventosUsuario.length) % this.eventosUsuario.length;
  }

  obtenerEventosParaMostrar(): Evento[] {
    const eventosParaMostrar: Evento[] = [];
    if (this.eventosUsuario.length === 0) {
      return eventosParaMostrar;
    }
    const maxEventos = Math.min(4, this.eventosUsuario.length);

    for (let i = 0; i < maxEventos; i++) {
      const index = (this.currentIndex + i) % this.eventosUsuario.length;
      eventosParaMostrar.push(this.eventosUsuario[index]);
    }
    return eventosParaMostrar;
  }

   onScroll(): void { // Sigue siendo public
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.loading) {
      this.getEventosUsuario(); // Cargar más eventos al llegar al final de la página
    }
  }
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this)); // Limpiar el listener
  }
}
