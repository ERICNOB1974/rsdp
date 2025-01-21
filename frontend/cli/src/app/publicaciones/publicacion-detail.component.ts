import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; // Para permitir navegar de vuelta
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicacionService } from './publicacion.service';
import { Publicacion } from './publicacion';
import { FormsModule } from '@angular/forms';
import { DataPackage } from '../data-package';
import { Comentario } from '../comentarios/Comentario';
import { AuthService } from '../autenticacion/auth.service';
import { Usuario } from '../usuarios/usuario';
import { UsuarioService } from '../usuarios/usuario.service';
import { MatDialog } from '@angular/material/dialog';
import { ComentarioService } from '../comentarios/comentario.service';



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
  usuario: Usuario | null = null;


  constructor(
    private route: ActivatedRoute,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private location: Location,
    private comentarioService: ComentarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService
  ) { }

  isLiked: boolean = false;
  showCommentInput: boolean = true;
  comment: string = '';
  comments: string[] = [];
  comentarios: Comentario[] = [];
  usuariosLike: Usuario[] = [];
  displayedComments: Comentario[] = [];
  commentsToShow: number = 4; // Número de comentarios a mostrar inicialmente
  isOwnPublication: boolean = false;
  cantidadPorPagina: number = 10;
  noMasUsuarios = false;
  pageSize: number = 2  ;

  currentCommentId: number | null = null;
  showReplyInput: boolean = false; // Para mostrar u ocultar el campo de respuesta
  replyText: string = ''; // El texto de la respuesta

  loadedMoreReplies: { [key: number]: boolean } = {};  // Usamos el id del comentario como clave

  respuestaPaginacion: { 
    [comentarioId: number]: { 
      paginaActual: number; 
      totalRespuestas: number; 
      respuestas: Comentario[]; 
      mostrarRespuestas: boolean; // Propiedad adicional
    } 
  } = {};
  
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
      this.comentarioService.comentar(this.publicacion.id, this.comment).subscribe(
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
            },
            respuestas: []
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
    this.getUsuario();
    //this.cargarComentarios();
    //this.traerParticipantes();
    this.updateDisplayedComments();
    this.checkIfOwnPublication();

  }

 

  cargarComentarios(): void {
    this.comentarioService.obtenerComentariosPorPublicacion(this.publicacion.id)
      .subscribe({
        next: (dataPackage: DataPackage) => {
          if (dataPackage && dataPackage.status === 200 && dataPackage.data) {
            this.comentarios = dataPackage.data as Comentario[];
  
            // Inicializar la estructura de paginación para cada comentario
            this.comentarios.forEach(comentario => {
              this.respuestaPaginacion[comentario.id] = {
                paginaActual: 0,
                totalRespuestas: 0,
                respuestas: [],
                mostrarRespuestas: true
              };
              this.contarRespuestas(comentario);
              this.cargarRespuestas(comentario);
            });
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
  
  getUsuario() {
    this.usuarioService.get(Number(this.authService.getUsuarioId())).subscribe(dataPackage => {
      this.usuario = dataPackage.data as Usuario;
    }, error => {
      console.error('Error al cargar el usuario:', error);
      this.usuario = null; // Para manejar el estado de error
    });
  }

  
  // Función para activar el campo de respuesta
  toggleCommentInput(commentId: number): void {
    if (this.currentCommentId === commentId) {
      // Si ya estamos respondiendo al mismo comentario, ocultamos el campo
      this.showReplyInput = !this.showReplyInput;
    } else {
      // Si estamos respondiendo a un comentario diferente, mostramos el campo
      this.currentCommentId = commentId;
      this.showReplyInput = true;
    }
    this.replyText = ''; // Limpiamos el texto de la respuesta cuando abrimos el campo
  }

    // Función para enviar la respuesta
    submitReply(commentId: number): void {
      if (this.replyText.trim()) {
        // Creamos la respuesta
        const respuesta: Comentario = {
          id: 0, // Este ID debe ser generado por el backend
          texto: this.replyText,
          fecha: new Date(),
          usuario: {
            id: Number(this.authService.getUsuarioId()),
            nombreUsuario: this.authService.getNombreUsuario() || '',
            nombreReal: this.authService.getNombreReal() || '',
            fechaNacimiento: new Date(),
            fechaDeCreacion: new Date(),
            correoElectronico: '',
            contrasena: '',
            descripcion: '',
            latitud: 0,
            longitud: 0,
            fotoPerfil: this.authService.getFotoPerfil() || ''
          },
          respuestas: []
        };
  
        // Llamamos al servicio para enviar la respuesta
        this.comentarioService.responderComentario(commentId, this.replyText).subscribe(
          (response: any) => {
            // Añadimos la respuesta al comentario correspondiente
            const comentario = this.comentarios.find(c => c.id === commentId);
            if (comentario) {
              comentario.respuestas = comentario.respuestas || [];
              comentario.respuestas.push(respuesta); // Añadimos la nueva respuesta
            }
  
            // Limpiamos el campo y ocultamos la respuesta
            this.replyText = '';
            this.showReplyInput = false;
          },
          error => {
            console.error('Error al enviar la respuesta:', error);
            // Manejo de errores
          }
        );
      }
    }

/*  cargarRespuestas(comentario: Comentario) {
  this.comentarioService.getRespuestas(comentario.id, 0, this.pageSize)
    .subscribe(dataPackage => {
      comentario.respuestas = dataPackage.data as Comentario[]; // Asegúrate de que `data` sea de tipo `Respuesta[]`
      console.log("Respuestas recibidas:", dataPackage.data);
    });
}  */

    cargarRespuestas(comentario: Comentario): void {
      const paginacion = this.respuestaPaginacion[comentario.id];
      if(paginacion.paginaActual!=0){
        this.loadedMoreReplies[comentario.id] = true;  // Marca que se ha cargado más respuestas
      }
      this.comentarioService.getRespuestas(comentario.id, paginacion.paginaActual, this.pageSize)
        .subscribe(dataPackage => {
          // Asegúrate de que `data` contiene las respuestas como un array
          const respuestas = dataPackage.data as Comentario[]; // Cast para acceder como un array de Respuesta
          if (Array.isArray(respuestas) && respuestas.length > 0) {
            paginacion.respuestas.push(...respuestas);
            paginacion.paginaActual = paginacion.paginaActual+1;
          }
        }, error => {
          console.error(`Error al cargar respuestas para el comentario ${comentario.id}:`, error);
        });
    }

contarRespuestas(comentario: Comentario) {
  this.comentarioService.contarRespuestas(comentario.id)
    .subscribe(dataPackage => {
      if (dataPackage && typeof dataPackage.data === 'number') {
        //comentario.cantidadRespuestas = dataPackage.data; // Asignar el número de miembros
        this.respuestaPaginacion[comentario.id].totalRespuestas = dataPackage.data;

      }
    },
    (error) => {
      console.error(`Error al traer la cantidad de respuestas del comentario ${comentario.id}:`, error);
    }
  );
} 


cargarMasRespuestas(comentario: Comentario): void {
  if (this.respuestaPaginacion[comentario.id].respuestas.length < this.respuestaPaginacion[comentario.id].totalRespuestas) {
    this.cargarRespuestas(comentario);
  }
}




respuestasRestantes(comentarioId: number): number {
  const paginacion = this.respuestaPaginacion[comentarioId];
  if (!paginacion) return 0; // Si no hay datos, no hay respuestas restantes
  return paginacion.totalRespuestas - paginacion.respuestas.length;
}

hayMasRespuestas(comentarioId: number): boolean {
  return this.respuestasRestantes(comentarioId) > 0;
}

toggleReplies(comentarioId: number): void {
  const paginacion = this.respuestaPaginacion[comentarioId];

  if (paginacion.mostrarRespuestas) {
    // Si estaba mostrando, ocultar pero conservar las primeras respuestas
    this.loadedMoreReplies[comentarioId] = false;  // Marca que se ha cargado más respuestas
    paginacion.mostrarRespuestas = false;
    if (paginacion.respuestas.length > this.pageSize) {
      // Conservar solo las primeras respuestas
      paginacion.respuestas = paginacion.respuestas.slice(0, this.pageSize);
    }
  } else {
    // Mostrar y mantener las respuestas existentes
    paginacion.mostrarRespuestas = true;
  }
}
    
    
}