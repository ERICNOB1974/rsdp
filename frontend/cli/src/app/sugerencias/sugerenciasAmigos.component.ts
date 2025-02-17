import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdEncryptorService } from '../idEcnryptorService';
import { Usuario } from '../usuarios/usuario';
import { UsuarioService } from '../usuarios/usuario.service';

@Component({
  selector: 'app-sugerencias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'sugerenciasAmigos.component.html',
  styleUrls: ['sugerencias.component.css', 'sugerenciasEventos.component.css']
})
export class SugerenciasAmigosComponent implements OnInit {
  currentIndex: number = 0; // Índice actual del carrusel
  results: Usuario[] = [];
  motivos: { [key: number]: String } = {}; // Para almacenar comentarios por publicación
  isModalOpen: boolean = false; // Controla si el modal está abierto
  usuarioSeleccionado: any = null; // Almacena la comunidad seleccionada
  constructor(
    protected idEncryptorService: IdEncryptorService,
    private usuarioService: UsuarioService,
  ) { }

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

  formatMotivo(motivo: string): string {
    if (!motivo) return "Motivo no disponible";

    const frasesUnicas = Array.from(new Set(motivo.split(" --- ")))
      .map(frase => {
        if (/\d/.test(frase) && !frase.includes("1")) {
          return frase.replace(/\//g, ""); // Eliminar todas las barras "/"
        }
        if (frase.includes("1")) {
          return frase.replace(/\/s|\/n|\/es/g, ""); // Eliminar "/s", "/n" y "/es"
        }
        return frase;
      });

    return frasesUnicas.map(frase => `• ${frase}`).join("<br>");
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
  openMotivoModal(id: number): void {
    this.isModalOpen = true;
    this.usuarioSeleccionado = this.results.find((usuario) => usuario.id === id);
  }

  // Método para cerrar el modal
  closeMotivoModal(): void {
    this.isModalOpen = false;
    this.usuarioSeleccionado = null;
  }
}
