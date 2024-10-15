import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';

@Component({
  selector: 'app-amigos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: 'amigos.component.html',
  styleUrls: ['amigos.component.css'] 
})
export class AmigosComponent implements OnInit {
  amigos: Usuario[] = []; // Arreglo para almacenar los amigos
  solicitudes: Usuario[] = []; // Arreglo para almacenar las solicitudes
  mostrarAmigos: boolean = true; // Estado para mostrar amigos o solicitudes
  nombreUsuario: string = 'lucas123'; // Cambia esto según tus necesidades

  constructor(private usuarioService: UsuarioService,
              private router: Router) {}
              
  ngOnInit(): void {
      this.obtenerAmigos(); // Obtener amigos al iniciar
      //this.obtenerSolicitudes(); // Obtener solicitudes al iniciar
  }

  obtenerAmigos(): void {
      // Llama al servicio para obtener la lista de amigos
      this.usuarioService.obtenerAmigos(this.nombreUsuario).subscribe((dataPackage: DataPackage) => {
          if (dataPackage.status === 200) { // Verifica el estado
              this.amigos = dataPackage.data as Usuario[]; // Asegúrate de que data sea un arreglo de Usuario
          } else {
              console.error(dataPackage.message); // Manejo de errores
          }
      });
  }

/*   obtenerSolicitudes(): void {
      // Llama al servicio para obtener la lista de solicitudes
      this.usuarioService.obtenerSolicitudes().subscribe((dataPackage: DataPackage) => {
          if (dataPackage.status === 200) { // Verifica el estado
              this.solicitudes = dataPackage.data as Usuario[]; // Asegúrate de que data sea un arreglo de Usuario
          } else {
              console.error(dataPackage.message); // Manejo de errores
          }
      });
  } */

  cambiarVista(vista: 'amigos' | 'solicitudes'): void {
      this.mostrarAmigos = (vista === 'amigos');
  }
}
