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
  loading: boolean = false;
  noMasPublicaciones: boolean = false;
  cantidadPorPagina: number = 3;
  currentIndexEventosDisponibles:number=0
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



  loadPublicaciones() {
    if (this.loading || this.noMasPublicaciones) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
    this.loading = true;
  
    const userId = this.authService.getUsuarioId(); // Obtener el ID del usuario autenticado
  
    if (userId) {
      console.log("aaaaaa",this.currentIndexEventosDisponibles+"  "+this.cantidadPorPagina);
      this.publicacionService
        .publicacionesHome(+userId, this.currentIndexEventosDisponibles, this.cantidadPorPagina)
        .subscribe(
          (dataPackage) => {
            if (dataPackage.status === 200) {
              console.log("pepepee",dataPackage.data);
              const newPublicaciones = dataPackage.data as Publicacion[];
              if (newPublicaciones && newPublicaciones.length > 0) {
                // Evitar duplicados en la lista
                newPublicaciones.forEach((pub) => {
                  if (!this.publicaciones.some((p) => p.id === pub.id)) {
                    this.publicaciones.push(pub); // Agregar nueva publicación
                    this.loadLikesInfo(pub.id); // Información de likes
                    this.loadComentarios(pub.id); // Información de comentarios
                  }
                });
  
                this.loadUsuariosPublicadores(newPublicaciones); // Cargar datos de los usuarios publicadores
                this.currentIndexEventosDisponibles++; // Incrementar índice para la siguiente carga
              } else {
                this.noMasPublicaciones = true; // No hay más publicaciones para cargar
              }
            }
            this.loading = false; // Finaliza la carga
          },
          (error) => {
            console.error('Error loading publicaciones:', error);
            this.loading = false; // Manejo de errores
          }
        );
    } else {
      console.warn('No se encontró el ID del usuario autenticado.');
      this.loading = false;
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

  onScroll(): void {
    const container = document.querySelector('.publicaciones-container') as HTMLElement;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) { // Margen de 100px antes del final
      this.loadPublicaciones();
    }
  }
}