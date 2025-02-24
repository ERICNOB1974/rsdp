import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionService } from '../publicaciones/publicacion.service';
import { AuthService } from '../autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../usuarios/usuario';
import { Comentario } from '../comentarios/Comentario';
import { PublicacionDto } from './PublicacionesDto';
import { ComentarioService } from '../comentarios/comentario.service';
import { WebSocketService } from '../tiempoReal/webSocketService';
import { IdEncryptorService } from '../idEcnryptorService';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css', './tiempoReal.css']
})
export class HomeComponent implements OnInit {
  publicaciones: PublicacionDto[] = [];
  usuariosPublicadores: { [key: number]: Usuario } = {};
  loading: boolean = false;
  noMasPublicaciones: boolean = false;
  cantidadPorPagina: number = 6;
  currentIndexPublicacionesHome: number = 0
  comentarios: { [key: number]: Comentario[] } = {}; // Para almacenar comentarios por publicación
  likesCount: { [key: number]: number } = {}; // Para almacenar cantidad de likes por publicación
  isLiked: { [key: number]: boolean } = {}; // Para almacenar estado del like por publicación
  newComments: { [key: number]: string } = {}; // Para manejar nuevos comentarios
  showCommentInput: { [key: number]: boolean } = {}; // Para mostrar/ocultar input de comentarios

  mostrarBotonActualizar: boolean = false; // Controlar visibilidad del botón

  posicionBoton = { top: 100, left: 500 }; // Posición inicial del botón

  constructor(
    private publicacionService: PublicacionService,
    private comentarioService: ComentarioService,
    private router: Router,
    private authService: AuthService,
    private webSocketService: WebSocketService,
    private idEncryptorService: IdEncryptorService

  ) { }

  ngOnInit() {
    this.webSocketService.connect(); // Establecer conexión con WebSocket

    // Suscribirse a nuevas publicaciones
    this.webSocketService.nuevasPublicaciones$.subscribe(() => {
      
      this.mostrarBotonActualizar = true; // Mostrar botón cuando haya una nueva publicación
      //this.moverBoton(); // Activar movimiento cuando aparezca

    });
    this.loadPublicaciones();
  }

  loadPublicaciones() {
    if (this.loading || this.noMasPublicaciones) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
    this.loading = true;

    const userId = this.authService.getUsuarioId(); // Obtener el ID del usuario autenticado

    if (userId) {
      this.publicacionService
        .todasLasPublicaciones(this.currentIndexPublicacionesHome, this.cantidadPorPagina)
        .subscribe(
          (dataPackage) => {
            if (dataPackage.status === 200) {
              const newPublicaciones = dataPackage.data as PublicacionDto[];
              if (newPublicaciones && newPublicaciones.length > 0) {
                // Evitar duplicados en la lista
                newPublicaciones.forEach((pub) => {
                  if (!this.publicaciones.some((p) => p.publicacion.id === pub.publicacion.id)) {
                    this.publicaciones.push(pub); // Agregar nueva publicación
                    this.loadComentarios(pub.publicacion.id); // Información de comentarios
                  }
                });

                this.currentIndexPublicacionesHome++; // Incrementar índice para la siguiente carga
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

  actualizarPublicaciones(): void {
    //window.location.reload()
    this.currentIndexPublicacionesHome=0;
    this.publicaciones = [];
    this.loadPublicaciones(); // Recargar publicaciones
    this.mostrarBotonActualizar = false; // Ocultar el botón después de cargar

  }

 /*  moverBoton(): void {
    // Mueve el botón a una posición aleatoria cada 2 segundos
    const interval = setInterval(() => {
      if (!this.mostrarBotonActualizar) {
        clearInterval(interval); // Detener el movimiento si el botón está oculto
        return;
      }

      const maxX = window.innerWidth - 150; // Ancho máximo (ajustado al tamaño del botón)
      const maxY = window.innerHeight - 50; // Alto máximo

      this.posicionBoton = {
        top: Math.random() * maxY,
        left: Math.random() * maxX,
      };
    }, 2000); // Intervalo de movimiento
  } */


  loadComentarios(publicacionId: number) {
    this.comentarioService.obtenerComentariosPorPublicacion(publicacionId).subscribe(dataPackage => {
      if (dataPackage.status === 200) {
        // Asumiendo que dataPackage.data es un array de comentarios con su usuario
        this.comentarios[publicacionId] = dataPackage.data as Comentario[];
      }
    });
  }

  toggleLike(dtoPublicacion: PublicacionDto, event: Event) {
    event.stopPropagation();
    if (dtoPublicacion.estaLikeada) {
      this.publicacionService.sacarLike(dtoPublicacion.publicacion.id).subscribe(() => {
        dtoPublicacion.estaLikeada = false;
        dtoPublicacion.likes--
      });
    } else {
      this.publicacionService.darLike(dtoPublicacion.publicacion.id).subscribe(() => {
        dtoPublicacion.estaLikeada = true;
        dtoPublicacion.likes++;
      });
    }
  }



  submitComment(publicacionId: number, event: Event) {
    event.stopPropagation();
    if (this.newComments[publicacionId]?.trim()) {
      this.comentarioService.comentar(publicacionId, this.newComments[publicacionId]).subscribe(
        () => {
          // Recargar comentarios después de agregar uno nuevo
          this.loadComentarios(publicacionId);
          this.newComments[publicacionId] = '';
          this.showCommentInput[publicacionId] = false;
        }
      );
    }
  }




  goToPublicacionDetail(id: number) {
    const idCifrado = this.idEncryptorService.encodeId(id);

    this.router.navigate(['/publicacion', idCifrado]);
  }


  goToPerfil(usuarioId: number) {
    const idCifrado = this.idEncryptorService.encodeId(usuarioId);

    this.router.navigate(['/perfil', idCifrado]); // Ajusta la ruta según tu configuración de enrutamiento
  }

  goToComunidad(comunidadId: number): void {
    // Lógica para redirigir a la comunidad
    const idCifrado = this.idEncryptorService.encodeId(comunidadId);

    this.router.navigate(['/comunidad-muro', idCifrado]);
  }

  onScroll(): void {
    const container = document.querySelector('.publicaciones-container') as HTMLElement;
    if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) { // Margen de 100px antes del final
      this.loadPublicaciones();
    }
  }
}