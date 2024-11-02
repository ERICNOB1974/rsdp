import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RutinaService } from './rutina.service';
import { Rutina } from './rutina';
import { Dia } from './dia';
import { Ejercicio } from './ejercicio';
import { DataPackage } from '../data-package';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ejercicios',
    standalone: true,
    templateUrl: './rutinasEjercicio.component.html',
    styleUrls: ['./rutinasEjercicio.component.css'],
    imports: [CommonModule]
})
export class RutinasEjercicioComponent implements OnInit {
    rutina!: Rutina;
    dias: Dia[] = [];
    diaActualIndex: number = 0;
    ejercicioActualIndex: number = 0;
    rutinaTerminada: boolean = false;
    diaActual!: Dia;
    ejercicioActual!: Ejercicio | null;
    mostrarPantallaFinalizacion: boolean = false;
    mensajeFinalizacion: string = '';
    mostrarComenzarDia: boolean = true;

    constructor(
        private rutinaService: RutinaService,
        private route: ActivatedRoute
    ) {}

    ngOnInit(): void {
        const idRutina = Number(this.route.snapshot.paramMap.get('id'));
        this.obtenerRutina(idRutina);
    }

    obtenerRutina(idRutina: number): void {
        this.rutinaService.getRutinaYejercicios(idRutina).subscribe((dataPackage: DataPackage) => {
            if (dataPackage.status === 200) {
                this.rutina = dataPackage.data as Rutina;
                this.dias = (this.rutina.dias || []).sort((a, b) => (a.orden || 0) - (b.orden || 0));

                // Filtrar y preparar los días
                this.dias.forEach(dia => {
                    dia.ejercicios = [
                        ...(dia.ejerciciosRepeticiones || []).map(e => ({ ...e, tipo: 'series' as 'series' })),
                        ...(dia.ejerciciosTiempo || []).map(e => ({ ...e, tipo: 'resistencia' as 'resistencia' }))
                    ].sort((a, b) => (a.orden || 0) - (b.orden || 0));
                    dia.tipo = dia.ejercicios.length > 0 ? 'trabajo' : 'descanso';
                });

                this.establecerProgresoUsuario();
            }
        });
    }

    establecerProgresoUsuario(): void {
        const diasOrdenados = this.dias.filter(dia => dia.tipo === 'trabajo').map(dia => dia.id);
        let diaEncontrado = false;

        const comprobarDias = (index: number) => {
            if (index < diasOrdenados.length) {
                this.rutinaService.verificarDiaFinalizado(diasOrdenados[index]!).subscribe((dataPackage: DataPackage) => {
                    if (!dataPackage.data && !diaEncontrado) {
                        diaEncontrado = true;
                        this.diaActualIndex = this.dias.findIndex(d => d.id === diasOrdenados[index]);
                        this.diaActual = this.dias[this.diaActualIndex];
                        this.mostrarComenzarDia = this.diaActual.tipo === 'trabajo';
                    } else if (dataPackage.data) {
                        // Si todos los días están finalizados
                        if (index === diasOrdenados.length - 1) {
                            this.rutinaTerminada = true;
                        }
                    }
                    // Llamar recursivamente para el siguiente día
                    comprobarDias(index + 1);
                });
            }
        };

        comprobarDias(0);
    }

    comenzarDia(): void {
        if (this.diaActual.tipo === 'trabajo') {
            this.mostrarComenzarDia = false;
            this.ejercicioActualIndex = 0;
            this.ejercicioActual = this.diaActual.ejercicios[this.ejercicioActualIndex] || null;
        }
    }

    terminarEjercicio(): void {
        if (this.ejercicioActualIndex < this.diaActual.ejercicios.length - 1) {
            this.ejercicioActualIndex++;
            this.ejercicioActual = this.diaActual.ejercicios[this.ejercicioActualIndex];
        } else {
            this.finalizarDia();
        }
    }

    finalizarDia(): void {
        this.rutinaService.crearRelacionDiaFinalizado(this.diaActual.id!).subscribe(() => {
            this.calcularProximoDia();
        });
    }

    calcularProximoDia(): void {
        let diasDeDescanso = 0;
        let proximoDiaTrabajo: Dia | null = null;
    
        // Contamos los días de descanso después del día actual
        for (let i = this.diaActualIndex + 1; i < this.dias.length; i++) {
            if (this.dias[i].tipo === 'descanso') {
                diasDeDescanso++;
                this.rutinaService.crearRelacionDiaFinalizado(this.dias[i].id!).subscribe();
            } else {
                proximoDiaTrabajo = this.dias[i];
                break;
            }
        }
    
        console.log('Días de descanso:', diasDeDescanso);
        console.log('Próximo día de trabajo:', proximoDiaTrabajo);
    
        if (proximoDiaTrabajo) {
            this.diaActualIndex++;
            this.diaActual = proximoDiaTrabajo;
            this.ejercicioActualIndex = 0;
            this.ejercicioActual = this.diaActual.ejercicios[this.ejercicioActualIndex] || null;
            this.mostrarComenzarDia = this.diaActual.tipo === 'trabajo';
        } else {
            this.generarMensajeFinalizacion(diasDeDescanso, proximoDiaTrabajo);
        }
    }
        
    generarMensajeFinalizacion(diasDeDescanso: number, proximoDiaTrabajo: Dia | null): void {
        this.mensajeFinalizacion = diasDeDescanso > 0 
            ? `Terminaste el día de trabajo. Los siguientes ${diasDeDescanso} día(s) son de descanso. Vuelve dentro de ${diasDeDescanso + 1} días.`
            : proximoDiaTrabajo
                ? 'El siguiente día es de trabajo. Vuelve mañana para continuar.'
                : '¡Felicidades! Has terminado todos los días de tu rutina.';
    
        this.mostrarPantallaFinalizacion = true;
    }
    
    siguienteDia(): void {
        // Verifica si hay un día de descanso antes de avanzar al siguiente día de trabajo
        if (this.diaActualIndex < this.dias.length - 1) {
            let diasDeDescanso = 0;
    
            // Contamos los días de descanso después del día actual
            for (let i = this.diaActualIndex + 1; i < this.dias.length; i++) {
                if (this.dias[i].tipo === 'descanso') {
                    diasDeDescanso++;
                } else {
                    // Si encontramos un día de trabajo, salimos del bucle
                    break;
                }
            }
    
            // Crear relaciones para cada día de descanso
            for (let i = 1; i <= diasDeDescanso; i++) {
                this.rutinaService.crearRelacionDiaFinalizado(this.dias[this.diaActualIndex + i].id!).subscribe();
            }
    
            // Ahora, avanzar al siguiente día de trabajo
            this.diaActualIndex += diasDeDescanso + 1; // Avanzamos al día de trabajo
            if (this.diaActualIndex < this.dias.length) {
                this.diaActual = this.dias[this.diaActualIndex];
                this.mostrarPantallaFinalizacion = false;
                this.mostrarComenzarDia = this.diaActual.tipo === 'trabajo';
    
                if (this.diaActual.tipo === 'trabajo') {
                    this.ejercicioActualIndex = 0;
                    this.ejercicioActual = this.diaActual.ejercicios[this.ejercicioActualIndex] || null;
                }
            } else {
                this.rutinaTerminada = true; // Si no hay más días de rutina
            }
        } else {
            this.rutinaTerminada = true; // Si estamos en el último día
        }
    }
    
}
