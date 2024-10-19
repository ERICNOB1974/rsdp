import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener el parámetro de la URL
import { ComunidadService } from './comunidad.service'; // Servicio para obtener las comunidades
import { UsuarioService } from '../usuarios/usuario.service';
import { Comunidad } from './comunidad'; // Modelo de la comunidad
import { CommonModule, Location } from '@angular/common'; // Para manejar navegación
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../usuarios/auntenticacion.service';
import { forkJoin } from 'rxjs';

@Component({
    selector: 'app-comunidad-admin',
    templateUrl: './comunidadCreador.component.html',
    styleUrls: ['./comunidadCreador.component.css'],
    imports: [CommonModule],
    standalone: true
})
export class ComunidadCreadorComponent implements OnInit {

    comunidad!: Comunidad; // Comunidad específica que se va a mostrar
    solicitudesPendientes: any[] = []; // Lista de solicitudes pendientes para comunidades privadas
    miembros: any[] = []; // Lista de miembros de la comunidad
    administradores: any[] = []; // Lista de miembros de la comunidad
    idUsuarioAutenticado!: number;  // ID del usuario autenticado
    esCreador: boolean = false;  
    esAdmin: boolean = false;    

    constructor(
        private route: ActivatedRoute, // Para obtener el parámetro de la URL
        private comunidadService: ComunidadService, // Servicio para obtener la comunidad por ID
        private usuarioService: UsuarioService,
        private location: Location, // Para manejar la navegación
        private router: Router,
        private authService: AuthService,  // Inyecta el AuthService
        private snackBar: MatSnackBar // Para mostrar notificaciones
    ) { }

    ngOnInit(): void {
        this.obtenerUsuarioAutenticado();
        this.getComunidad(); // Al inicializar el componente, obtener los detalles de la comunidad
    }

    obtenerUsuarioAutenticado(): void {
        const usuarioAutenticado = this.authService.obtenerUsuarioAutenticado();
        if (usuarioAutenticado) {
            this.idUsuarioAutenticado = usuarioAutenticado.id;
        }
    }

    getComunidad(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id || isNaN(parseInt(id, 10))) {
            this.router.navigate(['comunidades/crearComunidad']);
        } else {
            this.comunidadService.get(parseInt(id)).subscribe(dataPackage => {
                this.comunidad = <Comunidad>dataPackage.data;

                // Ahora, hacer una llamada adicional para obtener el creador
                this.getCreadorComunidad();
                
                if (this.comunidad.esPrivada) {
                    this.getSolicitudesPendientes();
                }
                this.traerMiembrosYAdministradores();
            });
        }
    }
    // Método para obtener las solicitudes pendientes si la comunidad es privada
    getSolicitudesPendientes(): void {
        this.comunidadService.visualizarSolicitudes(this.idUsuarioAutenticado, this.comunidad.id).subscribe(dataPackage => {
            if (Array.isArray(dataPackage.data)) {
                this.solicitudesPendientes = dataPackage.data;
            }
        });
    }

    getCreadorComunidad(): void {
        this.usuarioService.getCreadorComunidad(this.idUsuarioAutenticado,this.comunidad.id).subscribe(dataPackage => {
            const creador = dataPackage.data;
            console.log('Creador de la comunidad:', creador); // Añadir log para verificar el valor
            if (creador) {
                this.esCreador = true;  // El usuario es el creador
            }
        });
    }
    
    verificarRoles(): void {
        // Si el usuario autenticado está en la lista de administradores, también es un admin
        if (this.administradores.some(admin => admin.id == this.idUsuarioAutenticado)) {
            this.esAdmin = true;
        }
    }

    
    traerMiembrosYAdministradores(): void {
        const miembros$ = this.usuarioService.miembrosComunidad(this.comunidad.id);
        const administradores$ = this.usuarioService.administradoresComunidad(this.comunidad.id);
    
        forkJoin([miembros$, administradores$]).subscribe(([miembrosData, administradoresData]) => {
            if (Array.isArray(miembrosData.data)) {
                this.miembros = miembrosData.data;
            }
    
            if (Array.isArray(administradoresData.data)) {
                this.administradores = administradoresData.data;
            }
            
            // Combina ambos arrays después de que se hayan completado las solicitudes
            this.miembros = this.miembros.concat(this.administradores);
            this.verificarRoles(); // Verificar roles después de obtener los miembros y admins
        });
    }

    traerMiembros(): void {
        this.usuarioService.miembrosComunidad(this.comunidad.id).subscribe(dataPackage => {
            if (Array.isArray(dataPackage.data)) {
                this.miembros = dataPackage.data;
            }
        });
    }
    
    traerAdministradores(): void {
        this.usuarioService.administradoresComunidad(this.comunidad.id).subscribe(dataPackage => {
            if (Array.isArray(dataPackage.data)) {
                this.administradores = dataPackage.data;
            }
        });
    }


    // Método para rechazar una solicitud de ingreso
    gestionarSolicitud(idUsuario: number, aceptada: boolean): void {
        this.comunidadService.gestionarSolicitudIngreso(this.idUsuarioAutenticado, idUsuario, this.comunidad.id, aceptada).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.getSolicitudesPendientes(); // Actualiza la lista de solicitudes pendientes
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
        });
    }

    // Método para eliminar la comunidad
    eliminarComunidad(): void {
           this.comunidadService.remove(this.comunidad.id).subscribe(dataPackage => {
             let mensaje = dataPackage.message;
             this.snackBar.open(mensaje, 'Cerrar', {
               duration: 3000,
             });
             this.router.navigate(['/comunidades']);
           }); 
    }

    // Método para otorgar el rol de organizador a un miembro
    otorgarRolOrganizador(idMiembro: number): void {
        this.comunidadService.otorgarRolAdministrador(this.idUsuarioAutenticado, idMiembro, this.comunidad.id).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
            this.traerMiembrosYAdministradores(); // Actualiza la lista de miembros
        });
    }

    // Método para remover el rol de organizador a un miembro
    quitarRolOrganizador(idMiembro: number): void {
        this.comunidadService.quitarRolAdministrador(this.idUsuarioAutenticado, idMiembro, this.comunidad.id).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
            this.traerMiembrosYAdministradores(); // Actualiza la lista de miembros
        });
    }

    // Método para regresar a la página anterior
    goBack(): void {
        this.location.back();
    }

    // Método para editar la comunidad
    editarComunidad(): void {
        this.router.navigate(['/editarComunidad/', this.comunidad.id]);
    }

    esAdministrador(idMiembro: number): boolean {
        return this.administradores.some(admin => admin.id === idMiembro);
    }

    eliminarMiembro(): void {
        }
    
}
