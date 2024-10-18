import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'perfil.component.html',
  styleUrls: ['perfil.component.css']
})
export class PerfilComponent implements OnInit {
  usuario!: Usuario;  // Objeto para almacenar los datos del perfil que se está viendo
  idUsuario!: number;  // ID del perfil que se está viendo (viene de la URL o lógica del componente)
  idUsuarioAutenticado!: number;  // ID del usuario autenticado
  esMiPerfil: boolean = false;  // Para determinar si es el perfil del usuario autenticado

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private authService: AuthService,  // Inyecta el AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.obtenerUsuarioAutenticado();
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPerfil();  // Cargar la información del perfil
  }

  // Obtén el usuario autenticado desde el AuthService
  // obtenerUsuarioAutenticado(): void {
  //   const usuarioAutenticado = this.authService.obtenerUsuarioAutenticado();
  //   if (usuarioAutenticado) {
  //     this.idUsuarioAutenticado = usuarioAutenticado.id;
  //   }
  //   console.log('soyyy '+this.idUsuarioAutenticado);
  // }

  // Cargar el perfil que se está viendo
  cargarPerfil(): void {
    // Aquí puedes obtener el ID del perfil desde la ruta (dependiendo de cómo definas tus rutas)
    // Supondré que el ID del perfil se asigna a `this.idUsuario`.
    this.usuarioService.get(this.idUsuario).subscribe((dataPackage: DataPackage) => {
      if (dataPackage.status === 200) {
        this.usuario = dataPackage.data as Usuario;

        // Verifica si el usuario autenticado está viendo su propio perfil
        this.esMiPerfil = this.usuario.id == this.idUsuarioAutenticado;
        console.log(this.esMiPerfil);
      } else {
        console.error(dataPackage.message);
      }
    });
  }

  // Navega a la página de edición de perfil
  editarPerfil(): void {
    this.router.navigate(['/perfilEditable', this.usuario?.id]);
  }

  // Lógica para enviar una solicitud de amistad
  enviarSolicitudDeAmistad(): void {
    this.usuarioService.enviarSolicitudAmistad(this.idUsuarioAutenticado, this.usuario.id).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          alert('Solicitud de amistad enviada exitosamente.');
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        console.error('Error enviando solicitud de amistad:', error);
        alert('Error al enviar la solicitud de amistad.');
      }
    });
  }
}
