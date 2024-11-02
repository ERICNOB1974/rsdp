import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { Publicacion } from '../publicaciones/publicacion';
import { PublicacionService } from '../publicaciones/publicacion.service';
import { AuthService } from '../autenticacion/auth.service';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { DataPackage } from '../data-package';

@Component({
    selector: 'app-editar-comunidad',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './muroComunidad.component.html',
    styleUrls: ['./comunidadMuro.css']
})
export class MuroComunidadComponent implements OnInit {
    comunidad!: Comunidad;
    idComunidad!: number;
    esParte: boolean = false;
    pendiente: boolean = false;
    tabSeleccionada: string = 'publicaciones';
    esCreador: boolean = false;
    miembros!: Usuario[];
    amigos!: Usuario[];
    administradores!: Usuario[];
    idUsuarioAutenticado!: number;
    usuariosAnonimos: number = 0; // Inicializamos la variable
    miembrosVisibles: any[] = []; // Almacena los usuarios visibles en la interfaz
    publicaciones!: Publicacion[];

    constructor(
        private route: ActivatedRoute,
        private comunidadService: ComunidadService,
        private publicacionService: PublicacionService,
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.idUsuarioAutenticado = Number(this.authService.getUsuarioId());
        this.getComunidad().then(() => {
            if (this.esParte) {  // Solo trae publicaciones y miembros si es parte de la comunidad
                this.getPublicaciones();
                this.traerMiembros();
            } 
        });
    }

    getPublicaciones(): void {
        this.publicacionService.publicacionesComunidad(this.idComunidad).subscribe({
            next: (dataPackage) => {
                if (dataPackage.status === 200 && Array.isArray(dataPackage.data)) {
                    this.publicaciones = dataPackage.data;
                } else {
                    console.error('Error al obtener las publicaciones:', dataPackage.message);
                    this.publicaciones = []; // Asigna un array vacío en caso de error
                }
            },
            error: (error) => {
                console.error('Error al obtener las publicaciones:', error);
                this.publicaciones = []; // Asigna un array vacío en caso de error
            }
        });
    }

    async traerMiembros(): Promise<void> {
        this.usuarioService.miembrosComunidad(this.comunidad.id).subscribe(async dataPackage => {
            if (Array.isArray(dataPackage.data)) {
                this.miembros = dataPackage.data;
                console.info(this.miembros);
                await this.obtenerAmigos(); // Espera a obtener amigos
                await this.traerAdministradores();
                this.filtrarMiembrosVisibles(); // Filtra miembros después de obtener amigos
            }
        });
    }

