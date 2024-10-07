import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Comunidad } from './comunidad';
import { ComunidadService } from './comunidad.service';

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

  constructor(private comunidadService: ComunidadService,
    private router: Router) { }

  ngOnInit(): void {
    this.getComunidades(); // Cargar las comunidades al inicializar el componente
  }

  async getComunidades(): Promise<void> {
    this.comunidadService.all().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.results = responseData;
        this.traerMiembros(); // Llamar a traerMiembros después de cargar las comunidades
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
  
  traerMiembros(): void {
    const memberPromises = this.results.map(comunidad => {
      return this.comunidadService.miembrosEnComunidad(comunidad.id).toPromise()
        .then(dataPackage => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            comunidad.miembros = dataPackage.data; // Asignar el número de miembros
          }
        })
        .catch(error => {
          console.error(`Error al traer los miembros de la comunidad ${comunidad.id}:`, error);
        });
    });
  
    // Esperar a que todas las promesas se completen
    Promise.all(memberPromises).then(() => {
      console.log('Todos los miembros han sido cargados');
    });
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

    for (let i = 0; i < 4; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      comunidadesParaMostrar.push(this.results[index]);
    }

    return comunidadesParaMostrar;
  }

  irADetallesDeLaComunidad(id: number): void {
    this.router.navigate(['/comunidades', id]); // Navega a la ruta /comunidades/:id
  }
}