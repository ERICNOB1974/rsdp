import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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



@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicacion-detail.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./heart.component.css'],
  standalone: true
})
export class PublicacionDetailComponent implements OnInit {

  publicacion!: Publicacion;
  isActive: boolean = false;
  usuarioId!: number;

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private publicacionService: PublicacionService, // Servicio para obtener el evento por ID
    private location: Location, // Para manejar la navegación
    private router: Router,
    private snackBar: MatSnackBar,
    private el: ElementRef,
    private authService: AuthService

  ) { }

  isLiked: boolean = false;
  showCommentInput: boolean = false;
  comment: string = '';
  comments: string[] = [];
  comentarios: Comentario[] = [];
  displayedComments: Comentario[] = [];
  commentsToShow: number = 4; // Número de comentarios a mostrar inicialmente
  isOwnPublication: boolean = false;

  toggleLike() {
    if (this.isLiked) {
      this.publicacionService.sacarLike(this.publicacion.id).subscribe();
    } else {
      this.publicacionService.darLike(this.publicacion.id).subscribe();
    }
    this.isLiked = !this.isLiked;
  }

  checkIfOwnPublication(): void {
    const currentUserId = this.authService.getUsuarioId();
    this.publicacionService.publicadoPor(this.publicacion.id).subscribe(
      (dataPackage: DataPackage) => {
         const usuario = <Usuario><unknown>dataPackage.data;
         this.usuarioId=usuario.id;
        this.isOwnPublication = (this.usuarioId === Number(currentUserId));
      });

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
              longitud: 0
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
          this.router.navigate(['/publicaciones']); // O a donde quieras redirigir después de eliminar
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
        });
      });
    }
  }

  goBack(): void {
    this.location.back();
  }


}
