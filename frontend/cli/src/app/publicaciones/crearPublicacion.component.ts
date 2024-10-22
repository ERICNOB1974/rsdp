import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Publicacion } from './publicacion';
import { PublicacionService } from './publicacion.service';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['../css/crear.component.css'],
  templateUrl: 'crearPublicacion.component.html'
})
export class CrearPublicacionComponent implements OnInit {

  publicacion!: Publicacion;
  formatoValido: boolean = true;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null; // Para mostrar la vista previa de la imagen o video

  constructor(private router: Router, private publicacionService: PublicacionService) { }

  ngOnInit(): void {
    this.publicacion = <Publicacion>{
      texto: '',
      file: ''
    };

  }

  cancel(): void {
    this.router.navigate(['/']);
  }

  savePublicacion(): void {
    this.publicacion.fechaDeCreacion= new Date().toISOString();
    this.publicacionService.saveConCreador(this.publicacion).subscribe();
    location.reload(); 
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
        alert('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF) o videos (MP4).');
      }
    }
  }

  publicacionValida(): boolean {
    return !(!this.publicacion.texto && !this.publicacion.file || !this.formatoValido);
  }
}
