import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Rutina } from './rutina';
import { RutinaService } from './rutina.service';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-rutinas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'rutinas.component.html',
  styleUrls: ['rutinas.component.css']
})
export class RutinasComponent implements OnInit {
  rutinas: Rutina[] = []; // Arreglo para almacenar las rutinas que provienen del backend
  currentIndex: number = 0; // Índice actual del carrusel
  results: Rutina[] = [];
  rutinasUsuario: Rutina[] = []; // Rutinas en las que el usuario está inscrito
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  diasRutina: number[] = []; // Arreglo para almacenar los días de cada rutina

  constructor(private rutinaService: RutinaService,
              private authService: AuthService,
              private router: Router) { }

  ngOnInit(): void {
    this.getRutinas(); // Cargar las rutinas al inicializar el componente
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.getRutinasUsuario(); // Cargar las rutinas del usuario
  }

  async getRutinas(): Promise<void> {
    this.rutinaService.all().subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.results = responseData;
        this.traerDias(this.results); // Llamar a traerDias después de cargar las rutinas
        this.traerEtiquetas(this.results); // Llamar a traerEtiquetas después de cargar las rutinas
      } else {
        console.log("No trae nada");
      }
    });
  }  

  async getRutinasUsuario(): Promise<void> {
    this.rutinaService.obtenerRutinasPorUsuario(this.idUsuarioAutenticado).subscribe(async (dataPackage) => {
      const responseData = dataPackage.data;
      if (Array.isArray(responseData)) {
        this.rutinasUsuario = responseData;
        this.traerDias(this.rutinasUsuario); // Llamar a traerDias para las rutinas del usuario
        this.traerEtiquetas(this.results); // Llamar a traerEtiquetas después de cargar las rutinas
      } else {
        console.log("No trae nada");
      }
    });
  }

  traerDias(rutinas: Rutina[]): void {
    for (let rutina of rutinas) {
      this.rutinaService.obtenerDiasEnRutina(rutina.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && typeof dataPackage.data === 'number') {
            rutina.dias = dataPackage.data; // Asignar el número de días
          }
        },
        (error) => {
          console.error(`Error al traer los días de la rutina ${rutina.id}:`, error);
        }
      );
    }
  }

  traerEtiquetas(rutinas: Rutina[]): void {
      for (let rutina of rutinas) {
      this.rutinaService.obtenerEtiquetasDeRutina(rutina.id!).subscribe(
        (dataPackage) => {
          if (dataPackage && Array.isArray(dataPackage.data)) {
            rutina.etiquetas = dataPackage.data; // Asignar el número de días
          }
        },
        (error) => {
          console.error(`Error al traer las Etiqeutas días de la rutina ${rutina.id}:`, error);
        }
      );
    }
  }
  // Método para mover al siguiente grupo de rutinas en el carrusel
  siguienteRutina(): void {
    this.currentIndex = (this.currentIndex + 1) % this.results.length; // Incrementa el índice
  }

  // Método para mover al grupo anterior de rutinas en el carrusel
  rutinaAnterior(): void {
    this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length; // Decrementa el índice
  }

  // Método para obtener las rutinas a mostrar en el carrusel
  obtenerRutinasParaMostrar(): Rutina[] {
    const rutinasParaMostrar: Rutina[] = [];
  
    if (this.results.length === 0) {
      return rutinasParaMostrar; // Devuelve un arreglo vacío si no hay rutinas
    }
  
    // Definir cuántas rutinas mostrar, máximo 4 o el número total de rutinas disponibles
    const cantidadRutinasAMostrar = Math.min(this.results.length, 4);
  
    for (let i = 0; i < cantidadRutinasAMostrar; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      const rutina = this.results[index];
      rutinasParaMostrar.push(rutina); // Agregar la rutina
    }
  
    return rutinasParaMostrar;
  }

  irADetallesDeLaRutina(id: number): void {
    this.router.navigate(['/rutinas', id]); // Navega a la ruta /rutinas/:id
  }
}