    obtenerAmigos(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.usuarioService.obtenerAmigos().subscribe({
                next: (dataPackage: DataPackage) => {
                    if (dataPackage.status === 200) {
                        this.amigos = dataPackage.data as Usuario[];
                        console.info(this.amigos);
                        resolve(); // Resuelve la promesa
                    } else {
                        console.error(dataPackage.message);
                        reject(dataPackage.message); // Rechaza la promesa en caso de error
                    }
                },
                error: (error) => {
                    console.error('Error al obtener amigos:', error);
                    reject(error); // Rechaza la promesa en caso de error
                }
            });
        });
    }

    async procesarEstado(): Promise<void> {
        return new Promise((resolve) => {
            this.comunidadService.estadoSolicitud(this.comunidad.id).subscribe(dataPackage => {
                let estado = <String>dataPackage.data;
                console.log(estado);
                if (estado == "Vacio") {
                    this.pendiente = false;
                    this.esParte = false;
                }
                if (estado == "Miembro") {
                    this.pendiente = false;
                    this.esParte = true;
                }
                if (estado == "Pendiente") {
                    this.pendiente = true;
                    this.esParte = false;
                }
                if (estado == "Creador") {
                    console.info("HOLAAA");
                    this.esCreador = true;
                    this.esParte = true; // El creador es parte de la comunidad por defecto
                }
                console.info(this.esParte+"HOLAFACU");
                resolve(); // Resuelve la promesa después de procesar el estado
            });
        });
    }

    getComunidad(): Promise<void> {
        return new Promise((resolve) => {
            const id = this.route.snapshot.paramMap.get('id');
            if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
                this.router.navigate(['comunidades/crearComunidad']);
                resolve();
            } else {
                this.comunidadService.get(parseInt(id)).subscribe(async dataPackage => {
                    this.comunidad = <Comunidad>dataPackage.data;
                    this.idComunidad = this.comunidad.id;
                    await this.procesarEstado(); // Asegúrate de que procesarEstado complete
                    resolve();
                });
            }
        });
    }

    seleccionarTab(tab: string): void {
        this.tabSeleccionada = tab;
    }

    irADetallePublicacion(idPublicacion: number): void {
        this.router.navigate(['/publicacion', idPublicacion]);
    }

    publicarEnComunidad(): void {
        this.router.navigate(['/publicacion'], { 
            queryParams: { 
                tipo: 'comunidad',
                idComunidad: this.idComunidad 
            }
        });

        this.router.navigate(['/publicarEnComunidad']);
    }

    traerAdministradores(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.usuarioService.administradoresComunidad(this.comunidad.id).subscribe({
                next: (dataPackage: DataPackage) => {
                    if (dataPackage.status === 200) {
                        this.administradores = dataPackage.data as Usuario[];
                        console.info(this.amigos);
                        resolve(); // Resuelve la promesa
                    } else {
                        console.error(dataPackage.message);
                        reject(dataPackage.message); // Rechaza la promesa en caso de error
                    }
                },
                error: (error) => {
                    console.error('Error al obtener amigos:', error);
                    reject(error); // Rechaza la promesa en caso de error
                }
            });
        });
    }

    filtrarMiembrosVisibles(): void {
        // Verificamos que los datos requeridos estén definidos
        if (!this.amigos || !this.miembros || !this.administradores) {
            console.error("Amigos, miembros o administradores no están definidos.");
            return;
        }

        const amigosIds = this.amigos.map(amigo => amigo.id);
        this.miembrosVisibles = []; // Reiniciamos la lista de miembros visibles
        this.usuariosAnonimos = 0; // Reiniciamos el conteo de usuarios anónimos
        
        const creador = this.miembros[0]; // Asumiendo que `this.miembros[0]` es el creador
        if (creador) {
            this.miembrosVisibles.push(creador);
        }

        // Agregar administradores a la lista visible
        this.administradores.forEach(admin => {
            if (!this.miembrosVisibles.some(m => m.id === admin.id)) {
                this.miembrosVisibles.push(admin);
            }
        });
        // Verificamos si la comunidad es privada
        if ((!this.comunidad.esPrivada)|| ((this.comunidad.esPrivada) && (this.esParte))) {
            // Solo se mostrará el creador y los miembros si el usuario es parte

            // Iterar sobre los miembros y añadir solo aquellos que sean visibles
            this.miembros.forEach(miembro => {
                console.info(this.idUsuarioAutenticado+"A");
                console.info(miembro.id+"B");

                if (miembro.id === this.idUsuarioAutenticado) {
                        // Siempre mostrar el usuario que está viendo la lista
                        if (!this.miembrosVisibles.some(m => m.id === miembro.id)) {
                            this.miembrosVisibles.push(miembro);
                        }
                    } else if (this.esCreador || this.administradores.some(admin => admin.id === this.idUsuarioAutenticado)) {
                        // Si es el creador o un administrador, añadir todos los miembros
                        if (!this.miembrosVisibles.some(m => m.id === miembro.id)) {
                            this.miembrosVisibles.push(miembro);
                        }
                    } else {
                        // Para miembros normales, aplicar la lógica de privacidad
                        if (miembro.privacidadComunidades === 'Pública') {
                            if (!this.miembrosVisibles.some(m => m.id === miembro.id)) {
                                this.miembrosVisibles.push(miembro);
                            }
                        } else if (miembro.privacidadComunidades === 'Privada' && amigosIds.includes(miembro.id)) {
                            if (!this.miembrosVisibles.some(m => m.id === miembro.id)) {
                                this.miembrosVisibles.push(miembro);
                            }
                        } else {
                            this.usuariosAnonimos++; // Aumentar el conteo de anónimos si no se muestra
                        }
                    }
                });
            } else if(!this.esParte && this.comunidad.esPrivada) {
                {
                    this.usuariosAnonimos=this.miembros.length-this.miembrosVisibles.length;
            }
        } 
    }
}
