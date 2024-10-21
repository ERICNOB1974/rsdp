import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importamos para obtener el parámetro de la URL
import { ComunidadService } from './comunidad.service'; // Servicio para obtener las comunidades
import { UsuarioService } from '../usuarios/usuario.service';
import { Comunidad } from './comunidad'; // Modelo de la comunidad
import { CommonModule, Location } from '@angular/common'; // Para permitir navegar de vuelta
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-comunidad-detail',
  templateUrl: './comunidades-detail.component.html',
  styleUrls: ['./comunidades-detail.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ComunidadDetailComponent implements OnInit {
  comunidad!: Comunidad; // Comunidad especifica que se va a mostrar
  esParte: boolean = false;
  pendiente: boolean = false;
  esCreador: boolean = false;

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private comunidadService: ComunidadService, // Servicio para obtener lac omunidad por ID
    private usuarioService: UsuarioService,
    private location: Location, // Para manejar la navegación
    private router: Router,
    private snackBar: MatSnackBar // Agrega MatSnackBar en el constructor


  ) { }

  ngOnInit(): void {
    this.getComunidad(); // Al inicializar el componente, obtener los detalles de la comunidad
    console.log(this.comunidad.id);
  }

  procesarEstado(): void {
    this.comunidadService.estadoSolicitud(this.comunidad.id).subscribe(dataPackage => {
      let estado = <String>dataPackage.data;
      console.log(estado);
      if (estado == "Vacio") {
        this.pendiente = false;
        this.esParte = false;
      }
      if (estado == "Miembro") {
        this.pendiente = false;
        this.esParte = true;
      }
      if (estado == "Pendiente") {
        this.pendiente = true;
        this.esParte = false;
      }
      if (estado == "Creador") {
        this.esCreador = true;
      }
    });
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
        this.procesarEstado();
        this.traerMiembros();
      });

    }
  }


  traerMiembros(): void {
    this.comunidadService.miembrosEnComunidad(this.comunidad.id).subscribe(dataPackage => {
      if (dataPackage && typeof dataPackage.data === 'number') {
        this.comunidad.miembros = dataPackage.data; // Asignar el número de miembros
      }
    });

  }

  // Método para regresar a la página anterior
  goBack(): void {
    this.location.back();
  }

  ingresar(): void {
    //const idComunidad = this.route.snapshot.paramMap.get('id')!;
    //let mensaje = 'Solicitud enviada con exito';
    this.usuarioService.solicitarIngresoAComunidad(this.comunidad.id).subscribe(dataPackage => {
      let mensaje = dataPackage.message;
      this.procesarEstado();
      this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000,
      });
    });

  }

  salir(): void {
    this.comunidadService.salir(this.comunidad.id).subscribe(dataPackage => {
      let mensaje = dataPackage.message;
      this.procesarEstado();
      this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000, // Duración del snackbar en milisegundos
      });
    });
  }

  salirValid(): boolean {
    return this.esParte &&  !this.pendiente && !this.esCreador;
  }

  inscribirseValid(): boolean {
    return ((this.comunidad.miembros < this.comunidad.cantidadMaximaMiembros) && !this.esParte && !this.pendiente && !this.esCreador);
  }
}