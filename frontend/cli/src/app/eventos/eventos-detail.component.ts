import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; 
import { EventoService } from './evento.service'; 
import { Evento } from './evento'; 
import { Location } from '@angular/common'; 

@Component({
  selector: 'app-evento-detail',
  templateUrl: './eventos-detail.component.html',
})
export class EventoDetailComponent implements OnInit {
  evento: Evento | undefined; 

  constructor(
    private route: ActivatedRoute, 
    private eventoService: EventoService, 
    private location: Location,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getEvento(); 
  }

  
  getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
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

  goBack(): void {
    this.location.back();
  }
}
