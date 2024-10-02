import { Component, AfterViewInit } from '@angular/core';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { fromLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import axios from 'axios';
import { UbicacionService } from '../ubicacion.service'; // Asegúrate de que este import esté correcto
import XYZ from 'ol/source/XYZ';

@Component({
  selector: 'app-seleccion-mapa',
  templateUrl: './seleccion-mapa.component.html',
  styleUrls: ['./seleccion-mapa.component.css'],
})
export class SeleccionMapaComponent implements AfterViewInit {
  private mapa!: Map;
  sugerencias: any[] = [];
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
        this.iniciarMapa(latitud, longitud); // Inicia el mapa con las coordenadas obtenidas
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
    this.mapa = new Map({
      target: 'map', // Asegúrate de que el div con este ID exista en tu HTML
      layers: [
        new TileLayer({
          source: new XYZ({
            url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
          }),
        }),             
      ],
      view: new View({
        center: fromLonLat([lng, lat]),
        zoom: 13,
      }),
      
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
              coordenadas: feature.geometry.coordinates,
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

    // Actualizar la vista del mapa
    this.mapa.setView(new View({
      center: fromLonLat([lng, lat]),
      zoom: 16,
    }));

    // Limpiar las sugerencias y el campo de texto
    this.sugerencias = [];
    (document.querySelector('input[type="text"]') as HTMLInputElement).value = '';
  }
}
