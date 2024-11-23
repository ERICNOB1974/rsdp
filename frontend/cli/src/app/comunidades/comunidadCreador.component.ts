import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener el parámetro de la URL
import { ComunidadService } from './comunidad.service'; // Servicio para obtener las comunidades
import { UsuarioService } from '../usuarios/usuario.service';
import { Comunidad } from './comunidad'; // Modelo de la comunidad
import { CommonModule, Location } from '@angular/common'; // Para manejar navegación
import { MatSnackBar } from '@angular/material/snack-bar';
import { forkJoin } from 'rxjs';
import { AuthService } from '../autenticacion/auth.service';
import { Usuario } from '../usuarios/usuario';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-comunidad-admin',
    templateUrl: './comunidadCreador.component.html',
    styleUrls: ['./comunidadCreador.component.css'],
    imports: [CommonModule, FormsModule],
    standalone: true
})
export class ComunidadCreadorComponent implements OnInit {

    comunidad!: Comunidad; // Comunidad específica que se va a mostrar
    solicitudesPendientes: any[] = []; // Lista de solicitudes pendientes para comunidades privadas
    miembros: any[] = []; // Lista de miembros de la comunidad
    administradores: any[] = []; // Lista de miembros de la comunidad
    idUsuarioAutenticado!: number;  // ID del usuario autenticado
    creadorComunidad!: Usuario;
    esCreador: boolean = false;
    esAdmin: boolean = false;
    motivo: string = '';
    mensaje: string = '';
    miembrosVisibles: Usuario[] = []; // Miembros visibles actualmente
    cargaInicial: number = 5; // Número inicial de elementos visibles
    cargaIncremento: number = 5; // Número de elementos adicionales cargados en cada scroll

    constructor(
        private route: ActivatedRoute, // Para obtener el parámetro de la URL
        private comunidadService: ComunidadService, // Servicio para obtener la comunidad por ID
        private usuarioService: UsuarioService,
        private location: Location, // Para manejar la navegación
        private router: Router,
        private authService: AuthService,  // Inyecta el AuthService
        private snackBar: MatSnackBar, // Para mostrar notificaciones
        private modalService: NgbModal
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getComunidad(); // Al inicializar el componente, obtener los detalles de la comunidad
        const usuarioId = this.authService.getUsuarioId();
        this.idUsuarioAutenticado = Number(usuarioId);
 

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
        this.usuarioService.usuarioCreadorComunidad(this.comunidad.id).subscribe(dataPackage => {
            this.creadorComunidad = dataPackage.data as Usuario;
            if (this.creadorComunidad.id == this.idUsuarioAutenticado) {
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
                this.miembros = miembrosData.data as Usuario[];
            }
            
            if (Array.isArray(administradoresData.data)) {
                this.administradores = administradoresData.data as Usuario[];
            }
            
            // Combina ambos arrays
            this.miembros = this.miembros.concat(this.administradores);
            
            // Verificar roles
            this.verificarRoles();
            
            // Eliminar duplicados después de verificar roles
            this.miembros = this.miembros.reduce((acc: Usuario[], user: Usuario) => {
                if (!acc.some((existingUser: Usuario) => existingUser.id === user.id)) {
                    acc.push(user);
                }
                return acc;
            }, []);
            this.miembrosVisibles = this.miembros.slice(0, this.cargaInicial);
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
            this.traerMiembrosYAdministradores(); // Actualiza la lista de miembros
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

    eliminarMiembro(usuario: Usuario): void {
        this.comunidadService.eliminarMiembro(this.idUsuarioAutenticado, usuario.id, this.comunidad.id).subscribe(dataPackage => {
            let mensaje = JSON.stringify(dataPackage.data); // Convierte a string
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
            this.traerMiembrosYAdministradores(); // Actualiza la lista de miembros
        });
    }

    openModal(content: any) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }

    // Método que se llama al enviar la notificación
    enviarNotificacion() {
        if (this.mensaje && this.motivo) {
            const nombreActividad = "de la comunidad, " + this.comunidad.nombre;
            this.comunidadService.enviarNotificacionComunidad(this.mensaje, this.motivo, this.miembros, nombreActividad).subscribe(
                response => {
                    console.log('Notificación enviada con éxito', response);
                    this.motivo = '';
                    this.mensaje = '';
                    this.closeModal();
                    this.snackBar.open('Notificación enviada con éxito', 'Cerrar', {
                        duration: 3000,
                    });
                },
                error => {
                    this.snackBar.open('Error al enviar notificación', 'Cerrar', {
                        duration: 3000,
                    });
                }
            );
        } else {
            console.log('Ambos campos son obligatorios');
        }
    }

    // Método para cerrar el modal
    closeModal() {
        this.modalService.dismissAll();
    }

    verPerfil(usuario: Usuario): void {
        this.router.navigate(['/perfil', usuario.id]); // Navega al perfil del usuario
    }

    onScroll(): void {
        const element = document.querySelector('.members-list') as HTMLElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
            this.cargarMasMiembros();

        }
    }
    cargarMasMiembros(): void {
        const totalCargados = this.miembrosVisibles.length;
        const nuevosMiembros = this.miembros.slice(totalCargados, totalCargados + this.cargaIncremento);
    
        if (nuevosMiembros.length > 0) {
            this.miembrosVisibles = [...this.miembrosVisibles, ...nuevosMiembros];
        } else {
            console.log('No hay más miembros por cargar');
        }
    }
    
}