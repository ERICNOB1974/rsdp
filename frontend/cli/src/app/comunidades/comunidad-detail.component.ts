import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'; // Importamos para obtener el parámetro de la URL
import { Location } from '@angular/common'; // Para permitir navegar de vuelta
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';

@Component({
  selector: 'app-comunidad-detail',
  templateUrl: './comunidad-detail.component.html',
})
export class ComunidadDetailComponent implements OnInit {
  comunidad: Comunidad | undefined ; // Evento específico que se va a mostrar

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private comunidadService: ComunidadService, // Servicio para obtener el evento por ID
    private location: Location // Para manejar la navegación
  ) {}

  ngOnInit(): void {
    this.getEvento(); // Al inicializar el componente, obtener los detalles del evento
  }

  getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id === 'new') {  
        this.comunidad = <Comunidad>{};
    }
    else {
        this.comunidadService.get(parseInt(id)).subscribe(dataPackage => this.comunidad = <Comunidad>dataPackage.data);
    }
}

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }
}
