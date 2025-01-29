import { Injectable } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: Client | null = null;
  public nuevasPublicaciones$ = new Subject<void>(); // Notificar nuevas publicaciones
  public nuevasNotificaciones$ = new Subject<void>(); // Notificar nuevas notificaciones


  constructor(
    private authService: AuthService
  ) { }

  connect(): void {
    const socket = new SockJS('http://localhost:8080/ws'); // URL del endpoint
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
    });

    this.stompClient.onConnect = () => {
      console.log('Conexión establecida con WebSocket.');
      this.stompClient?.subscribe(`/queue/publicaciones/${this.authService.getUsuarioId()}`, () => {
        this.nuevasPublicaciones$.next(); // Emitir evento
      });
      
      // Suscribirse a las notificaciones personales del usuario
      this.stompClient?.subscribe(`/queue/notificaciones/${this.authService.getUsuarioId()}`, () => {
        this.nuevasNotificaciones$.next(); // Emitir evento
      });
      
    };

    this.stompClient.onStompError = (frame) => {
      console.error('Error en STOMP:', frame);
    };

    this.stompClient.activate();
  }

  disconnect(): void {
    this.stompClient?.deactivate();
    console.log('WebSocket desconectado.');
  }
}
