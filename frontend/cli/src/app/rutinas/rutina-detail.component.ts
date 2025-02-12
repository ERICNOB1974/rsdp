import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RutinaService } from './rutina.service';
import { CommonModule } from '@angular/common';
import { DataPackage } from '../data-package';
import { RutinaEstadoService } from './rutinaEstado.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { lastValueFrom } from 'rxjs';
import { IdEncryptorService } from '../idEcnryptorService';

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
  esFavorito: boolean = false;

  constructor(private rutinaService: RutinaService,
              private route: ActivatedRoute,
              private rutinaEstadoService: RutinaEstadoService,
              private snackBar: MatSnackBar,
              private router: Router,
              private idEncryptorService: IdEncryptorService
            ) { }

  ngOnInit(): void {
    const state = window.history.state;
    if (state && state.mensajeSnackBar) {
      this.snackBar.open(state.mensajeSnackBar, 'Cerrar', {
        duration: 3000,
      });
    }
    //const id = (this.route.snapshot.paramMap.get('id')!);

    const idCifrado = this.route.snapshot.paramMap.get('id');

    let id: number | string = 'new'; // Inicializamos con 'new' para que la comparación funcione

    if (idCifrado && idCifrado !== 'new') {
        id = this.idEncryptorService.decodeId(idCifrado).toString();
    }


    // Obtiene la rutina ordenada
    this.rutinaService.getRutinaOrdenada(id).subscribe((response: DataPackage) => {
      this.rutina = response.data;
      this.dias = this.rutina.dias;
      this.isDayVisible = new Array(this.dias.length).fill(false);

      // Llama a obtenerProgresoActual después de obtener los días de la rutina
      this.rutinaService.obtenerProgresoActual(<number><unknown>id).subscribe((response: DataPackage) => {
        this.progresoActual = response.data as unknown as number;
      });
      this.rutinaService.esFavorita(this.rutina.id).subscribe(dataPackage => {
        this.esFavorito = dataPackage.data as unknown as boolean;
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
    this.router.navigate([`rutinas/hacer/`, this.idEncryptorService.encodeId(rutinaId)]); 
  }

  reiniciarRutina() {
    const rutinaId = Number(this.route.snapshot.paramMap.get('id')!);
    this.rutinaEstadoService.setReiniciarRutina(true); // Establece el estado de reinicio en el servicio
    this.router.navigate([`rutinas/hacer/`,this.idEncryptorService.encodeId(rutinaId)]); 
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

  async toggleFavorito() {
    this.esFavorito = !this.esFavorito;
    await lastValueFrom(this.rutinaService.marcarRutinaFavorita(this.rutina.id));
    const mensaje = this.esFavorito
        ? 'Rutina marcada como favorita'
        : 'Rutina quitada de favoritas';

    this.snackBar.open(mensaje, 'Cerrar', {
        duration: 3000,
    });
    // Aquí envías la actualización al backend para registrar el cambio.
}
}
