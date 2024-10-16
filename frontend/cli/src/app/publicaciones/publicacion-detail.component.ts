import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; // Para permitir navegar de vuelta
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicacionService } from './publicacion.service';
import { Publicacion } from './publicacion';


@Component({
  selector: 'app-evento-detail',
  templateUrl: './publicacion-detail.component.html',
  imports: [CommonModule],
  standalone: true
})
export class PublicacionDetailComponent implements OnInit {

  publicacion!:Publicacion;

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private publicacionService: PublicacionService, // Servicio para obtener el evento por ID
    private location: Location, // Para manejar la navegación
    private router: Router,
    private snackBar: MatSnackBar // Agrega MatSnackBar en el constructor
  ) { }


  ngOnInit(): void {
    this.getEvento();
    //this.traerParticipantes();
  }


  getEvento(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
      this.router.navigate(['eventos/crearEvento']);
    }
    else {
      this.publicacionService.get(parseInt(id)).subscribe(async dataPackage => {
        this.publicacion= <Publicacion> dataPackage.data;
      });
    }
  }


  goBack(): void {
    this.location.back();
  }


}
