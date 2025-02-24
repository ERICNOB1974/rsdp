import { CommonModule, Location, NgIf } from '@angular/common'; // Asegúrate de que está importado desde aquí
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import axios from 'axios'; // Asegúrate de tener axios instalado
import * as L from 'leaflet';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { DataPackage } from '../data-package';
import { Etiqueta } from '../etiqueta/etiqueta';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { EtiquetaPopularidadDTO } from '../etiqueta/etiquetaPopularidadDTO';
import { UbicacionService } from '../ubicacion.service'; // Importa tu servicio de ubicación
import { Evento } from './evento';
import { EventoService } from './evento.service';
import { cantidadParticipantesValidator, dateValidator } from './validacionesEvento';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { IdEncryptorService } from '../idEcnryptorService';

@Component({
  selector: 'app-crear-evento',
  templateUrl: './editarEvento.component.html',
  styleUrls: ['./crearEvento.component.css', '../css/crear.component.css', '../css/etiquetas.css', '../css/registro.component.css'],
  standalone: true,
  imports: [FormsModule, NgbTypeaheadModule, CommonModule, MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    MatChipsModule, MatIconModule, NgIf]
})
export class EditarEventoComponent {

  evento!: Evento;
  minFechaHora: string = '';
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;
  showMessage: boolean = false;
  messageToShow: string = '';
  cursorBlocked: boolean = false;
  otorgada: boolean = false;
  mapa!: L.Map;
  sugerencias: any[] = [];
  marcador!: L.Marker; // Agregar una propiedad para el marcador
  private buscarDireccionSubject = new Subject<string>();
  ubicacionAceptada: boolean = false; // Nueva propiedad
  latitud: number = 0;
  longitud: number = 0;
  participantes: number = 0;
  maxParticipantes: number = 1; // Inicializar con 1
  formatoValido: boolean = true;
  isLoading: boolean = false;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null;
  formEvento: FormGroup;
  etiquetasOriginales: Etiqueta[] = [];
  @ViewChild('etiquetasInput') etiquetasInput!: ElementRef<HTMLInputElement>;
  @ViewChild('etiquetasModel') etiquetasModel!: NgModel;



  constructor(
    private eventoService: EventoService,
    private etiquetaService: EtiquetaService,
    private router: Router,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private location: Location,
    private idEncryptorService: IdEncryptorService

  ) {
    this.formEvento = this.formBuilder.group(
      {
        nombre: ['', [Validators.required]],
        fechaHora: ['', [Validators.required, dateValidator()]],

        cantidadMaximaParticipantes: [
          '',
          [Validators.required],
          [cantidadParticipantesValidator.bind(this)],
        ],
        latitud: [
          '',
          [Validators.required]
        ],
        longitud: ['', [Validators.required]],
        descripcion: [''] // Esta línea ahora no tiene validación

      }
    );
  }

  async ngOnInit(): Promise<void> {
    //const id = this.route.snapshot.paramMap.get('id');


    const idCifrado = this.route.snapshot.paramMap.get('id');

    let id: number | string = 'new'; // Inicializamos con 'new' para que la comparación funcione

    if (idCifrado && idCifrado !== 'new') {
      id = this.idEncryptorService.decodeId(idCifrado);
    }
    id=id.toString();

    if (id != "new" && id != null) {
      this.eventoService.get(id).subscribe(async (dataPackage) => {
        this.evento = <Evento>dataPackage.data;
        this.latitud = this.evento.latitud;
        this.longitud = this.evento.longitud;
        this.obtenerUbicacionYIniciarMapa();
        if (this.evento.fechaHora) {
          const fechaUTC = new Date(this.evento.fechaHora);
          this.evento.fechaHora = new Date(fechaUTC.getTime() + (3 * 60 * 60 * 1000));

          const fecha = new Date(this.evento.fechaHora);
          const year = fecha.getFullYear();
          const month = String(fecha.getMonth() + 1).padStart(2, '0');
          const day = String(fecha.getDate()).padStart(2, '0');
          const hours = String(fecha.getHours()).padStart(2, '0');
          const minutes = String(fecha.getMinutes()).padStart(2, '0');


          this.evento.fechaHora = `${year}-${month}-${day}T${hours}:${minutes}`;



          this.eventoService.etiquetasDelEvento(this.evento.id).subscribe(dataPackage => {
            this.etiquetasSeleccionadas = <Etiqueta[]>dataPackage.data;
            this.etiquetasOriginales = <Etiqueta[]>dataPackage.data;
          });
          this.eventoService.participantesEnEvento(this.evento.id).subscribe(dataPackage => {
            this.participantes = <number><unknown>dataPackage.data;
            this.maxParticipantes = Math.max(1, this.participantes); // Actualizar el máximo permitido

          })
        }
      });


      // Suscribirse al Subject para realizar la búsqueda con debounce
      this.buscarDireccionSubject.pipe(debounceTime(300)).subscribe((query: string) => {
        this.realizarBusqueda(query);
      });
    } else {
      this.router.navigate(['eventos/crearEvento']);
    }
  }

