import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UbicacionService {
  private latitud: number | null = null;
  private longitud: number | null = null;

  constructor() {}

  // Método para solicitar la ubicación al usuario
  obtenerUbicacion(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.latitud = position.coords.latitude;
            this.longitud = position.coords.longitude;
            resolve();
          },
          (error) => {
            let errorMessage = 'Error desconocido al obtener la ubicación';
            switch (error.code) {
              case error.PERMISSION_DENIED:
                errorMessage = 'El usuario denegó el acceso a la ubicación.';
                break;
              case error.POSITION_UNAVAILABLE:
                errorMessage = 'La ubicación no está disponible.';
                break;
              case error.TIMEOUT:
                errorMessage = 'La solicitud de ubicación ha caducado.';
                break;
            }
            console.error(errorMessage);
            reject(errorMessage);
          }
        );
      } else {
        console.error('Geolocalización no soportada por el navegador.');
        reject('Geolocalización no soportada');
      }
    });
  }

  // Métodos para obtener la latitud y longitud
  getLatitud(): number | null {
    return this.latitud;
  }

  getLongitud(): number | null {
    return this.longitud;
  }
}
