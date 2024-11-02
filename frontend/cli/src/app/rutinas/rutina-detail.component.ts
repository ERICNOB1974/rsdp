import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { RutinaService } from './rutina.service';
import { Rutina } from './rutina';
import { CommonModule, Location } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataPackage } from '../data-package';

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

  constructor(private rutinaService: RutinaService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.rutinaService.getRutinaOrdenada(id).subscribe((response: DataPackage) => {
      this.rutina = response.data;
      this.dias = this.rutina.dias;
      this.isDayVisible = new Array(this.dias.length).fill(false); // Inicializar el estado de cada día como no visible
    });
  }

  toggleDayVisibility(index: number): void {
    this.isDayVisible[index] = !this.isDayVisible[index];
  }
  
  iniciarRutina() {
    const rutinaId = this.route.snapshot.paramMap.get('id')!;
    this.rutinaService.crearRelacionRealizaRutina(Number(rutinaId)).subscribe(
      response => {
        // Aquí puedes manejar el éxito de la operación, por ejemplo, redirigir o mostrar un mensaje.
        console.log('Rutina iniciada exitosamente', response);
      },
      error => {
        // Aquí puedes manejar el error, como mostrar un mensaje de error
        console.error('Error al iniciar la rutina', error);
      }
    );
    this.router.navigate([`rutinas/hacer/${rutinaId}`]); 
  }
  
  
}
