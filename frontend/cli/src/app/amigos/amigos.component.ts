import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';
import { AuthService } from '../autenticacion/auth.service';

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
    idUsuarioAutenticado!: number;  // ID del usuario autenticado

    usuariosBuscados: Usuario[] = []; //PARA BUSCAR USUARIOS

    constructor(private usuarioService: UsuarioService,
        private authService: AuthService,  // Inyecta el AuthService

        private router: Router) { }

    ngOnInit(): void {
        this.obtenerAmigos(); // Obtener amigos al iniciar
        this.obtenerSolicitudes(); // Obtener solicitudes al iniciar
        const usuarioId = this.authService.getUsuarioId();
        this.idUsuarioAutenticado = Number(usuarioId);
    }

    obtenerAmigos(): void {
        // Llama al servicio para obtener la lista de amigos
        this.usuarioService.obtenerAmigos().subscribe((dataPackage: DataPackage) => {
            if (dataPackage.status === 200) { // Verifica el estado
                this.amigos = dataPackage.data as Usuario[]; // Asegúrate de que data sea un arreglo de Usuario
            } else {
                console.error(dataPackage.message); // Manejo de errores
            }
        });
    }

    obtenerSolicitudes(): void {
        // Llama al servicio para obtener la lista de solicitudes
        this.usuarioService.obtenerSolicitudes().subscribe((dataPackage: DataPackage) => {
            if (dataPackage.status === 200) { // Verifica el estado
                this.solicitudes = dataPackage.data as Usuario[]; // Asegúrate de que data sea un arreglo de Usuario
            } else {
                console.error(dataPackage.message); // Manejo de errores
            }
        });
    }

    gestionarSolicitud(usuario: Usuario, aceptar: boolean): void {
        this.usuarioService.gestionarSolicitudAmistad(usuario.id, this.idUsuarioAutenticado, aceptar).subscribe({
            next: (dataPackage: DataPackage) => {
                if (dataPackage.status === 200) {
                    const mensaje = aceptar ? 'Solicitud de amistad aceptada exitosamente.' : 'Solicitud de amistad rechazada exitosamente.';
                    alert(mensaje);
                    window.location.reload(); // Recargar la página
                } else {
                    alert('Error: ' + dataPackage.message);
                }
            },
            error: (error) => {
                const mensaje = aceptar ? 'Error al aceptar la solicitud de amistad.' : 'Error al rechazar la solicitud de amistad.';
                alert(mensaje);
            }
        });
    }
    cambiarVista(vista: 'amigos' | 'solicitudes'): void {
        this.mostrarAmigos = (vista === 'amigos');
    }

    verPerfil(usuario: Usuario): void {
        this.router.navigate(['/perfil', usuario.id]); // Navega al perfil del usuario
    }

    buscarUsuarios(termino: string) {
        if (termino.trim() !== '') {
            this.usuarioService.buscar(termino).subscribe((dataPackage: DataPackage) => {
                if (dataPackage.status === 200) {
                    this.usuariosBuscados = dataPackage.data as Usuario[];
                } else {
                    console.error('Error al buscar usuarios:', dataPackage.message);
                }
            });
        } else {
            this.usuariosBuscados = [];
        }
    }
}
