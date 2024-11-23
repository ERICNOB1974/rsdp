import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../autenticacion/auth.service';
import { Observable } from 'rxjs';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-perfil-detail',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './perfil-detail.component.html',
  styleUrls: ['./perfil-detail.component.css', '../css/crear.component.css']
})
export class PerfilDetailComponent implements OnInit {
  usuario!: Usuario;
  idUsuarioAutenticado!: number;
  archivoSeleccionado!: File;
  vistaPreviaArchivo: string | ArrayBuffer | null = null;
  nombreUsuarioOriginal: string = '';

  // Flags de validación
  formatoValido: boolean = true;
  nombreUsuarioExistente: boolean = false;
  campoModificado: boolean = false;
  nombreUsuarioValido: boolean = true;
  nombreRealValido: boolean = true;
  


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
        this.nombreUsuarioOriginal = this.usuario.nombreUsuario; // Guarda el nombre original
      } else {
        console.error(dataPackage.message);
      }
    });
  }

  guardarCambios(): void {
    if (this.verificarHabilitacionBotonGuardar()) {
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
  }

  cancelar(): void {
    this.router.navigate(['/perfil/', this.usuario.id]);
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file) {
      if (validImageTypes.includes(file.type)) {
        this.formatoValido = true;
        this.archivoSeleccionado = file;
        this.campoModificado = true;  

        const reader = new FileReader();
        reader.onload = () => {
          this.vistaPreviaArchivo = reader.result;
          this.usuario.fotoPerfil = reader.result as string;
        };
        reader.readAsDataURL(file);
      } else {
        this.formatoValido = false;
        this.vistaPreviaArchivo = null;
        alert('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF).');
      }
    }
  }

  validarNombreUsuario(): void {
    if (this.usuario.nombreUsuario.length < 3) {
      this.nombreUsuarioValido = false;
      this.nombreUsuarioExistente = false;
      return;
    }
    
    
    this.usuarioService.existeNombreUsuarioMenosElActual(this.usuario.nombreUsuario,this.nombreUsuarioOriginal)
    .subscribe(response => {
        this.nombreUsuarioExistente = <boolean><unknown>response.data;
        this.nombreUsuarioValido = !this.nombreUsuarioExistente;
      });
  }
  
  verificarHabilitacionBotonGuardar(): boolean {
    this.nombreRealValido = this.usuario.nombreReal.length >= 3;
    this.nombreUsuarioValido = this.usuario.nombreUsuario.length >= 3 && !this.nombreUsuarioExistente;
    
    console.log("Nombre real valido"+this.nombreRealValido); 
    console.log("Nombre usuario valido"+this.nombreUsuarioValido);
    console.log("Campo modificado"+this.campoModificado);
    return this.campoModificado && this.nombreRealValido && this.nombreUsuarioValido;
  }

  onFieldChange(): void {
    this.campoModificado = true;
    this.validarNombreUsuario();
    this.nombreRealValido = this.usuario.nombreReal.length >= 3;
  }
  
  irACambiarCorreo(): void {
    this.router.navigate(['/cambiar-correo']);
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
    this.usuario.fotoPerfil = '';
  }

}
