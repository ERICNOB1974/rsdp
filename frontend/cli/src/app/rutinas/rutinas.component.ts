import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutinaService } from './rutina.service';
import { Rutina } from './rutina';
import { Ejercicio } from './ejercicio';
import { DataPackage } from '../data-package';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ejercicios',
    standalone: true,
    templateUrl: './rutinas.component.html',
    styleUrls: ['./rutinas.component.css'],
    imports: [CommonModule]
})
export class RutinasComponent implements OnInit, OnDestroy {
    rutina!: Rutina;
    ejercicios: Ejercicio[] = [];
    ejercicioActualIndex: number = 0; 
    tiempoDescanso: number = 30; // Tiempo de descanso inicial en segundos
    enDescanso: boolean = false; 
    intervaloDescanso: any; // Variable para almacenar el intervalo
    rutinaTerminada: boolean = false; // Para controlar si la rutina ha terminado

    constructor(
        private rutinaService: RutinaService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const idRutina = Number(this.route.snapshot.paramMap.get('id'));
        this.obtenerRutina(idRutina);
        this.obtenerEjerciciosDeRutina(idRutina);
    }

    obtenerRutina(idRutina: number): void {
        this.rutinaService.get(idRutina).subscribe((dataPackage: DataPackage) => {
            if (dataPackage.status === 200) {
                this.rutina = dataPackage.data as Rutina;
            } else {
                console.error(dataPackage.message);
            }
        });
    }

    obtenerEjerciciosDeRutina(idRutina: number): void {
        this.rutinaService.getEjerciciosDeRutina(idRutina).subscribe((dataPackage: DataPackage) => {
            if (dataPackage.status === 200) {
                this.ejercicios = dataPackage.data as Ejercicio[];
            } else {
                console.error(dataPackage.message);
            }
        });
    }

    terminarEjercicio(): void {
        if (this.ejercicioActualIndex < this.ejercicios.length - 1) {
            if (!this.enDescanso) {
                this.enDescanso = true; // Cambia a estado de descanso
                this.iniciarDescanso(); // Inicia el temporizador de descanso
            } else {
                this.ejercicioActualIndex++; // Avanza al siguiente ejercicio
                this.enDescanso = false; // Regresa a estado de ejercicio
                this.tiempoDescanso = 30; // Reinicia el tiempo de descanso
                clearInterval(this.intervaloDescanso); // Limpia el intervalo
            }
        } else if (!this.enDescanso && this.ejercicioActualIndex === this.ejercicios.length - 1) {
            // Rutina completada
            this.rutinaTerminada = true;
        }
    }

    iniciarDescanso(): void {
        this.intervaloDescanso = setInterval(() => {
            if (this.tiempoDescanso > 0) {
                this.tiempoDescanso--;
            } else {
                clearInterval(this.intervaloDescanso); // Para el temporizador
                this.terminarEjercicio(); // Avanza automáticamente al siguiente ejercicio
            }
        }, 1000); // Actualiza cada segundo
    }

    get ejercicioActual(): Ejercicio | null {
        return this.ejercicios[this.ejercicioActualIndex] || null;
    }

    ngOnDestroy(): void {
        clearInterval(this.intervaloDescanso); // Limpia el intervalo al destruir el componente
    }
}