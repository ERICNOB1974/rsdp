import { Component, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Publicacion } from './publicacion';
import { PublicacionService } from './publicacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioEsAmigoDTO } from '../arrobar/UsuarioEsAmigoDTO';
import { forkJoin, Observable, of } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  switchMap,
  tap,
  catchError,
  map,
  concatMap,
} from 'rxjs/operators';
import { ArrobarService } from '../arrobar/arrobar.service';
import { Usuario } from '../usuarios/usuario';
import { IdEncryptorService } from '../idEcnryptorService';

@Component({
  selector: 'app-publicaciones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  styleUrls: ['../css/crear.component.css', '../css/arroba.css', 'crearPublicacion.component.css'],
  templateUrl: 'crearPublicacion.component.html'
})
export class CrearPublicacionComponent implements OnInit {

  publicacion!: Publicacion;
  formatoValido: boolean = false;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null; // Para mostrar la vista previa de la imagen o video
  tipo!: 'comunidad' | 'publicacion'; // Tipo de flujo (registro o recuperación)
  idComunidad: number | null = null;
  usuariosFiltrados: UsuarioEsAmigoDTO[] = [];
  searchingArroba = false;
  searchFailedArroba = false;
  usuariosMencionados: Usuario[] = [];
  isLoading = false;



  constructor(private publicacionService: PublicacionService,
    private arrobaService: ArrobarService,
    private route: ActivatedRoute,
    private location: Location,
    private snackBar: MatSnackBar,
    protected idEncryptorService: IdEncryptorService

  ) {
    const tipoParam = this.route.snapshot.queryParamMap.get('tipo') as 'comunidad' | 'publicacion';
    this.tipo = tipoParam;
  }

  ngOnInit(): void {
    this.publicacion = <Publicacion>{
      texto: '',
      file: ''
    };




    this.route.queryParams.subscribe(params => {
      this.tipo = params['tipo'] as 'comunidad' | 'publicacion';
      
      if (this.tipo === 'comunidad') {
        const idCifrado = params['idComunidad']; // Aquí tomamos el id desde queryParams
    
        let id: number | string = 'new'; // Inicializamos con 'new'
    
        if (idCifrado && idCifrado !== 'new') {
          id = this.idEncryptorService.decodeId(idCifrado);
        }
    
        this.idComunidad = Number(id); // Convertimos el resultado a número
      }
    });
    
  }

  cancel(): void {
    this.location.back()
  }

  savePublicacion(): void {
    this.isLoading = true;

    // Establecer la fecha de creación
    this.publicacion.fechaDeCreacion = new Date().toISOString();

    // Elegir la operación de guardado según el tipo de publicación
    const saveObservable = this.tipo === 'comunidad' && this.idComunidad
      ? this.publicacionService.publicarEnComunidad(this.publicacion, this.idComunidad)
      : this.publicacionService.saveConCreador(this.publicacion);

    saveObservable.pipe(
      concatMap((publicacionGuardada) => {
        const p = publicacionGuardada.data as unknown as Publicacion;
        const idPublicacion = p.id;

        // Extraer usuarios etiquetados del texto
        const usuariosEtiquetados = this.extraerUsuariosEtiquetados(this.publicacion.texto);

        // Si no hay usuarios etiquetados, devolver un observable vacío y continuar
        if (usuariosEtiquetados.length === 0) {
          return of(null);
        }

        // Llamar al servicio de arrobar para cada usuario
        const etiquetadoObservables = usuariosEtiquetados.map(usuario =>
          this.arrobaService.arrobarEnPublicacion(usuario.id, idPublicacion)
        );

        // Esperar a que todas las solicitudes de etiquetado finalicen antes de continuar
        return forkJoin(etiquetadoObservables);
      })
    ).subscribe({
      next: () => {
        this.isLoading = false;
        this.location.back(); // Ahora se ejecuta solo cuando TODO ha finalizado
      },
      error: (err) => {
        console.error('Error al guardar la publicación:', err);
        this.isLoading = false;
      }
    });
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
  addUsuario(usuario: UsuarioEsAmigoDTO): void {
    const words = this.publicacion.texto.split(' ');
    words[words.length - 1] = `@${usuario.usuario.nombreUsuario}`;
    this.publicacion.texto = words.join(' ');
    this.usuariosMencionados.push(usuario.usuario); // Agregar el usuario encontrado
  }


  onFileSelect(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const validVideoTypes = ['video/mp4'];

    if (file) {
      // Verificar si el archivo es una imagen o un video
      if (validImageTypes.includes(file.type) || validVideoTypes.includes(file.type)) {
        this.formatoValido = true; // El formato es válido
        this.archivoSeleccionado = file;

        // Detecta el tipo de archivo
        const fileType = file.type.split('/')[0];
        this.tipoArchivo = fileType; // 'image' o 'video'

        // Crea la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.vistaPreviaArchivo = reader.result;
          this.publicacion.file = reader.result as string; // Aquí obtenemos la cadena base64
        };
        reader.readAsDataURL(file);

        this.publicacion.file = file;

      } else {
        this.formatoValido = false; // El formato no es válido
        this.vistaPreviaArchivo = null; // No se muestra la vista previa
        this.snackBar.open('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF) o videos (MP4).', 'Cerrar', {
          duration: 3000,
        });
      }
    }
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevenir el comportamiento predeterminado
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Asegurarse de que existen archivos en el evento
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]; // Toma el primer archivo
      const inputEvent = { target: { files: [file] } }; // Crea un evento similar al del input
      this.onFileSelect(inputEvent); // Reutiliza tu lógica para manejar el archivo
    }
  }


  publicacionValida(): boolean {
    if (this.publicacion.texto)
      return true
    if (this.publicacion.file && this.formatoValido)
      return true
    return false
  }

  eliminarArchivo(): void {
    this.vistaPreviaArchivo = null;
    this.tipoArchivo = '';
    this.formatoValido = false;
    this.publicacion.file = '';
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
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "auto"; // Reinicia la altura
    textarea.style.height = `${textarea.scrollHeight}px`; // Ajusta según el contenido
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


  resultFormatUsuario(value: Usuario) {
    return value.nombreUsuario;
  }

  inputFormatEtiqueta(value: Usuario) {
    return value ? value.nombreUsuario : '';
  }


}

