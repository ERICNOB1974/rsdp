import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Publicacion } from './publicacion';
import { PublicacionService } from './publicacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['../css/crear.component.css'],
  templateUrl: 'crearPublicacion.component.html'
})
export class CrearPublicacionComponent implements OnInit {

  publicacion!: Publicacion;
  formatoValido: boolean = false;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null; // Para mostrar la vista previa de la imagen o video
  tipo!: 'comunidad' | 'publicacion'; // Tipo de flujo (registro o recuperación)
  idComunidad: number | null = null;

  constructor(private router: Router,
    private publicacionService: PublicacionService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar
  ) {
    const tipoParam = this.route.snapshot.queryParamMap.get('tipo') as 'comunidad' | 'publicacion';
    this.tipo = tipoParam;

  }

  ngOnInit(): void {
    this.publicacion = <Publicacion>{
      texto: '',
      file: ''
    };

    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] as 'comunidad' | 'publicacion';
      if (this.tipo === 'comunidad') {
        this.idComunidad = +params['idComunidad']; // El '+' convierte el string a número
      }
    });
  }

  cancel(): void {
    this.location.back()
  }

  savePublicacion(): void {
    this.publicacion.fechaDeCreacion = new Date().toISOString();
    if (this.tipo === 'comunidad' && this.idComunidad) {
      this.publicacionService.publicarEnComunidad(this.publicacion, this.idComunidad).subscribe(() => {
        this.location.back()
      });
    } else {
      this.publicacionService.saveConCreador(this.publicacion).subscribe(() => {
        this.location.back()
      });
    }
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const validVideoTypes = ['video/mp4'];

    if (file) {
      // Verificar si el archivo es una imagen o un video
      if (validImageTypes.includes(file.type) || validVideoTypes.includes(file.type)) {
        this.formatoValido = true; // El formato es válido
        this.archivoSeleccionado = file;

        // Detecta el tipo de archivo
        const fileType = file.type.split('/')[0];
        this.tipoArchivo = fileType; // 'image' o 'video'

        // Crea la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.vistaPreviaArchivo = reader.result;
          this.publicacion.file = reader.result as string; // Aquí obtenemos la cadena base64
        };
        reader.readAsDataURL(file);

        this.publicacion.file = file;

      } else {
        this.formatoValido = false; // El formato no es válido
        this.vistaPreviaArchivo = null; // No se muestra la vista previa
        this.snackBar.open('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF) o videos (MP4).', 'Cerrar', {
          duration: 3000,
        });
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


  publicacionValida(): boolean {
    if (this.publicacion.texto)
      return true
    if (this.publicacion.file && this.formatoValido)
      return true
    return false
  }

  eliminarArchivo(): void {
    this.vistaPreviaArchivo = null;
    this.tipoArchivo = '';
    this.formatoValido = false;
    this.publicacion.file = '';
  }
}

