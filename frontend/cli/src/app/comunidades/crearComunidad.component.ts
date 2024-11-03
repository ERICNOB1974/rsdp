import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';
import { Location } from '@angular/common'; // Asegúrate de que está importado desde aquí
import * as L from 'leaflet';
import axios from 'axios'; // Asegúrate de tener axios instalado
import { UbicacionService } from '../ubicacion.service'; // Importa tu servicio de ubicación
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { Etiqueta } from '../etiqueta/etiqueta';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { EtiquetaPopularidadDTO } from '../etiqueta/etiquetaPopularidadDTO';
import { DataPackage } from '../data-package';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-crear-comunidad',

  templateUrl: './crearComunidad.component.html',
  styleUrls: ['../eventos/crearEvento.component.css'],

  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbTypeaheadModule]
})
export class CrearComunidadComponent {
  comunidad!: Comunidad;
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;
  showMessage: boolean = false;
  messageToShow: string = '';
  cursorBlocked: boolean = false;
  creada: boolean = false;
  mapa!: L.Map;
  sugerencias: any[] = [];
  marcador!: L.Marker; // Agregar una propiedad para el marcador
  private buscarDireccionSubject = new Subject<string>(); // Subject para manejar el debounce
  ubicacionAceptada: boolean = false;
  formatoValido: boolean = true;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private comunidadService: ComunidadService,
    private etiquetaService: EtiquetaService,
    private router: Router,
    private ubicacionService: UbicacionService,
    private cdr: ChangeDetectorRef
  ) { }

  goBack(): void {
    this.location.back(); // Esto debería funcionar correctamente
  }

  get(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id === 'new') {
      this.comunidad = <Comunidad>{};
    } else {
      this.comunidadService.get(parseInt(id)).subscribe(dataPackage => this.comunidad = <Comunidad>dataPackage.data);
    }
  }

  ngOnInit() {
    this.comunidad = <Comunidad>{};
    this.obtenerUbicacionYIniciarMapa();

    // Suscribirse al Subject para realizar la búsqueda con debounce
    this.buscarDireccionSubject.pipe(debounceTime(300)).subscribe((query: string) => {
      this.realizarBusqueda(query);
    });
  }

  async saveComunidad(): Promise<void> {
    try {
      console.log(this.comunidad.latitud + " " + this.comunidad.longitud);
      
      // Guardar la comunidad y obtener su ID
      const dataPackage = await firstValueFrom(this.comunidadService.save(this.comunidad));
      this.comunidad = <Comunidad>dataPackage.data;
      
      this.messageToShow = '¡La comunidad se ha guardado exitosamente!';
      this.showMessage = true; // Mostrar el mensaje
      setTimeout(() => {
        this.showMessage = false;
      }, 10000);
  
      // Verificar y crear etiquetas si es necesario
      for (const etiqueta of this.etiquetasSeleccionadas) {
        const existe = await this.etiquetaService.verificarExistencia(etiqueta.nombre).toPromise();
        let etiquetaFinal = etiqueta;
  
        if (!existe) {
          const nuevaEtiqueta = { id: 0, nombre: etiqueta.nombre };
          etiquetaFinal = await firstValueFrom(this.etiquetaService.crearEtiqueta(nuevaEtiqueta));
        }
  
        // Realizar la etiquetación con la etiqueta final
        await this.comunidadService.etiquetar(this.comunidad, etiquetaFinal.id).toPromise();
      }
  
    } catch (error) {
      this.messageToShow = 'Ocurrió un error al guardar la comunidad.';
      this.showMessage = true; // Mostrar el mensaje de error
      setTimeout(() => {
        this.showMessage = false;
      }, 10000);
    }
  
    // Recargar la página una vez que todo esté completo
    location.reload();
  }
  

  cancel(): void {
    this.router.navigate(['/comunidades']);
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

    // Restablecer la etiqueta seleccionada
    this.etiquetaSeleccionada = null;

    // Forzar actualización visual del input
    this.cdr.detectChanges();
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


  private obtenerUbicacionYIniciarMapa(): void {
    this.ubicacionService.obtenerUbicacion().then(() => {
      const latitud = this.ubicacionService.getLatitud();
      const longitud = this.ubicacionService.getLongitud();

      if (latitud !== null && longitud !== null) {
        this.iniciarMapa(latitud, longitud); // Inicia el mapa con las coordenadas del usuario
        this.ubicacionAceptada = true; // Habilitar la interacción
      } else {
        this.ubicacionAceptada = false;
        console.error('No se pudo obtener la ubicación del usuario.');
        this.iniciarMapa(-42.7692, -65.0385); // Coordenadas por defecto
      }
    }).catch((error) => {
      this.ubicacionAceptada = false; // Deshabilitar la interacción
      this.mostrarAlertaDeUbicacionRechazada(); // Mostrar un mensaje al usuario
      console.error('Error al obtener la ubicación:', error);
    });
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
            <h5 class="modal-title" id="ubicacionModalLabel">Ubicación Necesaria</h5>
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

    // Agregar evento de clic en el mapa para mover el marcador
    this.mapa.on('click', (event: L.LeafletMouseEvent) => {
      this.moverMarcador(event.latlng);
      this.comunidad.latitud = event.latlng.lat;
      this.comunidad.longitud = event.latlng.lng;
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
    this.comunidad.latitud = lat;
    this.comunidad.longitud = lng;
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

  isFormValid(): boolean {
    return this.ubicacionAceptada && !!this.comunidad.nombre &&
      !!this.comunidad.cantidadMaximaMiembros &&
      !!this.comunidad.latitud &&
      !!this.comunidad.longitud &&
      !!(this.etiquetasSeleccionadas.length > 0) &&
      !!(this.etiquetasSeleccionadas.length <= 15)
  }


  onFileSelect(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file) {
      // Verificar si el archivo es una imagen o un video
      if (validImageTypes.includes(file.type) ) {
        this.formatoValido = true; // El formato es válido
        this.archivoSeleccionado = file;

        // Detecta el tipo de archivo
        const fileType = file.type.split('/')[0];
        this.tipoArchivo = fileType; // 'image' o 'video'

        // Crea la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.vistaPreviaArchivo = reader.result;
          this.comunidad.imagen = reader.result as string; // Aquí obtenemos la cadena base64
        };
        reader.readAsDataURL(file);

        this.comunidad.imagen = file;

      } else {
        this.formatoValido = false; // El formato no es válido
        this.vistaPreviaArchivo = null; // No se muestra la vista previa
        alert('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF) o videos (MP4).');
      }
    }
  }

}
