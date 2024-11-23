import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-editar-comunidad',
  standalone: true,
  imports: [FormsModule, NgIf], // Agrega FormsModule aquí
  templateUrl: './editarComunidad.component.html',
  styleUrls: ['./editarComunidad.component.css', '../css/crear.component.css']
})
export class EditarComunidadComponent implements OnInit {
  comunidad!: Comunidad; // Comunidad que se va a editar
  idComunidad!: number;
  formatoValido: boolean = true;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null;


  constructor(
    private route: ActivatedRoute,
    private comunidadService: ComunidadService,
    private router: Router,
    private snackBar: MatSnackBar
  ) { }

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



  onFileSelect(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file) {
      // Verificar si el archivo es una imagen o un video
      if (validImageTypes.includes(file.type)) {
        this.formatoValido = true; // El formato es válido
        this.archivoSeleccionado = file;

        // Detecta el tipo de archivo
        const fileType = file.type.split('/')[0];
        this.tipoArchivo = fileType; // 'image' o 'video'

        // Crea la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.vistaPreviaArchivo = reader.result;
          this.comunidad.imagen = reader.result as string; // Aquí obtenemos la cadena base64
        };
        reader.readAsDataURL(file);

        this.comunidad.imagen = file;

      } else {
        this.formatoValido = false; // El formato no es válido
        this.vistaPreviaArchivo = null; // No se muestra la vista previa
        alert('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF).');
      }
    }
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevenir el comportamiento predeterminado
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Asegurarse de que existen archivos en el evento
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]; // Toma el primer archivo
      const inputEvent = { target: { files: [file] } }; // Crea un evento similar al del input
      this.onFileSelect(inputEvent); // Reutiliza tu lógica para manejar el archivo
    }
  }


  eliminarArchivo(): void {
    this.vistaPreviaArchivo = null;
    this.formatoValido = false;
    this.comunidad.imagen = '';

  }
}