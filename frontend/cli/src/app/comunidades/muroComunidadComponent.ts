import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, NgIf } from '@angular/common';
import { Publicacion } from '../publicaciones/publicacion';
import { PublicacionService } from '../publicaciones/publicacion.service';
import { AuthService } from '../autenticacion/auth.service';
import { UsuarioService } from '../usuarios/usuario.service';
import { Usuario } from '../usuarios/usuario';
import { Evento } from '../eventos/evento'
import { DataPackage } from '../data-package';
import { lastValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { EventoService } from '../eventos/evento.service';

@Component({
    selector: 'app-editar-comunidad',
    standalone: true,
    imports: [CommonModule, FormsModule, NgIf, RouterModule],
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
    creadorComunidad!: Usuario;
    miembros!: Usuario[];
    amigos!: Usuario[];
    administradores!: Usuario[];
    idUsuarioAutenticado!: number;
    usuariosAnonimos: number = 0; // Inicializamos la variable
    miembrosVisibles: any[] = []; // Almacena los usuarios visibles en la interfaz
    publicaciones: Publicacion[] = [];
    visible: boolean = false;
    esAdministrador: boolean = false;
    currentIndexPublicaciones: number = 0;
    cantidadPorPagina: number = 6;
    noMasPublicaciones: boolean = false;
    loandingPublicaciones: boolean = false;
    amigosNoEnComunidad: any[] = [];
    amigosEnComunidad: any[] = [];
    amigosYaInvitados: any[] = [];
    cantidadMiembros: number = 0;
    esFavorito: boolean = false;
    cargaInicial: number = 5; // Número inicial de elementos visibles
    cargaIncremento: number = 5; // Número de elementos adicionales cargados en cada scroll
    miembrosVisiblesPaginados: any[] = []; // Almacena los usuarios visibles en la interfaz

    buscador: string = '';
    amigosNoEnComunidadFiltrados: any[] = [];
    amigosEnComunidadFiltrados: any[] = [];
    amigosYaInvitadosFiltrados: any[] = [];
    mostrarAmigosNoEnComunidad: boolean = true;
    mostrarAmigosEnComunidad: boolean = true;
    mostrarAmigosYaInvitados: boolean = true;
    mostrarMasAmigosNoEnComunidad: number = 4;
    mostrarMasAmigosEnComunidad: number = 4;
    mostrarMasAmigosYaInvitados: number = 4;
    mostrarMotivo: boolean = false;
    expulsado: boolean = false; // Indica si el usuario fue expulsado
    motivoExpulsion: string = '';


    @ViewChild('modalInvitarAmigos') modalInvitarAmigos!: TemplateRef<any>;

    eventos: any[] = [];

    constructor(
        private route: ActivatedRoute,
        private comunidadService: ComunidadService,
        private publicacionService: PublicacionService,
        private usuarioService: UsuarioService,
        private authService: AuthService,
        private router: Router,
        private snackBar: MatSnackBar,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private eventoService: EventoService
    ) { }


    ngOnInit(): void {
        const state = window.history.state;
        if (state && state.mensajeSnackBar) {
          this.snackBar.open(state.mensajeSnackBar, 'Cerrar', {
            duration: 3000,
          });
        }
        this.idUsuarioAutenticado = Number(this.authService.getUsuarioId());
        this.getComunidad().then(() => {
            //this.traerMiembros(); //quien fue el gil
            if ((!this.comunidad.esPrivada) || (this.esParte)) {
                this.getPublicaciones();
                this.traerMiembros();
                this.obtenerEventosDeLaComunidad();
            }
            this.checkExpulsion();

            if (this.esParte) {
                this.comunidadService.esFavorita(this.comunidad.id).subscribe(dataPackage => {
                    this.esFavorito = dataPackage.data as unknown as boolean;
                });
            }
            this.cargarAmigos();
        });
    }

    toggleMotivo() {
        this.mostrarMotivo = !this.mostrarMotivo;
    }


    checkExpulsion() {
        this.comunidadService.verificarExpulsion(this.idUsuarioAutenticado, this.comunidad.id)
            .subscribe(response => {
                this.expulsado = response.data as unknown as boolean;
                this.motivoExpulsion = response.message; // Asumiendo que el backend devuelve el motivo
            });
    }

    obtenerEventosDeLaComunidad(): void {
        this.eventoService.eventosDeUnaComunidad(this.comunidad.id).subscribe((dataPackage: DataPackage) => {
            this.eventos = dataPackage.data as Evento[];
            this.eventos.forEach(async (evento) => {
                this.obtenerCreadorDelEvento(this.comunidad.id, evento.id); // Obtener el creador del evento
                // Setear la ubicación solo si tiene latitud y longitud
                // if (evento.latitud && evento.longitud) {
                //     evento.ubicacion = await this.eventoService.obtenerUbicacion(evento.latitud, evento.longitud);
                // } else {
                //     evento.ubicacion = 'Ubicación desconocida';
                // }
            });
            this.traerParticipantes(this.eventos); // Obtener los participantes
        });
    }

    obtenerCreadorDelEvento(comunidadId: number, eventoId: number): void {
        this.eventoService.buscarCreadorDeUnEventoInterno(comunidadId, eventoId).subscribe((dataPackage: DataPackage) => {
            const evento = this.eventos.find(e => e.id === eventoId);
            if (evento) {
                evento.creador = dataPackage.data; // Asigna el creador al evento
            }
        });
    }

    traerParticipantes(eventos: Evento[]): void {
        // Recorrer todos los eventos y obtener el número de participantes
        for (let evento of eventos) {
            this.eventoService.participantesEnEvento(evento.id).subscribe(
                (dataPackage) => {
                    // Asignar el número de participantes al evento
                    if (dataPackage && typeof dataPackage.data === 'number') {
                        evento.participantes = dataPackage.data; // Asignar el número de participantes
                    }
                },
                (error) => {
                    console.error(`Error al traer los participantes del evento ${evento.id}:`, error);
                }
            );
        }
    }

    irADetalleEvento(eventoId: number): void {
        this.router.navigate([`eventos/${eventoId}`]);
    }

    abrirModalInvitarAmigos(): void {
        this.cargarAmigos();
        this.dialog.open(this.modalInvitarAmigos);
    }

    cerrarModal(): void {
        this.buscador = '';
        this.dialog.closeAll();
    }

    cargarAmigos(): void {
        const idComunidad = this.comunidad.id;

        // Cargar amigos que ya están en la comunidad
        this.usuarioService.todosLosAmigosDeUnUsuarioPertenecientesAUnaComunidad(idComunidad).subscribe((dataPackage) => {
            this.amigosEnComunidad = dataPackage.data as Comunidad[];
            this.amigosEnComunidadFiltrados = [...this.amigosEnComunidad]; // Sincronizar
            this.mostrarCategorias();
        });

        // Cargar amigos ya invitados a la comunidad
        this.usuarioService.todosLosAmigosDeUnUsuarioYaInvitadosAUnaComunidadPorElUsuario(idComunidad).subscribe((dataPackage) => {
            this.amigosYaInvitados = dataPackage.data as Comunidad[];
            this.amigosYaInvitadosFiltrados = [...this.amigosYaInvitados]; // Sincronizar
            this.mostrarCategorias();
        });

        // Cargar amigos que no están en la comunidad
        this.usuarioService.todosLosAmigosDeUnUsuarioNoPertenecientesAUnaComunidad(idComunidad).subscribe((dataPackage) => {
            this.amigosNoEnComunidad = dataPackage.data as Comunidad[];
            this.amigosNoEnComunidad = this.amigosNoEnComunidad.filter(
                amigoNoEnComunidad =>
                    !this.amigosEnComunidad.some(amigoEnComunidad => amigoEnComunidad.id === amigoNoEnComunidad.id) &&
                    !this.amigosYaInvitados.some(amigoYaInvitado => amigoYaInvitado.id === amigoNoEnComunidad.id)
            );
            this.amigosNoEnComunidadFiltrados = [...this.amigosNoEnComunidad]; // Sincronizar
            this.mostrarCategorias();
        });
    }


    invitarAmigo(idUsuarioReceptor: number): void {
        const idComunidad = this.comunidad.id;
        this.usuarioService.enviarInvitacionComunidad(idUsuarioReceptor, idComunidad).subscribe(() => {
            this.cargarAmigos();
            this.cdr.detectChanges(); // Fuerza la actualización del modal
            this.snackBar.open('Invitación enviada con éxito', 'Cerrar', {
                duration: 3000,
            });
        },
            error => {
                console.error('Error al invitar al amigo:', error);
                this.snackBar.open('Error al enviar la invitación', 'Cerrar', {
                    duration: 3000,
                });
            });

        lastValueFrom(this.usuarioService.invitacionComunidad(idUsuarioReceptor, idComunidad)).catch(error => {
            console.error('Error al enviar el email de invitación:', error);
        });
    }

    filtrarAmigos(): void {
        const textoBusqueda = this.buscador.trim().toLowerCase();

        if (textoBusqueda) {
            this.amigosNoEnComunidadFiltrados = this.amigosNoEnComunidad.filter(amigo =>
                amigo.nombreUsuario.toLowerCase().includes(textoBusqueda)
            );
            this.amigosEnComunidadFiltrados = this.amigosEnComunidad.filter(amigo =>
                amigo.nombreUsuario.toLowerCase().includes(textoBusqueda)
            );
            this.amigosYaInvitadosFiltrados = this.amigosYaInvitados.filter(amigo =>
                amigo.nombreUsuario.toLowerCase().includes(textoBusqueda)
            );
        } else {
            this.amigosNoEnComunidadFiltrados = [...this.amigosNoEnComunidad];
            this.amigosEnComunidadFiltrados = [...this.amigosEnComunidad];
            this.amigosYaInvitadosFiltrados = [...this.amigosYaInvitados];
        }

        this.mostrarCategorias(); // Siempre actualizar visibilidad
    }


    mostrarCategorias(): void {
        this.mostrarAmigosNoEnComunidad = this.amigosNoEnComunidadFiltrados.length > 0;
        this.mostrarAmigosEnComunidad = this.amigosEnComunidadFiltrados.length > 0;
        this.mostrarAmigosYaInvitados = this.amigosYaInvitadosFiltrados.length > 0;
    }

    verMasAmigos(categoria: string): void {
        switch (categoria) {
            case 'noEnComunidad':
                this.mostrarMasAmigosNoEnComunidad += 4;
                break;
            case 'enComunidad':
                this.mostrarMasAmigosEnComunidad += 4;
                break;
            case 'yaInvitados':
                this.mostrarMasAmigosYaInvitados += 4;
                break;
        }
    }

    getPublicaciones(): void {
        if (this.loandingPublicaciones || this.noMasPublicaciones) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
        this.loandingPublicaciones = true;
        // Suponiendo que tienes un método que obtiene más comunidades con paginación
        this.publicacionService
            .publicacionesComunidad(this.idComunidad, this.currentIndexPublicaciones, this.cantidadPorPagina)
            .subscribe(
                async (dataPackage) => {
                    const resultados = dataPackage.data as Publicacion[]
                    if (resultados && resultados.length > 0) {
                        this.publicaciones = [...this.publicaciones, ...resultados,];
                        this.currentIndexPublicaciones++; // Aumentar el índice para la siguiente carga

                    } else {
                        this.noMasPublicaciones = true; // No hay más comunidades por cargar
                    }
                    this.loandingPublicaciones = false; // Desactivar el indicador de carga
                },
                (error) => {
                    console.error('Error al cargar las publicaciones:', error);
                    this.loandingPublicaciones = false;
                }
            );
    }

    async traerMiembros(): Promise<void> {
        this.usuarioService.miembrosComunidad(this.comunidad.id).subscribe(async dataPackage => {
            if (Array.isArray(dataPackage.data)) {
                this.miembros = dataPackage.data;
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

    async getCantidadMiembros() {
        this.comunidadService.cantidadMiembrosEnComunidad(this.comunidad.id).subscribe(dataPackage => {
            this.cantidadMiembros = <number><unknown>dataPackage.data;
            this.comunidad.miembros=<number><unknown>dataPackage.data;
            this.comunidad.participantes=this.cantidadMiembros;
        });
    }
    async getCreadorOAdministradorComunidad(): Promise<void> {
        return new Promise((resolve) => {
            this.usuarioService.usuarioCreadorComunidad(this.comunidad.id).subscribe(dataPackage => {
                this.creadorComunidad = dataPackage.data as Usuario;
                if (this.creadorComunidad.id == this.idUsuarioAutenticado) {
                    this.esCreador = true;  // El usuario es el creador
                }
                resolve(); // Resuelve la promesa después de procesar el estado
            })
        });
    }


    async procesarEstado(): Promise<void> {
        return new Promise((resolve) => {
            this.comunidadService.estadoSolicitud(this.comunidad.id).subscribe(dataPackage => {
                let estado = <String>dataPackage.data;
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
                if (estado == "Administrador") {
                    this.esAdministrador = true;
                    this.esParte = true; // El creador es parte de la comunidad por defecto
                }
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
                    this.comunidadService.puedeVer(parseInt(id)).subscribe(dataP => {
                        this.visible = <boolean><unknown>dataP.data
                    });
                    this.visible = true
                    this.comunidad = <Comunidad>dataPackage.data;
                    this.idComunidad = this.comunidad.id;
                    await this.procesarEstado(); // Asegúrate de que procesarEstado complete
                    await this.getCreadorOAdministradorComunidad();
                    if (this.visible) {
                        this.getCantidadMiembros();
                    }
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

    }

    traerAdministradores(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.usuarioService.administradoresComunidad(this.comunidad.id).subscribe({
                next: (dataPackage: DataPackage) => {
                    if (dataPackage.status === 200) {
                        this.administradores = dataPackage.data as Usuario[];
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
        console.log("ERICC2");

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
        if ((!this.comunidad.esPrivada) || ((this.comunidad.esPrivada) && (this.esParte))) {
            // Solo se mostrará el creador y los miembros si el usuario es parte
            // Iterar sobre los miembros y añadir solo aquellos que sean visibles
            this.miembros.forEach(miembro => {

                if (miembro.id === this.idUsuarioAutenticado) {
                    // Siempre mostrar el usuario que está viendo la lista
                    if (!this.miembrosVisibles.some(m => m.id === miembro.id)) {
                        this.miembrosVisibles.push(miembro);
                    }
                } else if (miembro.id == this.creadorComunidad.id) {
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
                    } else if (miembro.privacidadComunidades === 'Solo amigos' && amigosIds.includes(miembro.id)) {
                        if (!this.miembrosVisibles.some(m => m.id === miembro.id)) {
                            this.miembrosVisibles.push(miembro);
                        }
                    } else {
                        if (!this.administradores.some(admin => admin.id === miembro.id)) {
                            this.usuariosAnonimos++; // Aumentar el conteo de anónimos si no se muestra
                        }
                    }
                }
            });
        } else if (!this.esParte && this.comunidad.esPrivada) {
            {
                console.log("ERICC");
                this.usuariosAnonimos = this.miembros.length - 1;
            }
        }
        this.miembrosVisiblesPaginados = this.miembrosVisibles.slice(0, this.cargaInicial);
    }

    ingresar(): void {
        this.usuarioService.solicitarIngresoAComunidad(this.comunidad.id).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.procesarEstado();
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
        });

    }

    salir(): void {
        this.comunidadService.salir(this.comunidad.id).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.procesarEstado();
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000, // Duración del snackbar en milisegundos
            });
        });
        this.esFavorito = false;
    }

    salirValid(): boolean {
        if (this.esParte || this.esCreador || this.esAdministrador) {
            return true;
        }
        return false;
        // Permitir salir si el usuario es parte de la comunidad y no es el creador
        //return this.esParte && !this.esCreador;
    }

    inscribirseValid(): boolean {
        if (this.cantidadMiembros < this.comunidad.cantidadMaximaMiembros) {
            if (!this.esParte
                && !this.pendiente
                && !this.esCreador)
                return true;
            return false;
        }
        return false;
    }


    gestionarComunidad() {
        this.router.navigate(['/creadorComunidad', this.comunidad.id]);
    }


    crearEvento() {
        if (this.esParte) {
            this.router.navigate([`/comunidades/${this.comunidad.id}/eventos/crearEvento`]);
        }
    }

    obtenerRol(miembro: Usuario): string {
        if (miembro.id === this.creadorComunidad.id) {
            return 'Creador';
        } else if (this.administradores.includes(miembro)) {
            return 'Administrador';
        } else {
            return 'Miembro';
        }
    }

    onScroll(tabName: string): void {
        const element = document.querySelector('.publicaciones-list') as HTMLElement; //si se quiere hacer scroll en otros lados. llamar a todos con el mismo class en el div

        if (element) {
            // Detecta si se ha alcanzado el final del scroll
            const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

            if (isAtBottom) {
                switch (tabName) {
                    case 'publicaciones':
                        this.getPublicaciones();
                        break;
                    default:
                        console.error('Vista no reconocida:', tabName);
                }
            }
        } else {
            console.error('.scrollable-list no encontrado.');
        }
    }

    onScrollMiembros(): void {
        const element = document.querySelector('.perfil-miembros') as HTMLElement;
        if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
            this.cargarMasMiembros();
        }
    }

    cargarMasMiembros(): void {
        const totalCargados = this.miembrosVisiblesPaginados.length;
        const nuevosMiembros = this.miembros.slice(totalCargados, totalCargados + this.cargaIncremento);

        if (nuevosMiembros.length > 0) {
            this.miembrosVisiblesPaginados = [...this.miembrosVisiblesPaginados, ...nuevosMiembros];
        } else {
            console.log('No hay más participantes por cargar');
        }
    }

    async toggleFavorito() {
        this.esFavorito = !this.esFavorito;
        await lastValueFrom(this.comunidadService.marcarComunidadFavorita(this.comunidad.id));
        const mensaje = this.esFavorito
            ? 'Comunidad marcada como favorita'
            : 'Comunidad quitada de favoritas';

        this.snackBar.open(mensaje, 'Cerrar', {
            duration: 3000,
        });
        // Aquí envías la actualización al backend para registrar el cambio.
    }
}
