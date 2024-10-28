import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';
import { AuthService } from '../autenticacion/auth.service';
import { Publicacion } from '../publicaciones/publicacion';
import { PublicacionService } from '../publicaciones/publicacion.service';

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
  publicaciones!: Publicacion[];
  relacion: string ='';
isOwnPublication: any;

  constructor(
    private route: ActivatedRoute,
    private usuarioService: UsuarioService,
    private publicacionService: PublicacionService,

    private authService: AuthService,  // Inyecta el AuthService
    private router: Router
  ) { }

  ngOnInit(): void {
    const usuarioId = this.authService.getUsuarioId();
    this.idUsuarioAutenticado = Number(usuarioId);
    this.idUsuario = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarPerfil();  // Cargar la información del perfil
    this.getPublicaciones();

  }

  // Obtén el usuario autenticado desde el AuthService


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
    this.router.navigate(['/perfilEditable', this.idUsuarioAutenticado]);
  }

  verificarRelacion(): void {
    if (this.idUsuarioAutenticado && this.idUsuario) {
      // Verificar si son amigos
      this.usuarioService.sonAmigos(this.idUsuarioAutenticado,this.idUsuario).subscribe((dataPackage: DataPackage) => {
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
          window.location.reload(); // Recargar la página
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        alert('Error al enviar la solicitud de amistad.');
      }
    });
  }

    // Lógica para enviar una solicitud de amistad
    eliminarAmigo(): void {
      this.usuarioService.eliminarAmigo(this.usuario.id).subscribe({
        next: (dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            alert('Amigo eliminado exitosamente.');
            window.location.reload(); // Recargar la página
          } else {
            alert('Error: ' + dataPackage.message);
          }
        },
        error: (error) => {
          alert('Error al eliminar amigo.');
        }
      });
    }

    cancelarSolicitudDeAmistad(): void {
      this.usuarioService.cancelarSolicitudAmistad(this.usuario.id).subscribe({
        next: (dataPackage: DataPackage) => {
          if (dataPackage.status === 200) {
            alert('Solicitud canceladda exitosamente.');
            window.location.reload(); // Recargar la página
          } else {
            alert('Error: ' + dataPackage.message);
          }
        },
        error: (error) => {
          alert('Error al cancelar solicitud de amistad.');
        }
      });
    }


  getPublicaciones(): void {
    this.publicacionService.publicaciones(this.idUsuario).subscribe({
      next: (dataPackage) => {
        if (dataPackage.status === 200 && Array.isArray(dataPackage.data)) {
          this.publicaciones = dataPackage.data;
        } else {
          console.error('Error al obtener las publicaciones:', dataPackage.message);
          this.publicaciones = []; // Asigna un array vacío en caso de error
        }
      },
      error: (error) => {
        console.error('Error al obtener las publicaciones:', error);
        this.publicaciones = []; // Asigna un array vacío en caso de error
      }
    });
  }



  gestionarSolicitud(aceptar: boolean): void {
    this.usuarioService.gestionarSolicitudAmistad(this.usuario.id,this.idUsuarioAutenticado, aceptar).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          const mensaje = aceptar ? 'Solicitud de amistad aceptada exitosamente.' : 'Solicitud de amistad rechazada exitosamente.';
          alert(mensaje);
          window.location.reload(); // Recargar la página
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

  confirmarEliminarPublicacion(idPublicacion: number): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      this.eliminarPublicacion(idPublicacion);
    }
  }
  
  eliminarPublicacion(idPublicacion: number): void {
    this.publicacionService.eliminar(idPublicacion).subscribe({
      next: (dataPackage: DataPackage) => {
        if (dataPackage.status === 200) {
          alert('Publicación eliminada exitosamente.');
          // Actualizar la lista de publicaciones
          this.getPublicaciones();
        } else {
          alert('Error: ' + dataPackage.message);
        }
      },
      error: (error) => {
        console.error('Error al eliminar la publicación:', error);
        alert('Error al eliminar la publicación.');
      }
    });
  }
  irADetallePublicacion(idPublicacion: number): void {
    this.router.navigate(['/publicacion', idPublicacion]);
  }
}

