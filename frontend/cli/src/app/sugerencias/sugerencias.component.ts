import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventoService } from '../eventos/evento.service';
import { ComunidadService } from '../comunidades/comunidad.service';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';

@Component({
    selector: 'app-sugerencias',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: 'sugerencias.component.html',
    styleUrls: ['eventos.component.css'] 
})
export class SugerenciasComponent implements OnInit {
    currentIndex: number = 0; // Índice actual del carrusel
    eventos: Usuario[] = []; // Arreglo para almacenar los eventos que provienen del backend
    results: Usuario[] = [];
  
    constructor(private eventoService: EventoService,
        private comunidadService: ComunidadService,
        private usuarioService: UsuarioService,
        private router: Router) { }

    ngOnInit(): void {
        // this.getEventos()
    }

    // sugerenciasAmigos(){
    //     this.usuarioService.sugerencias("usuario12");
    // }

    // getEventos(): void {
    //     this.usuarioService.sugerencias("usuario8").subscribe((dataPackage) => {
    //       const responseData = dataPackage.data;
    //       if (Array.isArray(responseData)) {
    //         this.results = responseData;
    //       }
    //     });
    //   }

   
    
      // Método para mover al siguiente grupo de eventos en el carrusel
      siguienteEvento(): void {
        this.currentIndex = (this.currentIndex + 1) % this.results.length; // Incrementa el índice
      }
    
      // Método para mover al grupo anterior de eventos en el carrusel
      eventoAnterior(): void {
        this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length; // Decrementa el índice
      }
    
      // Método para obtener los eventos a mostrar en el carrusel
      obtenerEventosParaMostrar(): Usuario[] {
        const eventosParaMostrar: Usuario[] = [];
    
        if (this.results.length === 0) {
          return eventosParaMostrar; // Devuelve un arreglo vacío si no hay eventos
        }
    
        for (let i = 0; i < 4; i++) {
          const index = (this.currentIndex + i) % this.results.length;
          eventosParaMostrar.push(this.results[index]);
        }
        return eventosParaMostrar;
      }
}
