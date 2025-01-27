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
import { UsuarioEsAmigoDTO } from '../arrobar/UsuarioEsAmigoDTO';
import { ArrobarService } from '../arrobar/arrobar.service';
import { catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from 'rxjs';



@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicacion-detail.component.html',
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['./publicacion-detail.component.css', '../css/arroba.css'],
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
  usuariosMencionados: Usuario[] = [];
  usuariosFiltrados: UsuarioEsAmigoDTO[] = [];
  searchingArroba = false;
  searchFailedArroba = false;


  constructor(
    private route: ActivatedRoute,
    private publicacionService: PublicacionService,
    private usuarioService: UsuarioService,
    private location: Location,
    private comentarioService: ComentarioService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private authService: AuthService,
    private arrobaService: ArrobarService
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
  pageSize: number = 2;

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
      estaLikeado: boolean;
      cantidadLikes: number;
    }
  } = {};

  ngOnInit(): void {
    this.getPublicacion();
    this.getUsuario();
    //this.cargarComentarios();
    //this.traerParticipantes();
    this.updateDisplayedComments();
    this.checkIfOwnPublication();

  }


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
    this.noMasUsuarios = false;
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
      //console.info(this.publicacion.id, this.comment);
      this.comentarioService.comentar(this.publicacion.id, this.comment).subscribe(
        (response: any) => {
          const usuarioId = this.authService.getUsuarioId();
          const idUsuarioAutenticado = Number(usuarioId);
          //console.info("ID comentario ",  response.data.id);
          const comentarioAux = response.data as Comentario
          console.info(comentarioAux)
          const newComment: Comentario = {
            id: response.data.id,
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
            cantidadLikes: 0,
            estaLikeado: false,
            respuestas: []
          };

          this.arrobar(this.comment, response.data.id);

          // Añadir el nuevo comentario al principio de la lista
          this.comentarios.unshift(newComment);

       

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
                mostrarRespuestas: true,
                estaLikeado: false,// this.comentarioService.estaLikeada(comentario.id) as unknown as boolean,
                cantidadLikes: 0//this.comentarioService.cantidadLikes(comentario.id) as unknown as number
              };


              this.comentarioService.cantidadLikes(comentario.id).subscribe(dataPackage => {
                comentario.cantidadLikes = dataPackage.data as unknown as number;
              })
              this.comentarioService.estaLikeada(comentario.id).subscribe(dataPackage => {
                comentario.estaLikeado = dataPackage.data as unknown as boolean;
              })

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


  toggleLikeComentario(comentario: any): void {
    const estabaLikeado = comentario.estaLikeado;
    if (estabaLikeado) {
      this.comentarioService.sacarLike(comentario.id).subscribe();
    } else {
      this.comentarioService.darLike(comentario.id).subscribe();
    }
    comentario.estaLikeado = !estabaLikeado;
    comentario.cantidadLikes += estabaLikeado ? -1 : 1;
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
      this.comentarioService.responderComentario(commentId, this.replyText).subscribe(
        (response: any) => {
          const usuarioId = this.authService.getUsuarioId();
          const idUsuarioAutenticado = Number(usuarioId);
  
          const nuevaRespuesta: Comentario = {
            id: response.data.id, // ID de la respuesta desde el backend
            texto: this.replyText,
            fecha: new Date(),
            usuario: {
              id: idUsuarioAutenticado,
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
            respuestas: [], // Las respuestas no tienen sub-respuestas por defecto
            cantidadLikes: 0,
            estaLikeado: false
          };

          this.arrobar(this.replyText, response.data.id);

          // Encuentra el comentario original
          const comentarioOriginal = this.comentarios.find(c => c.id === commentId);
  
          if (!comentarioOriginal) {
            console.error(`No se encontró el comentario con ID: ${commentId}`);
            return; // Salir si no se encuentra
          }
  
          // Asegúrate de que 'respuestas' esté inicializado
          if (!comentarioOriginal.respuestas) {
            comentarioOriginal.respuestas = [];
          }
  
          // Agrega la nueva respuesta al array
          comentarioOriginal.respuestas.unshift(nuevaRespuesta);
  
          // Inicializa o actualiza la estructura de paginación
          if (!this.respuestaPaginacion[commentId]) {
            this.respuestaPaginacion[commentId] = {
              paginaActual: 1, // Inicializamos la página actual como 1
              totalRespuestas: 1, // Iniciamos con 1 respuesta
              respuestas: [nuevaRespuesta], // Agregamos la nueva respuesta
              mostrarRespuestas: true, // Por defecto mostramos las respuestas
              estaLikeado: false, // Por defecto no está likeado
              cantidadLikes: 0 // Sin likes iniciales
            };
          } else {
            this.respuestaPaginacion[commentId].respuestas.unshift(nuevaRespuesta);
            this.respuestaPaginacion[commentId].totalRespuestas++;
          }
  
          // Limpiar el campo de texto y ocultar el input de respuesta
          this.replyText = '';
          this.showReplyInput = false;
  
          // Opcional: mostrar una notificación
          this.snackBar.open('Respuesta agregada con éxito', 'Cerrar', { duration: 3000 });
        },
        error => {
          console.error('Error al responder al comentario:', error);
          this.snackBar.open('Error al agregar la respuesta', 'Cerrar', { duration: 3000 });
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
    if (paginacion.paginaActual != 0) {
      this.loadedMoreReplies[comentario.id] = true;  // Marca que se ha cargado más respuestas
    }
    this.comentarioService.getRespuestas(comentario.id, paginacion.paginaActual, this.pageSize)
      .subscribe(dataPackage => {
        // Asegúrate de que `data` contiene las respuestas como un array
        const respuestas = dataPackage.data as Comentario[]; // Cast para acceder como un array de Respuesta
        if (Array.isArray(respuestas) && respuestas.length > 0) {
          paginacion.respuestas.push(...respuestas);
          paginacion.paginaActual = paginacion.paginaActual + 1;
          respuestas.forEach(respuesta => {
            // Inicializar valores en las respuestas
            this.comentarioService.cantidadLikes(respuesta.id).subscribe(dataPackage => {
              respuesta.cantidadLikes = dataPackage.data as unknown as number;
            });
            this.comentarioService.estaLikeada(respuesta.id).subscribe(dataPackage => {
              respuesta.estaLikeado = dataPackage.data as unknown as boolean;
            });
          });
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

  puedeEliminarComentario(comentario: Comentario): boolean {
    const usuarioId = this.authService.getUsuarioId();
    const esAutorDelComentario = comentario.usuario.id === Number(usuarioId);
    const esCreadorDeLaPublicacion = this.publicadoPor.id === Number(usuarioId);
    // Puede eliminar si es el autor del comentario o el creador de la publicación
    return esAutorDelComentario || esCreadorDeLaPublicacion;
  }

  eliminarComentario(comentarioId: number): void {
    this.comentarioService.eliminar(comentarioId).subscribe(
      () => {
        // Filtrar comentarios principales
        this.comentarios = this.comentarios.filter(c => c.id !== comentarioId);
  
        // Filtrar respuestas en los comentarios existentes
        this.comentarios.forEach(comentario => {
          if (comentario.respuestas) {
            // Eliminar respuesta si existe
            comentario.respuestas = comentario.respuestas.filter(respuesta => respuesta.id !== comentarioId);
  
            // Si se utiliza paginación, actualizar el mapa de respuestas
            if (this.respuestaPaginacion[comentario.id]) {
              // Filtrar respuesta eliminada en el mapa de respuestas paginadas
              this.respuestaPaginacion[comentario.id].respuestas = this.respuestaPaginacion[comentario.id].respuestas.filter(r => r.id !== comentarioId);
  
              // Actualizar el contador de respuestas restantes
              this.respuestaPaginacion[comentario.id].totalRespuestas--;
            }
          }
        });
  
        // Mostrar mensaje de éxito
        this.snackBar.open('Comentario eliminado con éxito', 'Cerrar', { duration: 3000 });
      },
      error => {
        console.error('Error al eliminar el comentario:', error);
        this.snackBar.open('Error al eliminar el comentario', 'Cerrar', { duration: 3000 });
      }
    );
  }
  

  private extraerUsuariosEtiquetados(texto: string): Usuario[] {
    const regex = /@(\w+)/g;

    const usuariosEtiquetados = [];
    let match;

    while ((match = regex.exec(texto)) !== null) {
      const nombreUsuario = match[1];
      const usuario = this.usuariosMencionados.find(u => u.nombreUsuario === nombreUsuario);

      if (usuario) {
        usuariosEtiquetados.push(usuario); // Agregar el usuario encontrado
      }
    }
    return usuariosEtiquetados;
  }


  // Método para agregar un usuario mencionado
  addUsuarioComentario(usuario: UsuarioEsAmigoDTO): void {
    const words = this.comment.split(' ');
    words[words.length - 1] = `@${usuario.usuario.nombreUsuario}`;
    this.comment = words.join(' ');
    this.usuariosMencionados.push(usuario.usuario); // Agregar el usuario encontrado

    //this.usuariosFiltrados = [];
  }
  addUsuarioRespuesta(usuario: UsuarioEsAmigoDTO): void {
    const words = this.replyText.split(' ');
    words[words.length - 1] = `@${usuario.usuario.nombreUsuario}`;
    this.replyText = words.join(' ');
    this.usuariosMencionados.push(usuario.usuario); // Agregar el usuario encontrado

    //this.usuariosFiltrados = [];
  }


  arrobar(texto: string, idComentario: number) {
    const usuariosEtiquetados = this.extraerUsuariosEtiquetados(texto);
    // Llamar al servicio de arrobar para cada usuario etiquetado
    usuariosEtiquetados.forEach((usuario) => {
      this.arrobaService.arrobarEnComentario(usuario.id, idComentario).subscribe({
        next: () => {
          console.log(`Usuario ${usuario.nombreUsuario} etiquetado en el comentario.`);
        },
        error: (err) => {
          console.error(`Error al etiquetar a ${usuario.nombreUsuario}:`, err);
        }
      });
    });
  }


  searchUsuarios = (text$: Observable<string>): Observable<UsuarioEsAmigoDTO[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter((term) => term.startsWith('@') && term.length > 1),
      tap(() => (this.searchingArroba = true)),
      switchMap((term) =>
        this.arrobaService.listaUsuarios(term.slice(1)).pipe(
          map((response) => response as unknown as UsuarioEsAmigoDTO[]),
          catchError(() => {
            this.searchFailedArroba = true;
            return of([]);
          })
        )

      ),
      tap(() => (this.searchingArroba = false))
    );

  onTextChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    const words = input.split(' ');
    const lastWord = words[words.length - 1];
    if (lastWord.startsWith('@') && lastWord.length > 1) {
      const textObservable = of(lastWord);
      this.searchUsuarios(textObservable).subscribe((results) => {
        this.usuariosFiltrados = results;
      });
    }
    else {
      this.usuariosFiltrados = [];
    }

  }
}