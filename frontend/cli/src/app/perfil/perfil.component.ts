import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Importa FormsModule
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // Asegúrate de incluir FormsModule aquí
  templateUrl: 'perfil.component.html',
  styleUrls: ['perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario; // Objeto para almacenar los datos del usuario
  idUsuario: number = 1185; // Cambiar este valor según la lógica de autenticación

  constructor(private usuarioService: UsuarioService,
              private router: Router) {}

  ngOnInit(): void {
      this.cargarPerfil(); // Cargar la información del perfil al iniciar
  }

  cargarPerfil(): void {
      this.usuarioService.get(this.idUsuario).subscribe((dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
              this.usuario = dataPackage.data as Usuario; // Cargar los datos del usuario
          } else {
              console.error(dataPackage.message);
          }
      });
  }

  editarPerfil(): void {
    this.router.navigate(['/perfil', this.usuario?.id]); // Navega a la ruta de edición
  }
}
