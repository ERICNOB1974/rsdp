import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionService } from '../publicaciones/publicacion.service';
import { Publicacion } from '../publicaciones/publicacion';
import { AuthService } from '../autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../usuarios/usuario';
import { Comentario } from '../publicaciones/Comentario';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  usuariosPublicadores: { [key: number]: Usuario } = {};
  page = 0;
  pageSize = 5;
  loading = false;

  comentarios: { [key: number]: Comentario[] } = {}; // Para almacenar comentarios por publicación
  likesCount: { [key: number]: number } = {}; // Para almacenar cantidad de likes por publicación
  isLiked: { [key: number]: boolean } = {}; // Para almacenar estado del like por publicación
  newComments: { [key: number]: string } = {}; // Para manejar nuevos comentarios
  showCommentInput: { [key: number]: boolean } = {}; // Para mostrar/ocultar input de comentarios


  constructor(
    private publicacionService: PublicacionService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadPublicaciones();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !this.loading) {
      this.loadPublicaciones();
    }
  }

  loadPublicaciones() {
    if (this.loading) return;
    this.loading = true;
    const userId = this.authService.getUsuarioId();
    if (userId) {
      this.publicacionService.publicacionesAmigos2(+userId).subscribe(
        (dataPackage) => {
          if (dataPackage.status === 200) {
            const newPublicaciones = dataPackage.data as Publicacion[];

            // Verificamos que no haya publicaciones duplicadas
            newPublicaciones.forEach(pub => {
              if (!this.publicaciones.some(p => p.id === pub.id)) {
                this.publicaciones.push(pub);
                this.loadLikesInfo(pub.id);
                this.loadComentarios(pub.id);
              }
            });

            this.loadUsuariosPublicadores(newPublicaciones);
            this.page++;
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error loading publicaciones:', error);
          this.loading = false;
        }
      );
    }
  }

  loadLikesInfo(publicacionId: number) {
    // Cargar si el usuario dio like
    this.publicacionService.estaLikeada(publicacionId).subscribe(dataPackage => {
      this.isLiked[publicacionId] = dataPackage.data as unknown as boolean;
    });
    
    // Cargar cantidad de likes
    this.publicacionService.cantidadLikes(publicacionId).subscribe(dataPackage => {
      this.likesCount[publicacionId] = dataPackage.data as unknown as number;
    });
  }
  
  loadComentarios(publicacionId: number) {
    this.publicacionService.comentarios(publicacionId).subscribe(dataPackage => {
      if (dataPackage.status === 200) {
        this.comentarios[publicacionId] = dataPackage.data as Comentario[];
      }
    });
  }

  toggleLike(publicacionId: number, event: Event) {
    event.stopPropagation();
    if (this.isLiked[publicacionId]) {
      this.publicacionService.sacarLike(publicacionId).subscribe(() => {
        this.isLiked[publicacionId] = false;
        this.likesCount[publicacionId]--;
      });
    } else {
      this.publicacionService.darLike(publicacionId).subscribe(() => {
        this.isLiked[publicacionId] = true;
        this.likesCount[publicacionId]++;
      });
    }
  }

  submitComment(publicacionId: number, event: Event) {
    event.stopPropagation();
    if (this.newComments[publicacionId]?.trim()) {
      this.publicacionService.comentar(publicacionId, this.newComments[publicacionId]).subscribe(
        () => {
          // Recargar comentarios después de agregar uno nuevo
          this.loadComentarios(publicacionId);
          this.newComments[publicacionId] = '';
          this.showCommentInput[publicacionId] = false;
        }
      );
    }
  }
  loadUsuariosPublicadores(publicaciones: Publicacion[]) {
    publicaciones.forEach(publicacion => {
      this.publicacionService.publicadoPor(publicacion.id).subscribe(
        (dataPackage) => {
          if (dataPackage.status === 200) {
            this.usuariosPublicadores[publicacion.id] = dataPackage.data as unknown as Usuario;
          }
        }
      );
    });
  }




  goToPublicacionDetail(id: number) {
    this.router.navigate(['/publicacion', id]);
  }


  goToPerfil(usuarioId: number) {
    this.router.navigate(['/perfil', usuarioId]); // Ajusta la ruta según tu configuración de enrutamiento
  }

}