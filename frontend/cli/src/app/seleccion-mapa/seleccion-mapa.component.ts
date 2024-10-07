import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import axios from 'axios'; // Asegúrate de tener axios instalado
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UbicacionService } from '../ubicacion.service'; // Importa tu servicio de ubicación

@Component({
  selector: 'app-seleccion-mapa',
  templateUrl: './seleccion-mapa.component.html',
  styleUrls: ['./seleccion-mapa.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class SeleccionMapaComponent implements AfterViewInit {

  mapa!: L.Map;
  sugerencias: any[] = [];
  marcador!: L.Marker; // Agregar una propiedad para el marcador
  private buscarDireccionSubject = new Subject<string>(); // Subject para manejar el debounce

  constructor(private ubicacionService: UbicacionService) {} // Inyectar el servicio de ubicación

  ngAfterViewInit(): void {
    this.obtenerUbicacionYIniciarMapa();

    // Suscribirse al Subject para realizar la búsqueda con debounce
    this.buscarDireccionSubject.pipe(debounceTime(300)).subscribe((query: string) => {
      this.realizarBusqueda(query);
    });
  }

  // Obtener la ubicación del usuario y centrar el mapa
  private obtenerUbicacionYIniciarMapa(): void {
    this.ubicacionService.obtenerUbicacion().then(() => {
      const latitud = this.ubicacionService.getLatitud();
      const longitud = this.ubicacionService.getLongitud();

      if (latitud !== null && longitud !== null) {
        this.iniciarMapa(latitud, longitud); // Inicia el mapa con las coordenadas del usuario
      } else {
        console.error('No se pudo obtener la ubicación del usuario.');
        this.iniciarMapa(-42.7692, -65.0385); // Coordenadas por defecto
      }
    }).catch((error) => {
      console.error('Error al obtener la ubicación:', error);
      this.iniciarMapa(-42.7692, -65.0385); // Coordenadas por defecto en caso de error
    });
  }

  // Iniciar el mapa con las coordenadas especificadas
  private iniciarMapa(lat: number, lng: number): void {
    this.mapa = L.map('map').setView([lat, lng], 13);

    // Cambiamos a un mapa satelital usando Esri World Imagery
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(this.mapa);

    // Agregar evento de clic en el mapa para mover el marcador
    this.mapa.on('click', (event: L.LeafletMouseEvent) => {
      this.moverMarcador(event.latlng);
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
}

