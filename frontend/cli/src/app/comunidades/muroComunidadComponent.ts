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

    idUsuarioAutenticado!: number;
    // esMiPerfil: boolean = false;  
    publicaciones!: Publicacion[];
    constructor(
        private route: ActivatedRoute,
        private comunidadService: ComunidadService,
        private publicacionService: PublicacionService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.getComunidad().then(() => {
            this.getPublicaciones();
        }); 
        this.idUsuarioAutenticado = Number(this.authService.getUsuarioId());
    }

    getPublicaciones(): void {
        console.log(this.idComunidad);
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


    procesarEstado(): void {
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
                this.esCreador = true;
                this.esParte = true; // El creador es parte de la comunidad por defecto

            }
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
                    // ... resto del código ...
                    this.procesarEstado();
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
        // this.publicacionService.publicarEnComunidad();
        this.router.navigate(['/publicarEnComunidad']);
    }
}