import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { EventoService } from './evento.service'; 
import { Evento } from './evento'; 
import { Location } from '@angular/common'; 
import { CommonModule } from '@angular/common'; // Para permitir navegar de vuelta


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
    private location: Location, // Para manejar la navegación
    private router: Router

  ) { }

  ngOnInit(): void {
    this.getEvento(); 
  }


 getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id  || isNaN(parseInt(id, 10)) || id === 'new') {
      this.evento = <Evento>{};
      this.router.navigate(['eventos/crearEvento']);
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


  goBack(): void {
    this.location.back();
  }

  inscribirse(): void {
    console.log("Inscribirse al evento:", this.evento?.nombre);
  }
}
