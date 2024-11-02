import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-perfil-detail',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './perfil-detail.component.html',
  styleUrls: ['./perfil-detail.component.css']
})
export class PerfilDetailComponent implements OnInit {
  usuario!: Usuario;
  idUsuarioAutenticado!: number;
  formatoValido: boolean = true;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null;

  constructor(
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.usuarioService.get(this.idUsuarioAutenticado).subscribe((dataPackage) => {
      if (dataPackage.status === 200) {
        this.usuario = dataPackage.data as Usuario;
      } else {
        console.error(dataPackage.message);
      }
    });
  }

  guardarCambios(): void {
    this.usuarioService.save(this.usuario).subscribe(() => {
      this.snackBar.open('Perfil actualizado con éxito', 'Cerrar', {
        duration: 3000,
      });
      this.router.navigate(['/perfil/', this.usuario.id]);
    }, error => {
      console.error('Error al actualizar el perfil', error);
      this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  cancelar(): void {
    this.router.navigate(['/perfil/', this.usuario.id]);
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
          this.usuario.fotoPerfil = reader.result as string; // Aquí obtenemos la cadena base64
        };
        reader.readAsDataURL(file);

        this.usuario.fotoPerfil = file;

      } else {
        this.formatoValido = false; // El formato no es válido
        this.vistaPreviaArchivo = null; // No se muestra la vista previa
        alert('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF) o videos (MP4).');
      }
    }
  }
}
