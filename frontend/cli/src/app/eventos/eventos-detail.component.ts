import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importamos para obtener el parámetro de la URL
import { EventoService } from './evento.service'; // Servicio para obtener los eventos
import { Evento } from './evento'; // Modelo del evento
import { CommonModule, Location } from '@angular/common'; // Para permitir navegar de vuelta

@Component({
  selector: 'app-evento-detail',
  templateUrl: './eventos-detail.component.html',
  styleUrls: ['./eventos-detail.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class EventoDetailComponent implements OnInit {
  evento!: Evento; // Evento específico que se va a mostrar

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private eventoService: EventoService, // Servicio para obtener el evento por ID
    private location: Location // Para manejar la navegación
  ) { }

  ngOnInit(): void {
    this.getEvento(); // Al inicializar el componente, obtener los detalles del evento
  }

  getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id  || isNaN(parseInt(id, 10)) || id === 'new') {
      this.evento = <Evento>{};
    }
    else {
      this.eventoService.get(parseInt(id)).subscribe(async dataPackage => {
        this.evento = <Evento>dataPackage.data;
        
        if (this.evento.latitud && this.evento.longitud) {
          this.evento.ubicacion = await this.eventoService.obtenerUbicacion(this.evento.latitud, this.evento.longitud);
        } else {
          this.evento.ubicacion = 'Ubicación desconocida';
        }

        // Aseguramos que las fechas estén convertidas a tipo Date
        if (this.evento) {
          this.evento.fechaDeCreacion = new Date(this.evento.fechaDeCreacion);
          this.evento.fechaHora = new Date(this.evento.fechaHora);
        }
      });
    }
  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  inscribirse(): void {
    console.log("Inscribirse al evento:", this.evento?.nombre);
  }
}
