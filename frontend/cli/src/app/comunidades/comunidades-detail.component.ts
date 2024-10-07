import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importamos para obtener el parámetro de la URL
import { ComunidadService } from './comunidad.service'; // Servicio para obtener las comunidades
import { UsuarioService } from '../usuarios/usuario.service';
import { Comunidad } from './comunidad'; // Modelo de la comunidad
import { CommonModule, Location } from '@angular/common'; // Para permitir navegar de vuelta

@Component({
  selector: 'app-comunidad-detail',
  templateUrl: './comunidades-detail.component.html',
  styleUrls: ['./comunidades-detail.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ComunidadDetailComponent implements OnInit {
  comunidad!: Comunidad; // Comunidad especifica que se va a mostrar

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private comunidadService: ComunidadService, // Servicio para obtener lac omunidad por ID
    private usuarioService: UsuarioService,
    private location: Location, // Para manejar la navegación
    private router: Router

  ) { }

  ngOnInit(): void {
    this.getComunidad(); // Al inicializar el componente, obtener los detalles de la comunidad
  }

  getComunidad(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
      this.router.navigate(['comunidades/crearComunidad']);
    } else {

      this.comunidadService.get(parseInt(id)).subscribe(async dataPackage => {

        this.comunidad = <Comunidad>dataPackage.data;

        if (this.comunidad.latitud && this.comunidad.longitud) {
          this.comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(this.comunidad.latitud, this.comunidad.longitud);
        } else {
          this.comunidad.ubicacion = 'Ubicación desconocida';
        }

        if (this.comunidad) {
          this.comunidad.fechaDeCreacion = new Date(this.comunidad.fechaDeCreacion);
        }
      });

    }

  }
  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  ingresar(): void {
    const idComunidad = this.route.snapshot.paramMap.get('id')!;
    this.usuarioService.solicitarIngresoAComunidad(<number><unknown>idComunidad, 139331);
  }
}