  private obtenerUbicacionYIniciarMapa(): void {
    if (this.latitud !== null && this.longitud !== null) {
      this.iniciarMapa(this.latitud, this.longitud); // Inicia el mapa con las coordenadas del usuario
      this.ubicacionAceptada = true; // Habilitar la interacción
    }

  }



  onFileSelect(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file) {
      // Verificar si el archivo es una imagen o un video
      if (validImageTypes.includes(file.type)) {
        this.formatoValido = true; // El formato es válido
        this.archivoSeleccionado = file;

        // Detecta el tipo de archivo
        const fileType = file.type.split('/')[0];
        this.tipoArchivo = fileType; // 'image' o 'video'

        // Crea la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.vistaPreviaArchivo = reader.result;
          this.evento.imagen = reader.result as string; // Aquí obtenemos la cadena base64
        };
        reader.readAsDataURL(file);

        this.evento.imagen = file;

      } else {
        this.formatoValido = false; // El formato no es válido
        this.vistaPreviaArchivo = null; // No se muestra la vista previa
        this.snackBar.open('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF).', 'Cerrar', {
          duration: 3000,
        });
      }
    }
  }

  private mostrarAlertaDeUbicacionRechazada(): void {
    // Crear un contenedor de alerta a pantalla completa
    const alertOverlay = document.createElement('div');
    alertOverlay.classList.add('alert-overlay', 'd-flex', 'justify-content-center', 'align-items-center');

    // Crear un contenedor para el contenido del modal
    const alertContainer = document.createElement('div');
    alertContainer.classList.add('alert-container', 'alert', 'alert-danger', 'fade', 'show', 'p-5');
    alertContainer.setAttribute('role', 'alert');

    // Contenido del mensaje de alerta
    alertContainer.innerHTML = `
    <div class="modal fade show" id="ubicacionModal" tabindex="-1" aria-labelledby="ubicacionModalLabel" aria-modal="true" style="display: block; background: rgba(0, 0, 0, 0.75);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="ubicacionModalLabel">Ubicación necesaria</h5>
          </div>
          <div class="modal-body text-center">
            <p class="lead">Para continuar, necesitamos que habilites la ubicación.</p>
            <p>Por favor, activa la ubicación en tu dispositivo para poder disfrutar de todas las funcionalidades de la plataforma.</p>
            <div class="alert alert-warning mt-3">
              <strong>Advertencia:</strong> No podrás salir de esta pantalla hasta habilitar la ubicación.
            </div>
          </div>
        </div>
      </div>
    </div>  
    `;

    // Añadir el contenedor de la alerta al contenedor de overlay
    alertOverlay.appendChild(alertContainer);

    // Añadir el contenedor al cuerpo del documento
    document.body.appendChild(alertOverlay);

    // Bloquear la interacción
    this.cursorBlocked = true;

  }

  private iniciarMapa(lat: number, lng: number): void {
    this.mapa = L.map('map').setView([lat, lng], 13);

    // Cambiamos a un mapa satelital usando Esri World Imagery
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(this.mapa);
    this.marcador = L.marker([lat, lng]).addTo(this.mapa);


    // Agregar evento de clic en el mapa para mover el marcador
    /*   this.marcador.on('dragend', (event) => {
        const position = event.target.getLatLng();
        this.evento.latitud = position.latlng.lat;
        this.evento.longitud = position.latlng
          .lng;
      }); */

    this.mapa.on('click', (event: L.LeafletMouseEvent) => {
      this.moverMarcador(event.latlng);
      this.evento.latitud = event.latlng.lat;
      this.evento.longitud = event.latlng.lng;
    });


  }

  buscarDireccion(event: Event): void {
    const input = event.target as HTMLInputElement;
    const query = input.value;

    // Emitir el valor del input al Subject
    this.buscarDireccionSubject.next(query);
  }

  private realizarBusqueda(query: string): void {
    // Solo buscar si el texto tiene más de 2 caracteres
    if (query.length > 2) {
      axios
        .get(`https://photon.komoot.io/api/?q=${query}`)
        .then((response) => {
          // Filtrar las sugerencias para asegurarse de que todos los atributos son válidos
          this.sugerencias = response.data.features
            .map((feature: any) => ({
              direccion: feature.properties.street || null,
              altura: feature.properties.housenumber || null,
              ciudad: feature.properties.city || null,
              pais: feature.properties.country || null,
              coordenadas: feature.geometry.coordinates
            }))
            .filter((sugerencia: any) =>
              sugerencia.ciudad !== null &&
              sugerencia.pais !== null
            );
        })
        .catch((error) => {
          console.error('Error al buscar direcciones:', error);
        });
    } else {
      this.sugerencias = [];
    }
  }

  seleccionarDireccion(sugerencia: any): void {
    const [lng, lat] = sugerencia.coordenadas;
    const latLng = L.latLng(lat, lng);
    this.moverMarcador(latLng);
    this.evento.latitud = lat;
    this.evento.longitud = lng;
    // Limpiar las sugerencias y el campo de texto
    this.sugerencias = [];
    (document.querySelector('input[type="text"]') as HTMLInputElement).value = '';
  }

  private moverMarcador(latlng: L.LatLng): void {
    // Si ya hay un marcador, lo eliminamos
    if (this.marcador) {
      this.mapa.removeLayer(this.marcador);
    }

    // Colocar el nuevo marcador
    this.marcador = L.marker(latlng).addTo(this.mapa)
      .bindPopup(`Ubicación: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`)
      .openPopup();

    this.mapa.setView(latlng, 16);
  }


  searchEtiqueta = (text$: Observable<string>): Observable<EtiquetaPopularidadDTO[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.etiquetaService.search(term).pipe(
          map((response: DataPackage) => response.data as EtiquetaPopularidadDTO[]),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );


  agregarEtiqueta(event: any): void {
    const etiqueta: Etiqueta = event.item;

    // Verificar por nombre en lugar de por ID para evitar duplicados
    if (!this.etiquetasSeleccionadas.some(e => e.nombre === etiqueta.nombre)) {
      this.etiquetasSeleccionadas.push(etiqueta);
    }
    setTimeout(() => {
      this.etiquetasInput.nativeElement.value = '';
      this.etiquetasModel.control.setValue('');
    });
  }


  eliminarEtiqueta(etiqueta: Etiqueta): void {
    this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(
      e => e.nombre !== etiqueta.nombre
    );
  }


  resultFormatEtiqueta(value: EtiquetaPopularidadDTO): string {
    return `${value.nombre} (${value.popularidad})`;
  }

  inputFormatEtiqueta(value: Etiqueta): string {
    return value ? value.nombre : '';
  }


  cancel(): void {
    this.router.navigate(['/eventos']);
  }

  async saveEvento() {
    this.isLoading = true;

    setTimeout(() => {
      this.isLoading = false;
      this.location.back();
    }, 1000);

    try {
      // Formatear la fecha antes de guardar el evento
      this.evento.fechaHora = new Date(this.evento.fechaHora).toISOString();

      // Guardar el evento y obtener su ID
      const eventoGuardado = await firstValueFrom(this.eventoService.saveConCreador(this.evento));
      this.evento = <Evento>eventoGuardado.data;

      // Verificar y crear etiquetas si es necesario
      for (const etiqueta of this.etiquetasSeleccionadas) {
        const existe = await this.etiquetaService.verificarExistencia(etiqueta.nombre).toPromise();
        let etiquetaFinal = etiqueta;

        if (!existe) {
          const nuevaEtiqueta = { id: 0, nombre: etiqueta.nombre };
          etiquetaFinal = await firstValueFrom(this.etiquetaService.crearEtiqueta(nuevaEtiqueta));
        }

        // Realizar la etiquetación con la etiqueta final
        await this.eventoService.etiquetar(this.evento, etiquetaFinal.id).toPromise();
      }

      // Desetiquetar etiquetas removidas
      for (const etiqueta of this.etiquetasOriginales) {
        if (!this.etiquetasSeleccionadas.some(e => e.id === etiqueta.id)) {
          await this.eventoService.desetiquetar(this.evento.id, etiqueta.id).toPromise();
        }
      }

      this.snackBar.open('Evento editado con éxito', 'Cerrar', {
        duration: 3000,
      });

    } catch (error) {
      console.error('Error al guardar el evento:', error);
      this.snackBar.open('Error al guardar el evento.', 'Cerrar', {
        duration: 3000,
      });
    }
  }




  isFormValid(): boolean {
    return !!this.evento &&
      !!this.evento.fechaHora &&
      !!this.evento.nombre &&
      !!(this.etiquetasSeleccionadas.length > 0) &&
      !!(this.etiquetasSeleccionadas.length <= 15) &&
      !!this.evento.cantidadMaximaParticipantes &&
      !!this.evento.latitud &&
      !!this.evento.longitud &&
      this.evento.cantidadMaximaParticipantes >= this.maxParticipantes

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


  eliminarArchivo(): void {
    this.vistaPreviaArchivo = null;
    this.formatoValido = false;
    this.evento.imagen = '';

  }

}


