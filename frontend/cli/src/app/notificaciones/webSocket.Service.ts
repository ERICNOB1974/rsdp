import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
/*   private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:8080'); // Cambia la URL al endpoint de tu backend
  }

  listen(eventName: string, callback: (data: any) => void): void {
    this.socket.on(eventName, callback);
  }

  emit(eventName: string, data: any): void {
    this.socket.emit(eventName, data);
  } */

}