import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
import { Expulsado } from './expulsado';

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
    moderadores: any[] = []; // Lista de miembros de la comunidad
    idUsuarioAutenticado!: number;  // ID del usuario autenticado
    creadorComunidad!: Usuario;
    esCreador: boolean = false;
    esAdmin: boolean = false;
    esMod: boolean = false;

    motivo: string = '';
    mensaje: string = '';
    expulsados: Usuario[] = []; // Miembros visibles actualmente
    cargaInicial: number = 5; // Número inicial de elementos visibles
    cargaIncremento: number = 5; // Número de elementos adicionales cargados en cada scroll
    motivoExpulsion: string = '';
    usuarioEliminar: any;
    mostrarMotivo: boolean = false;
    fechaExpulsion: Date | string = '';
    horaExpulsion: Date | string = '';
    tipoExpulsion: string = 'permanente'; // Valor predeterminado
    //expulsado: boolean = false; // Indica si el usuario fue expulsado
    estadoActual: string = 'miembros'; // Por defecto, se muestra la sección de Miembros
    loading: boolean = false;  // Para manejar el estado de carga
    loadingScroll: boolean = false;
    searchTerm: string = '';  // Para almacenar el término de búsqueda
    page: number = 0;         // Página actual
    pageSolicitudes: number = 0;         // Página actual
    loadingSolicitudes: boolean = false;  // Para manejar el estado de carga
    pageExpulsados: number = 0;         // Página actual
    loadingExpulsados: boolean = false;  // Para manejar el estado de carga
    size: number = 5;
    searchTimeout: any // Variable para almacenar el timer
    @ViewChild('modalExpulsion') modalExpulsion!: TemplateRef<any>; // Referencia al modal
    expulsado: Expulsado | undefined;
    constructor(
        private route: ActivatedRoute, // Para obtener el parámetro de la URL
        private comunidadService: ComunidadService, // Servicio para obtener la comunidad por ID
        private usuarioService: UsuarioService,
        private location: Location, // Para manejar la navegación
        private router: Router,
        private authService: AuthService,  // Inyecta el AuthService
        private snackBar: MatSnackBar, // Para mostrar notificaciones
        public modalService: NgbModal
    ) { }

    async ngOnInit(): Promise<void> {
        await this.getComunidad(); // Al inicializar el componente, obtener los detalles de la comunidad
        const usuarioId = this.authService.getUsuarioId();
        this.idUsuarioAutenticado = Number(usuarioId);

    }



    seleccionarUsuario(usuario: any): void {
        this.usuarioEliminar = usuario;
    }

    cambiarVista(estado: string) {
        this.estadoActual = estado;
    }


    confirmarExpulsion(): void {
        if (!this.motivoExpulsion.trim()) {
            this.snackBar.open('Por favor, ingresa un motivo válido.', 'Cerrar', {
                duration: 3000,
            });
            return;
        }

        let fechaHoraExpulsion: Date;

        if (this.tipoExpulsion === 'permanente') {
            // Si es permanente, se establece una fecha muy lejana (año 9999)
            fechaHoraExpulsion = new Date(9998, 11, 31, 15, 0); // 31 de diciembre de 9999 a las 23:59
        } else if (!this.fechaExpulsion || !this.horaExpulsion) {
            this.snackBar.open('Por favor, selecciona la fecha y hora de la expulsión.', 'Cerrar', {
                duration: 3000,
            });
            return;
        } else {
            // Combinar fecha y hora en un solo objeto Date solo si ambos son válidos
            const fecha = new Date(this.fechaExpulsion);

            const hora = new Date('1970-01-01T' + this.horaExpulsion + 'Z'); // Crear un objeto Date solo con la hora

            if (isNaN(fecha.getTime()) || isNaN(hora.getTime())) {
                this.snackBar.open('Por favor, selecciona una fecha y hora válidas.', 'Cerrar', {
                    duration: 3000,
                });
                return;
            }

            // Combinar la fecha y la hora
            fechaHoraExpulsion = new Date(Date.UTC(
                fecha.getUTCFullYear(),
                fecha.getUTCMonth(),
                fecha.getUTCDate(),
                hora.getUTCHours(),
                hora.getUTCMinutes()
            ));

        }

        // Verificar si el usuario está en el array de expulsados
        const usuarioExpulsado = this.expulsados.find(user => user.id === this.usuarioEliminar.id);

        if (usuarioExpulsado) {
            // Si está en la lista, hacer un PUT para editar la expulsión
            this.editarExpulsion(this.usuarioEliminar.id, this.motivoExpulsion, fechaHoraExpulsion);
        } else {
            // Si no está en la lista, proceder con la eliminación
            this.eliminarMiembro(this.usuarioEliminar.id, this.motivoExpulsion, fechaHoraExpulsion);
        }
        // Limpia los datos
        this.motivoExpulsion = '';
        this.fechaExpulsion = '';
        this.horaExpulsion = '';
        this.usuarioEliminar = null;
    }


    async abrirModalExpulsion(usuario: any): Promise<void> {
        this.usuarioEliminar = usuario;

        await this.checkExpulsion(usuario.id); // Espera a que se complete la verificación

        if (this.expulsado?.estaExpulsado) {
            this.motivoExpulsion = this.expulsado.motivoExpulsion;
            this.fechaExpulsion = this.expulsado.fechaHoraExpulsion;
            this.tipoExpulsion = this.expulsado.tipo === 'permanente' ? 'permanente' : 'temporal';
            const fechaHora = new Date(this.expulsado.fechaHoraExpulsion); // Asegurar que es un objeto Date

            this.fechaExpulsion = fechaHora.toISOString().split('T')[0]; // "YYYY-MM-DD"
            this.horaExpulsion = fechaHora.toTimeString().substring(0, 5); // "HH:mm"

        } else {
            this.motivoExpulsion = '';
            this.tipoExpulsion = 'temporal';
            this.fechaExpulsion = '';
            this.horaExpulsion = '';
        }
        if (this.tipoExpulsion === 'permanente') {
            this.fechaExpulsion = '';
            this.horaExpulsion = '';
        }

        this.modalService.open(this.modalExpulsion, {
            centered: true,
            backdrop: 'static',
            keyboard: false,
        });
    }

    checkExpulsion(idUsuario: number): Promise<void> {
        return new Promise((resolve) => {
            this.comunidadService.verificarExpulsion(idUsuario, this.comunidad.id)
                .subscribe(response => {
                    this.expulsado = response.data as Expulsado;
                    resolve(); // Marca la promesa como completada
                });
        });
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
                this.traerMiembros();
                this.traerAdministradores();
                this.traerModeradores();
                this.getExpulsados();
            });
        }
    }
    // Método para obtener las solicitudes pendientes si la comunidad es privada
    getSolicitudesPendientes(): void {
        if (this.loadingSolicitudes) return;  // Evitar solicitudes repetidas mientras se cargan datos
        this.loadingSolicitudes = true;
        // Llamada al servicio para obtener miembros filtrados por el término de búsqueda
        this.comunidadService.visualizarSolicitudes(this.comunidad.id, this.searchTerm, this.pageSolicitudes, this.size)
            .subscribe(async dataPackage => {
                console.info("entre pendientes", dataPackage.data);
                if (Array.isArray(dataPackage.data)) {
                    // Si es la primera página, reinicia la lista de miembros
                    if (this.page === 0) {
                        this.solicitudesPendientes = dataPackage.data;

                    } else {
                        // Si no es la primera página, agrega los nuevos miembros a la lista
                        this.solicitudesPendientes = [...this.solicitudesPendientes, ...dataPackage.data];
                    }

                }
                this.loadingScroll = false;
                this.loadingSolicitudes = false;
            });
    }


    getExpulsados(): void {
        if (this.loadingExpulsados) return;  // Evitar solicitudes repetidas mientras se cargan datos
        this.loadingExpulsados = true;

        // Llamada al servicio para obtener miembros filtrados por el término de búsqueda
        this.comunidadService.obtenerExpulsadosActivos(this.comunidad.id, this.searchTerm, this.pageExpulsados, this.size)
            .subscribe(async dataPackage => {
                console.info("entre pendientes", dataPackage.data);

                if (Array.isArray(dataPackage.data)) {
                    // Si es la primera página, reinicia la lista de miembros
                    if (this.page === 0) {
                        this.expulsados = dataPackage.data;

                    } else {
                        // Si no es la primera página, agrega los nuevos miembros a la lista
                        this.expulsados = [...this.expulsados, ...dataPackage.data];
                    }

                }
                this.loadingScroll = false;
                this.loadingExpulsados = false;
            });
    }

    getCreadorComunidad(): void {
        this.usuarioService.usuarioCreadorComunidad(this.comunidad.id).subscribe(dataPackage => {
            this.creadorComunidad = dataPackage.data as Usuario;
            if (this.creadorComunidad.id == this.idUsuarioAutenticado) {
                this.esCreador = true;  // El usuario es el creador
                console.info("Sisoy");
            }
        });
    }

    verificarRoles(): void {
        // Si el usuario autenticado está en la lista de administradores, también es un admin
        if (this.administradores.some(admin => admin.id == this.idUsuarioAutenticado)) {
            this.esAdmin = true;
        }

        // Si el usuario autenticado está en la lista de administradores, también es un admin
        if (this.moderadores.some(moderador => moderador.id == this.idUsuarioAutenticado)) {
            this.esMod = true;
        }
    }

    traerMiembrosYAdministradores(): void {


    }

    async traerMiembros(): Promise<void> {
        if (this.loading) return;  // Evitar solicitudes repetidas mientras se cargan datos
        this.loading = true;

        // Llamada al servicio para obtener miembros filtrados por el término de búsqueda
        this.usuarioService.buscarMiembro(this.comunidad.id, this.searchTerm, this.page, this.size)
            .subscribe(async dataPackage => {
                if (Array.isArray(dataPackage.data)) {
                    // Si es la primera página, reinicia la lista de miembros
                    if (this.page === 0) {
                        this.miembros = dataPackage.data;

                    } else {
                        // Si no es la primera página, agrega los nuevos miembros a la lista
                        this.miembros = [...this.miembros, ...dataPackage.data];
                    }

                }
                this.loadingScroll = false;
                this.loading = false;
            });
    }

    traerAdministradores(): void {
        this.usuarioService.administradoresComunidad(this.comunidad.id).subscribe(dataPackage => {
            if (Array.isArray(dataPackage.data)) {
                this.administradores = dataPackage.data;
                this.verificarRoles();
            }
        });
    }

    traerModeradores(): void {
        this.usuarioService.moderadoresComunidad(this.comunidad.id).subscribe(dataPackage => {
            if (Array.isArray(dataPackage.data)) {
                this.moderadores = dataPackage.data;
                this.verificarRoles();
            }
        });
    }



    // Método para rechazar una solicitud de ingreso
    gestionarSolicitud(idUsuario: number, aceptada: boolean): void {
        const nuevoMiembro = this.solicitudesPendientes.find(s => s.id === idUsuario);
        this.solicitudesPendientes = this.solicitudesPendientes.filter(s => s.id !== idUsuario);
        this.comunidadService.gestionarSolicitudIngreso(this.idUsuarioAutenticado, idUsuario, this.comunidad.id, aceptada).subscribe(dataPackage => {
            let mensaje = <string><unknown>dataPackage.data;
            this.getSolicitudesPendientes(); // Actualiza la lista de solicitudes pendientes
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });

            // Si fue aceptado, agregarlo a miembros
            if (aceptada) {
                this.miembros.push(nuevoMiembro);
            }
            //this.traerMiembrosYAdministradores(); // Actualiza la lista de miembros
        });
    }

    // Método para eliminar la comunidad
    eliminarComunidad(): void {

        this.comunidadService.remove(this.comunidad.id).subscribe(dataPackage => {
            let mensaje = <string><unknown>dataPackage.data;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
            this.router.navigate(['/comunidades']);
        });
    }

    // Método para otorgar el rol de organizador a un miembro
    otorgarRolOrganizador(idMiembro: number): void {
        const admin = this.miembros.find(s => s.id === idMiembro);
        this.administradores.push(admin);
        this.comunidadService.otorgarRolAdministrador(this.idUsuarioAutenticado, idMiembro, this.comunidad.id).subscribe(dataPackage => {
            let mensaje = <string><unknown>dataPackage.data;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });

        });
    }

    // Método para remover el rol de organizador a un miembro
    quitarRolOrganizador(idMiembro: number): void {
        //const admin = this.administradores.find(s => s.id === idMiembro);
        this.administradores = this.administradores.filter(s => s.id !== idMiembro);
        this.moderadores = this.moderadores.filter(s => s.id !== idMiembro);

        //this.miembros.push(admin);
        this.comunidadService.quitarRolAdministrador(this.idUsuarioAutenticado, idMiembro, this.comunidad.id).subscribe(dataPackage => {
            let mensaje = <string><unknown>dataPackage.data;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
        });
    }


    otorgarRolModerador(idMiembro: number): void {
        const moderador = this.miembros.find(s => s.id === idMiembro);
        this.moderadores.push(moderador);
        this.comunidadService.otorgarRolModerador(this.idUsuarioAutenticado, idMiembro, this.comunidad.id).subscribe(dataPackage => {
            let mensaje = <string><unknown>dataPackage.data;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
        });
    }

    // Método para remover el rol de organizador a un miembro
    quitarRolModerador(idMiembro: number): void {
        //const admin = this.administradores.find(s => s.id === idMiembro);
        this.moderadores = this.moderadores.filter(s => s.id !== idMiembro);
        //this.miembros.push(admin);
        this.comunidadService.quitarRolModerador(this.idUsuarioAutenticado, idMiembro, this.comunidad.id).subscribe(dataPackage => {
            let mensaje = <string><unknown>dataPackage.data;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
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


    esModerador(idMiembro: number): boolean {
        return this.moderadores.some(moderador => moderador.id === idMiembro);
    }


    eliminarMiembro(idUsuario: number, motivo: string, fechaHoraExpulsion: Date): void {
        const expulsado = this.miembros.find(s => s.id === idUsuario);
        this.miembros = this.miembros.filter(s => s.id !== idUsuario);
        this.expulsados.push(expulsado);
        this.comunidadService.eliminarMiembroConMotivo(motivo, this.tipoExpulsion, fechaHoraExpulsion.toISOString(), idUsuario, this.comunidad.id)
            .subscribe(dataPackage => {
                let mensaje = dataPackage.message;
                this.snackBar.open(mensaje, 'Cerrar', {
                    duration: 3000,
                });
            });
    }

    editarExpulsion(idUsuario: number, motivo: string, fechaHoraExpulsion: Date): void {
        this.comunidadService.editarExpulsionConMotivo(motivo, this.tipoExpulsion, fechaHoraExpulsion.toISOString(), idUsuario, this.comunidad.id)
            .subscribe(dataPackage => {
                let mensaje = dataPackage.message; // Convierte a string
                this.snackBar.open(mensaje, 'Cerrar', {
                    duration: 3000,
                });
            });
    }



    openModal(content: any) {
        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' });
    }

    abrirModal(modal: any) {
        this.modalService.open(modal, { centered: true });
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



    onScrollMiembros(): void {
        const element = document.querySelector('.members-list') as HTMLElement;
        if (!this.loadingScroll && element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
            this.loadingScroll = true;  // Marca como en proceso de carga
            this.page++;
            this.traerMiembros();  // Llama a la función de carga de miembros con la nueva página
        }
    }

    onScrollSolicitudes(): void {
        const element = document.querySelector('.solicitudes-list') as HTMLElement;
        if (!this.loadingScroll && element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
            this.loadingScroll = true;  // Marca como en proceso de carga
            this.pageSolicitudes++;
            this.getSolicitudesPendientes();  // Llama a la función de carga de miembros con la nueva página
        }
    }

    onScrollExpulsados(): void {
        const element = document.querySelector('.expulsiones-list') as HTMLElement;
        if (!this.loadingScroll && element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
            this.loadingScroll = true;  // Marca como en proceso de carga
            this.pageExpulsados++;
            this.getExpulsados();  // Llama a la función de carga de miembros con la nueva página
        }
    }


    buscarUsuarios(): void {
        // Limpia el timer anterior, si existe
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        // Configura un nuevo timer para ejecutar después de 2 segundos
        this.searchTimeout = setTimeout(() => {
            if (this.estadoActual === 'miembros') {
                this.miembros = [];
                this.page = 0; // Reinicia la página cuando cambia el término de búsqueda
                this.traerMiembros(); // Trae los miembros con el nuevo término

            } else if (this.estadoActual === 'solicitudes') {
                this.solicitudesPendientes = [];
                this.pageSolicitudes = 0; // Reinicia la página cuando cambia el término de búsqueda
                this.getSolicitudesPendientes(); // Trae los miembros con el nuevo término
            } else {
                this.expulsados = [];
                this.pageExpulsados = 0; // Reinicia la página cuando cambia el término de búsqueda
                this.getExpulsados(); // Trae los miembros con el nuevo término
            }
        }, 1000); // Retraso de 2 segundos
    }

    sacarExpulsion(idExpulsado: number): void {
        this.expulsados = this.expulsados.filter(s => s.id !== idExpulsado);
        this.comunidadService.eliminarBan(this.comunidad.id, idExpulsado).subscribe(dataPackage => {
            let mensaje = <string><unknown>dataPackage.data;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
        });
    }
}