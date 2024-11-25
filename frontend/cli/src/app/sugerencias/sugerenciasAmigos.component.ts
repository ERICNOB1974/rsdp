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
  templateUrl: 'sugerenciasAmigos.component.html',
  styleUrls: ['sugerencias.component.css']
})
export class SugerenciasAmigosComponent implements OnInit {
  currentIndex: number = 0; // Índice actual del carrusel
  results: Usuario[] = [];              
  motivos: { [key: number]: String } = {}; // Para almacenar comentarios por publicación

  constructor(private eventoService: EventoService,
    private comunidadService: ComunidadService,
    private usuarioService: UsuarioService,
    private router: Router) { }

  ngOnInit(): void {
    this.getUsuarios()
  }

  getUsuarios(): void {
    this.usuarioService.sugerencias().subscribe((dataPackage) => {
      if (Array.isArray(dataPackage.data)) {
        // Extrae solo los usuarios
        this.results = dataPackage.data.map(item => item.usuario);
  
        // Llena el objeto `motivos` con pares id: motivo
        this.motivos = {};
        dataPackage.data.forEach(item => {
          this.motivos[item.usuario.id] = item.motivo;
        });
      }
    });
  }
  


  // Método para mover al siguiente grupo de eventos en el carrusel
  siguienteUsuario(): void {
    this.currentIndex = (this.currentIndex + 1) % this.results.length; // Incrementa el índice
  }

  // Método para mover al grupo anterior de eventos en el carrusel
  usuarioAnterior(): void {
    this.currentIndex = (this.currentIndex - 1 + this.results.length) % this.results.length; // Decrementa el índice
  }

  // Método para obtener los eventos a mostrar en el carrusel
  obtenerUsuariosParaMostrar(): Usuario[] {
    const usuariosParaMostrar: Usuario[] = [];
  
    if (this.results.length === 0) {
      return usuariosParaMostrar; // Devuelve un arreglo vacío si no hay usuarios
    }
  
    // Si hay menos de 4 usuarios, se muestran solo los disponibles sin repetir
    const cantidadUsuariosAMostrar = Math.min(4, this.results.length);
  
    for (let i = 0; i < cantidadUsuariosAMostrar; i++) {
      const index = (this.currentIndex + i) % this.results.length;
      usuariosParaMostrar.push(this.results[index]);
    }
  
    return usuariosParaMostrar;
  }
}
