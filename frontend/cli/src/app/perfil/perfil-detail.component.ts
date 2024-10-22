import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Publicacion } from '../publicaciones/publicacion';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-perfil-detail',
  standalone: true,
  imports: [FormsModule], // Agrega FormsModule aquí
  templateUrl: './perfil-detail.component.html',
  styleUrls: ['./perfil-detail.component.css']
})
export class PerfilDetailComponent implements OnInit {
  usuario!: Usuario; // Usuario que se va a editar
  idUsuario!: number;
  idUsuarioAutenticado!:number;

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
      this.router.navigate(['/perfil/', this.usuario.id]); // Navegar de vuelta si se cancela
    }, error => {
      console.error('Error al actualizar el perfil', error);
      this.snackBar.open('Error al actualizar el perfil', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  cancelar(): void {
    this.router.navigate(['/perfil/', this.usuario.id]); // Navegar de vuelta si se cancela
  }


}
