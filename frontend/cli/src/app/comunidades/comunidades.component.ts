import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comunidad } from './comunidad';
import { ComunidadService } from './comunidad.service';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-comunidades',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'comunidades.component.html',
  styleUrls: ['comunidades.component.css'] // Ruta relativa correcta si está en la misma carpeta
})
export class ComunidadesComponent implements OnInit {
  comunidades: Comunidad[] = []; // Arreglo para almacenar las comunidades que provienen del backend
  currentIndex: number = 0; // Índice actual del carrusel
  results: Comunidad[] = [];
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  comunidadesMiembroUsuario: Comunidad[] = [];

  constructor(private comunidadService: ComunidadService,
    private authService: AuthService,  // Inyecta el AuthService
    private router: Router) { }

  ngOnInit(): void {
    this.getComunidades(); // Cargar las comunidades al inicializar el componente
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.miembroUsuario();
  }



  async getComunidades(): Promise<void> {
    this.comunidadService.disponibles().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.results = responseData;
        this.traerMiembros(this.results); // Llamar a traerMiembros después de cargar las comunidades
        // Recorrer todas las comunidades y asignar la ubicación
        for (const comunidad of this.results) {
          if (comunidad.latitud && comunidad.longitud) {
            comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          } else {
            comunidad.ubicacion = 'Ubicación desconocida';
          }
        }
      } else {
        console.log("No trae nada");
      }
    });
  }  
  

  async miembroUsuario(): Promise<void> {
    this.comunidadService.miembroUsuario(this.idUsuarioAutenticado).subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.comunidadesMiembroUsuario = responseData;
        this.traerMiembros(this.comunidadesMiembroUsuario); // Llamar a traerParticipantes después de cargar los eventos
        for (const comunidad of this.comunidadesMiembroUsuario) {
          if (comunidad.latitud && comunidad.longitud) {
            comunidad.ubicacion = await this.comunidadService.obtenerUbicacion(comunidad.latitud, comunidad.longitud);
          } else {
            comunidad.ubicacion = 'Ubicación desconocida';
          }
        }
      }
    });
  }



  traerMiembros(comunidades: Comunidad[]): void {
    for (let comunidad of comunidades) {
      this.comunidadService.miembrosEnComunidad(comunidad.id).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            comunidad.miembros = dataPackage.data; // Asignar el número de miembros
          }
        },
        (error) => {
          console.error(`Error al traer los miembros de la comunidad ${comunidad.id}:`, error);
        }
      );
    }
  }
  
  


  // Método para mover al siguiente grupo de comunidades en el carrusel
  siguienteComunidad(): void {
    this.currentIndex = (this.currentIndex + 1) % this.results.length; // Incrementa el índice
  }

  // Método para mover al grupo anterior de comunidades en el carrusel
  comunidadAnterior(): void {
    this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length; // Decrementa el índice
  }

  // Método para obtener las comunidades a mostrar en el carrusel
  obtenerComunidadesParaMostrar(): Comunidad[] {
    const comunidadesParaMostrar: Comunidad[] = [];
  
    if (this.results.length === 0) {
      return comunidadesParaMostrar; // Devuelve un arreglo vacío si no hay comunidades
    }
  
    // Definir cuántas comunidades mostrar, máximo 4 o el número total de comunidades disponibles
    const cantidadComunidadesAMostrar = Math.min(this.results.length, 4);
  
    for (let i = 0; i < cantidadComunidadesAMostrar; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      const comunidad = this.results[index];
  
      // Excluir comunidades en las que el usuario ya es miembro
      const yaMiembro = this.comunidadesMiembroUsuario.some(
        (comunidadMiembro) => comunidadMiembro.id === comunidad.id
      );
  
      if (!yaMiembro) {
        comunidadesParaMostrar.push(comunidad); // Agregar solo si no es miembro
      }
    }
  
    return comunidadesParaMostrar;
  }
  



  irADetallesDeLaComunidad(id: number): void {
    this.router.navigate(['/comunidades', id]); // Navega a la ruta /comunidades/:id
  }
}