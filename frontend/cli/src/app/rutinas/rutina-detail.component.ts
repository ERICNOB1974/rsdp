import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutinaService } from './rutina.service';
import { CommonModule } from '@angular/common';
import { DataPackage } from '../data-package';
import { RutinaEstadoService } from './rutinaEstado.component';

@Component({
  selector: 'app-rutina-detail',
  templateUrl: './rutina-detail.component.html',
  styleUrls: ['./rutina-detail.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class RutinaDetailComponent implements OnInit {
  rutina: any;
  dias: any[] = [];
  isDayVisible: boolean[] = [];
  progresoActual: number = -1; // Para almacenar el progreso actual de la rutina

  constructor(private rutinaService: RutinaService,
              private route: ActivatedRoute,
              private rutinaEstadoService: RutinaEstadoService,
              private router: Router) { }

  ngOnInit(): void {
    const id = (this.route.snapshot.paramMap.get('id')!);

    // Obtiene la rutina ordenada
    this.rutinaService.getRutinaOrdenada(id).subscribe((response: DataPackage) => {
      this.rutina = response.data;
      this.dias = this.rutina.dias;
      this.isDayVisible = new Array(this.dias.length).fill(false);

      // Llama a obtenerProgresoActual después de obtener los días de la rutina
      this.rutinaService.obtenerProgresoActual(<number><unknown>id).subscribe((response: DataPackage) => {
        this.progresoActual = response.data as unknown as number;
      });
    });
  }

  toggleDayVisibility(index: number): void {
    this.isDayVisible[index] = !this.isDayVisible[index];
  }
  
  iniciarRutina() {
    const rutinaId = Number(this.route.snapshot.paramMap.get('id')!);
    this.rutinaService.crearRelacionRealizaRutina(rutinaId).subscribe(
      response => {
        console.log('Rutina iniciada exitosamente', response);
      },
      error => {
        console.error('Error al iniciar la rutina', error);
      }
    );
    this.router.navigate([`rutinas/hacer/${rutinaId}`]); 
  }

  reiniciarRutina() {
    const rutinaId = Number(this.route.snapshot.paramMap.get('id')!);
    this.rutinaEstadoService.setReiniciarRutina(true); // Establece el estado de reinicio en el servicio
    this.router.navigate([`rutinas/hacer/${rutinaId}`]); 
  }

  // Método para determinar el texto del botón
  getBotonTexto(): string {
    if (this.progresoActual === -1 || this.progresoActual === this.dias[this.dias.length - 1].id) {
      return 'Iniciar rutina';
    }
    
    for (let i = 0; i < this.dias.length; i++) {
      if (this.dias[i].id === this.progresoActual) {
        return `Continuar con día ${i + 2}`;
      }
    }
  
    return 'Continuar';
  }
}
