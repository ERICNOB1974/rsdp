import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';
import { AuthService } from '../usuarios/auntenticacion.service';

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
  relacion: string ='';

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private authService: AuthService,  // Inyecta el AuthService
    private router: Router
  ) {}

  ngOnInit(): void {
    this.obtenerUsuarioAutenticado();
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPerfil();  // Cargar la información del perfil
  }

  // Obtén el usuario autenticado desde el AuthService
  obtenerUsuarioAutenticado(): void {
    const usuarioAutenticado = this.authService.obtenerUsuarioAutenticado();
    if (usuarioAutenticado) {
      this.idUsuarioAutenticado = usuarioAutenticado.id;
    }
  }

  // Cargar el perfil que se está viendo
  cargarPerfil(): void {
    // Aquí puedes obtener el ID del perfil desde la ruta (dependiendo de cómo definas tus rutas)
    // Supondré que el ID del perfil se asigna a `this.idUsuario`.
    this.usuarioService.get(this.idUsuario).subscribe((dataPackage: DataPackage) => {
      if (dataPackage.status === 200) {
        this.usuario = dataPackage.data as Usuario;

        // Verifica si el usuario autenticado está viendo su propio perfil
        this.esMiPerfil = this.usuario.id == this.idUsuarioAutenticado;
        if(!this.esMiPerfil){
          this.verificarRelacion();
        }
      } else {
        console.error(dataPackage.message);
      }
    });
  }

  // Navega a la página de edición de perfil
  editarPerfil(): void {
    this.router.navigate(['/perfilEditable', this.usuario?.id]);
  }

  verificarRelacion(): void {
    if (this.idUsuarioAutenticado && this.idUsuario) {
      // Verificar si son amigos
      this.usuarioService.sonAmigos(this.idUsuarioAutenticado, this.idUsuario).subscribe((dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          let amigos = dataPackage.data;
          if(amigos){
            this.relacion='amigos'
            return;
          }
        }else{
        console.error('Error al verificar si son amigos:', dataPackage.message);
      }
    });
    
    // Verificar si hay una solicitud de amistad pendiente
    this.usuarioService.verificarSolicitudAmistad(this.idUsuarioAutenticado, this.idUsuario).subscribe((dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          let solicitudAmistadPendiente = dataPackage.data;
          if(solicitudAmistadPendiente){
            this.relacion='solicitudEnviada'
            return;
          }
        }else{
        console.error('Error al verificar si son amigos:', dataPackage.message);
      }
    });
    this.usuarioService.verificarSolicitudAmistad(this.idUsuario,this.idUsuarioAutenticado).subscribe((dataPackage: DataPackage) => {
      if (dataPackage.status === 200) {
        let solicitudAmistadPendiente = dataPackage.data;
        if(solicitudAmistadPendiente){
          this.relacion='solicitudPendiente'
          return;
        }
      }else{
      console.error('Error al verificar si son amigos:', dataPackage.message);
    }
  });
  this.relacion='noSonAmigos';
  }
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
        alert('Error al enviar la solicitud de amistad.');
      }
    });
  }


  gestionarSolicitud(aceptar: boolean): void {
    this.usuarioService.gestionarSolicitudAmistad(this.usuario.id,this.idUsuarioAutenticado, aceptar).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          const mensaje = aceptar ? 'Solicitud de amistad aceptada exitosamente.' : 'Solicitud de amistad rechazada exitosamente.';
          alert(mensaje);
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        const mensaje = aceptar ? 'Error al aceptar la solicitud de amistad.' : 'Error al rechazar la solicitud de amistad.';
        alert(mensaje);
      }
    });
  }
}
