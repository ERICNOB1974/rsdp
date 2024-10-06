import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importamos para obtener el parámetro de la URL
import { EventoService } from './evento.service'; // Servicio para obtener los eventos
import { Evento } from './evento'; // Modelo del evento
import { Location } from '@angular/common'; // Para permitir navegar de vuelta

@Component({
  selector: 'app-evento-detail',
  templateUrl: './eventos-detail.component.html',
})
export class EventoDetailComponent implements OnInit {
  evento: Evento | undefined; // Evento específico que se va a mostrar

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private eventoService: EventoService, // Servicio para obtener el evento por ID
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEvento(); // Al inicializar el componente, obtener los detalles del evento
  }

  /*     getEvento(): void {
        const id = this.route.snapshot.paramMap.get('id')!;
        if (id === 'new') {  
            this.evento = <Evento>{};
        }
        else {
            this.eventoService.get(parseInt(id)).subscribe(dataPackage => this.evento = <Evento>dataPackage.data);
        }
    }
  
   */
  getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
      console.log('Redirigiendo a crearEvento');
      this.router.navigate(['eventos/crearEvento']);
    } else {
      const parsedId = parseInt(id, 10);
      this.eventoService.get(parsedId).subscribe(
        dataPackage => {
          if (dataPackage.data) {
            this.evento = <Evento>dataPackage.data;
          }
        }
      );
    }
  }


  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }
}
