import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-editar-comunidad',
  standalone: true,
  imports: [FormsModule], // Agrega FormsModule aquí
  templateUrl: './editarComunidad.component.html',
  styleUrls: ['./editarComunidad.component.css']
})
export class EditarComunidadComponent implements OnInit {
  comunidad!: Comunidad; // Comunidad que se va a editar
  idComunidad!: number;

  constructor(
    private route: ActivatedRoute,
    private comunidadService: ComunidadService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.idComunidad = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarComunidad();
  }

  cargarComunidad(): void {
    this.comunidadService.get(this.idComunidad).subscribe((dataPackage) => {
      if (dataPackage.status === 200) {
        this.comunidad = dataPackage.data as Comunidad;
      } else {
        console.error(dataPackage.message);
      }
    });
  }

  guardarCambios(): void {
    this.comunidadService.save(this.comunidad).subscribe(() => {
      this.snackBar.open('Comunidad actualizada con éxito', 'Cerrar', {
        duration: 3000,
      });
      this.router.navigate(['/comunidades']); // Volver a la vista de comunidades
    }, error => {
      console.error('Error al actualizar la comunidad', error);
      this.snackBar.open('Error al actualizar la comunidad', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  cancelar(): void {
    this.router.navigate(['/comunidades']); // Navegar de vuelta si se cancela
  }
}
