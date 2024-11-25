import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; // Para permitir navegar de vuelta
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicacionService } from './publicacion.service';
import { Publicacion } from './publicacion';
import { FormsModule } from '@angular/forms';
import { DataPackage } from '../data-package';
import { Comentario } from './Comentario';
import { AuthService } from '../autenticacion/auth.service';
import { Usuario } from '../usuarios/usuario';
import { UsuarioService } from '../usuarios/usuario.service';
import { MatDialog } from '@angular/material/dialog';



@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicacion-detail.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./publicacion-detail.component.css'],
  standalone: true
})
export class PublicacionDetailComponent implements OnInit {

  publicacion!: Publicacion;
  isActive: boolean = false;
  publicadoPor!: Usuario;
  numeroLikes!: number;
  usuariosLikes: any[] = []; // Lista de usuarios que dieron like
  loadingLikes: boolean = false; // Estado de carga
  currentPageLikes: number = 0; // Página actual para paginación
  @ViewChild('modalLikes') modalLikes!: TemplateRef<any>;


  constructor(
    private route: ActivatedRoute,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private location: Location,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  isLiked: boolean = false;
  showCommentInput: boolean = false;
  comment: string = '';
  comments: string[] = [];
  comentarios: Comentario[] = [];
  usuariosLike: Usuario[] = [];
  displayedComments: Comentario[] = [];
  commentsToShow: number = 4; // Número de comentarios a mostrar inicialmente
  isOwnPublication: boolean = false;
  cantidadPorPagina: number = 10;
  noMasUsuarios = false;

  toggleLike() {
    if (this.isLiked) {
      this.publicacionService.sacarLike(this.publicacion.id).subscribe();
      this.numeroLikes--;
    } else {
      this.publicacionService.darLike(this.publicacion.id).subscribe();
      this.numeroLikes++;
      // this.cantidadLikes();
    }
    this.isLiked = !this.isLiked;
  }



  abrirModalLikes(): void {
    this.currentPageLikes = 0;
    this.usuariosLikes = [];
    this.noMasUsuarios=false;
    this.cargarUsuariosLikes();

    this.dialog.open(this.modalLikes, {
      width: '500px',
      height: '400px', // Limita la altura del modal
      data: {
        usuariosLikes: this.usuariosLikes,
        cargarUsuariosLikes: this.cargarUsuariosLikes.bind(this),
      },
    });
  }

  cargarUsuariosLikes(): void {
    if (this.loadingLikes || this.noMasUsuarios) {
      return; // Evita duplicar peticiones si ya está cargando o no hay más usuarios
    }
  
    this.loadingLikes = true;
    this.usuarioService.usuariosLikePublicacion(this.publicacion.id, this.currentPageLikes, this.cantidadPorPagina).subscribe(
      (response) => {
        const usuarios = response.data as Usuario[]; // Aquí "data" es el array esperado
        if (Array.isArray(usuarios) && usuarios.length > 0) {

          this.usuariosLikes = [...this.usuariosLikes, ...usuarios];
          this.currentPageLikes++;
          this.loadingLikes = false;
          if (usuarios.length < this.cantidadPorPagina) {
            this.noMasUsuarios = true;
          }
        } else {
          this.noMasUsuarios = true;  // No hay más resultados
        }
        this.loadingLikes = false;  // Desactivamos el indicador de carga
      },
      (error) => {
        console.error('Error al cargar todas las rutinas:', error);
        this.loadingLikes = false;
      }
      ,);
  }


  onScroll(event: any): void {
    const element = event.target as HTMLElement;
  
    // Detectar si está cerca del final del scroll
    const nearBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 50;
  
    if (nearBottom && !this.loadingLikes && !this.noMasUsuarios) {
      this.cargarUsuariosLikes();
    }
  }
  
  cerrarModal(): void {
    this.dialog.closeAll();

  }

  checkIfOwnPublication(): void {
    const currentUserId = this.authService.getUsuarioId();
    this.publicacionService.publicadoPor(this.publicacion.id).subscribe(
      (dataPackage: DataPackage) => {
        const usuario = <Usuario><unknown>dataPackage.data;
        this.publicadoPor = usuario;
        this.isOwnPublication = (this.publicadoPor.id === Number(currentUserId));
      });

  }

  cantidadLikes(): void {
    this.publicacionService.cantidadLikes(this.publicacion.id).subscribe((dataPackage: DataPackage) => {
      this.numeroLikes = <number><unknown>dataPackage.data;
    })
  }

  submitComment() {
    if (this.comment.trim()) {
      this.publicacionService.comentar(this.publicacion.id, this.comment).subscribe(
        (response: any) => {
          const usuarioId = this.authService.getUsuarioId();
          const idUsuarioAutenticado = Number(usuarioId);
          const newComment: Comentario = {
            id: 0, // Asegúrate de que el servidor devuelve el ID del nuevo comentario
            texto: this.comment,
            fecha: new Date(),
            usuario: {
              id: idUsuarioAutenticado /* ID del usuario actual */,
              nombreUsuario: this.authService.getNombreUsuario() || '',
              nombreReal: '',
              fechaNacimiento: new Date(),
              fechaDeCreacion: new Date(),
              correoElectronico: '',
              contrasena: '',
              descripcion: '',
              latitud: 0,
              longitud: 0,
              fotoPerfil: ''
            }
          };

          // Añadir el nuevo comentario al principio de la lista
          this.comentarios.unshift(newComment);

          // Limpiar el campo de texto y ocultar el input
          this.comment = '';
          this.showCommentInput = false;

          // Actualizar los comentarios mostrados
          this.updateDisplayedComments();
        },
        error => {
          console.error('Error al enviar el comentario:', error);
          // Aquí puedes añadir lógica para manejar el error, como mostrar un mensaje al usuario
        }
      );
    }
  }
  ngOnInit(): void {
    this.getPublicacion();
    //this.cargarComentarios();
    //this.traerParticipantes();
    this.updateDisplayedComments();
    this.checkIfOwnPublication();

  }

  cargarComentarios(): void {
    this.publicacionService.comentarios(this.publicacion.id)
      .subscribe({
        next: (dataPackage: DataPackage) => {
          if (dataPackage && dataPackage.status === 200 && dataPackage.data) {
            this.comentarios = dataPackage.data as Comentario[];
          } else {
            console.error('Error al cargar los comentarios:', dataPackage.message);
          }
        },
        error: (error) => {
          console.error('Error al comunicarse con el servicio de comentarios:', error);
        }
      });
  }

  deletePublicacion(): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      this.publicacionService.eliminar(this.publicacion.id).subscribe(
        () => {
          this.snackBar.open('Publicación eliminada con éxito', 'Cerrar', { duration: 3000 });
          this.location.back()
        },
        error => {
          console.error('Error al eliminar la publicación:', error);
          this.snackBar.open('Error al eliminar la publicación', 'Cerrar', { duration: 3000 });
        }
      );
    }
  }
  updateDisplayedComments() {
    this.displayedComments = this.comentarios.slice(0, this.commentsToShow);
  }

  loadMoreComments() {
    this.commentsToShow += 4;
    this.updateDisplayedComments();
  }
  getPublicacion(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
      this.router.navigate(['publicacion/crear']);
    }
    else {
      this.publicacionService.get(parseInt(id)).subscribe(async dataPackage => {
        this.publicacion = <Publicacion>dataPackage.data;
        this.publicacionService.estaLikeada(this.publicacion.id).subscribe(dataPackage => {
          this.isLiked = <boolean><unknown>dataPackage.data;
          this.checkIfOwnPublication();
          this.cargarComentarios();
          this.cantidadLikes();
        });
      });
    }
  }

  goBack(): void {
    this.location.back();
  }


}