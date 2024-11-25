import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutinaService } from './rutina.service';
import { Rutina } from './rutina';
import { Dia } from './dia';
import { Ejercicio } from './ejercicio';
import { DataPackage } from '../data-package';
import { CommonModule, Location } from '@angular/common';
import { RutinaEstadoService } from './rutinaEstado.component';

@Component({
    selector: 'app-ejercicios',
    standalone: true,
    templateUrl: './rutinasEjercicio.component.html',
    styleUrls: ['./rutinasEjercicio.component.css'],
    imports: [CommonModule]
})
export class RutinasEjercicioComponent implements OnInit, OnDestroy {
    rutina!: Rutina;
    dias: Dia[] = [];
    diaActualIndex: number = 0; 
    ejercicioActualIndex: number = 0; 
    rutinaTerminada: boolean = false; // Para controlar si la rutina ha terminado
    diaActual!: Dia;
    ejercicioActual!: Ejercicio | null;
    tiempoDescanso: number = 30; // Tiempo de descanso en segundos
    intervaloDescanso: any; // Variable para almacenar el intervalo del descanso
    enDescanso: boolean = false;
    diaFinalizado: boolean = false;

    constructor(
        private rutinaService: RutinaService,
        private route: ActivatedRoute, 
        private rutinaEstadoService: RutinaEstadoService,
        private location: Location
    ) {}

    ngOnInit(): void {
        const idRutina = Number(this.route.snapshot.paramMap.get('id'));
    
        // Verifica si se debe reiniciar la rutina
        if (this.rutinaEstadoService.getReiniciarRutina()) {
            console.info('Reiniciando rutina...');
            this.rutinaEstadoService.clearReiniciarRutina(); // Limpia el estado después de verificarlo
            this.obtenerRutina(idRutina, -1); // Comienza desde el primer día
        } else {
            // Carga el progreso actual de la rutina
            this.rutinaService.obtenerProgresoActual(idRutina).subscribe((dataPackage: DataPackage) => {
                const diaActualId = dataPackage.data as unknown as number;
                this.obtenerRutina(idRutina, diaActualId);
            });
        }
    }
    
    obtenerRutina(idRutina: number, diaActualId: number): void {
        console.info('Solicitando rutina con ID:', idRutina);
        this.rutinaService.getRutinaYejercicios(idRutina).subscribe((dataPackage: DataPackage) => {
            if (dataPackage.status === 200) {
                this.rutina = dataPackage.data as Rutina;
                this.dias = this.rutina.dias || [];
                console.info('Rutina obtenida:', this.rutina);
    
                this.dias.sort((a, b) => (a.orden || 0) - (b.orden || 0));
    
                this.dias.forEach(dia => {
                    const ejercicios: Ejercicio[] = [];
                    dia.ejerciciosRepeticiones?.forEach(ejercicio => {
                        ejercicios.push({
                            nombre: ejercicio.nombre,
                            repeticiones: ejercicio.repeticiones,
                            series: ejercicio.series,
                            tiempo: '',
                            descripcion: ejercicio.descripcion,
                            imagen: ejercicio.imagen,
                            tipo: 'series',
                            orden: ejercicio.orden
                        });
                    });
                    dia.ejerciciosTiempo?.forEach(ejercicio => {
                        ejercicios.push({
                            nombre: ejercicio.nombre,
                            repeticiones: null,
                            series: null,
                            tiempo: ejercicio.tiempo,
                            descripcion: ejercicio.descripcion,
                            imagen: ejercicio.imagen,
                            tipo: 'resistencia',
                            orden: ejercicio.orden
                        });
                    });
                    dia.tipo = ejercicios.length > 0 ? 'trabajo' : 'descanso';
                    dia.ejercicios = ejercicios.sort((a, b) => (a.orden || 0) - (b.orden || 0));
                });
    
                // Configura el día actual según el progreso y reinicia el estado `diaFinalizado`
                this.diaFinalizado = false;
    
                if (diaActualId === -1) {
                    this.diaActualIndex = 0;
                } else {
                    this.diaActualIndex = this.dias.findIndex(dia => dia.id === diaActualId) + 1;
                }
    
                if (this.dias.length > 0 && this.diaActualIndex < this.dias.length) {
                    this.diaActual = this.dias[this.diaActualIndex];
                    this.ejercicioActualIndex = 0;
                    this.ejercicioActual = this.diaActual.ejercicios[this.ejercicioActualIndex] || null;
                    console.info('Día actual después del reinicio:', this.diaActual);
                    console.info('Ejercicio actual después del reinicio:', this.ejercicioActual);
                } else {
                    this.diaActualIndex = 0;
                    this.diaActual = this.dias[this.diaActualIndex];
                    this.ejercicioActualIndex = 0;
                    this.ejercicioActual = this.diaActual.ejercicios[0] || null;
                }
            } else {
                console.error("Error al obtener la rutina:", dataPackage.message);
            }
        });
    }
    
    
    terminarEjercicio(): void {
        console.info('Terminando ejercicio...');
    
        if (!this.rutinaTerminada) {
            if (this.ejercicioActualIndex < this.diaActual.ejercicios.length - 1) {
                if (!this.enDescanso) {
                    console.info('Iniciando descanso...');
                    this.enDescanso = true;
                    this.iniciarDescanso();
                } else {
                    console.info('Finalizando descanso, pasando al siguiente ejercicio...');
                    this.ejercicioActualIndex++;
                    this.ejercicioActual = this.diaActual.ejercicios[this.ejercicioActualIndex] || null;
                    this.enDescanso = false;
                    this.tiempoDescanso = 30;
                    clearInterval(this.intervaloDescanso);
                    console.info('Ejercicio actual actualizado:', this.ejercicioActual);
                }
            } else if (this.diaActualIndex < this.dias.length - 1) {
                this.rutinaService.crearRelacionDiaFinalizado(<number>this.diaActual.id).subscribe();
                this.diaFinalizado = true;
            } else {
                console.info('Rutina completada.');
                this.rutinaService.crearRelacionDiaFinalizado(<number>this.diaActual.id).subscribe();
                this.rutinaTerminada = true;
            }
        }
    }

    iniciarDescanso(): void {
        this.intervaloDescanso = setInterval(() => {
            if (this.tiempoDescanso > 0) {
                this.tiempoDescanso--;
            } else {
                clearInterval(this.intervaloDescanso);
                this.terminarEjercicio(); // Llama a terminarEjercicio para continuar con el siguiente ejercicio
            }
        }, 1000); // 1000 ms = 1 segundo
    }

    siguienteDia(): void {
        if (!this.rutinaTerminada && this.diaActualIndex < this.dias.length - 1) {
            this.diaActualIndex++;
            this.diaActual = this.dias[this.diaActualIndex];
            this.ejercicioActualIndex = 0; // Reiniciar el índice de ejercicios
            this.ejercicioActual = this.diaActual.ejercicios[this.ejercicioActualIndex] || null;
            console.info('Cambiando a siguiente día:', this.diaActual);
        }
    }

    get ejercicioActualInfo(): Ejercicio | null {
        return this.ejercicioActual;
    }

    get diaActualInfo(): Dia | null {
        return this.diaActual;
    }

    ngOnDestroy(): void {
        console.info('Componente destruido.');
    }

    esUltimoEjercicio(): boolean {
        return this.ejercicioActualIndex === this.diaActual.ejercicios.length - 1;
    }

    continuarConSiguienteDia(): void {
        this.diaFinalizado = false;
        this.siguienteDia();
    }

    volver(): void {
        this.location.back(); 
    }

}