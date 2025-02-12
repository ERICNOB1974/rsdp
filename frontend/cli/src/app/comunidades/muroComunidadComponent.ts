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
import { Comentario } from '../comentarios/Comentario';
import { Expulsado } from './expulsado';
import { IdEncryptorService } from '../idEcnryptorService';

@Component({
    selector: 'app-editar-comunidad',
    standalone: true,
    imports: [CommonModule, FormsModule, NgIf, RouterModule],
    templateUrl: './muroComunidad.component.html',
    styleUrls: ['./comunidadMuro.css']
})
export class MuroComunidadComponent implements OnInit {

    isLoading: boolean = false;
    comunidad!: Comunidad;
    idComunidad!: number;
    esParte: boolean = false;
    pendiente: boolean = false;
    tabSeleccionada: string = 'publicaciones';
    subTabSeleccionada: string = 'publicacionesAprobadas';
    esCreador: boolean = false;
    esModerador: boolean = false;
    creadorComunidad!: Usuario;
    miembros: any[] = [];
    amigos!: Usuario[];
    administradores!: Usuario[];
    idUsuarioAutenticado!: number;
    usuariosAnonimos: number = 0; // Inicializamos la variable
    miembrosVisibles: any[] = []; // Almacena los usuarios visibles en la interfaz
    publicaciones: Publicacion[] = [];
    visible: boolean = false;
    esAdministrador: boolean = false;
    currentIndexPublicaciones: number = 0;
    currentIndexPublicacionesPorAprobar: number = 0;
    cantidadPorPagina: number = 5;
    noMasPublicaciones: boolean = false;
    noMasPublicacionesPorAprobar: boolean = false;
    loandingPublicaciones: boolean = false;
    loandingPublicacionesPorAprobar: boolean = false;
    amigosNoEnComunidad: any[] = [];
    amigosEnComunidad: any[] = [];
    amigosYaInvitados: any[] = [];
    listaReferencia: any[] = [];
    cantidadMiembros: number = 0;
    esFavorito: boolean = false;
    cargaInicial: number = 5; // Número inicial de elementos visibles
    cargaIncremento: number = 5; // Número de elementos adicionales cargados en cada scroll
    searchTerm: string = '';  // Para almacenar el término de búsqueda
    page: number = 0;         // Página actual
    size: number = 5;        // Tamaño por página
    miembrosVisiblesPaginados: any[] = [];  // Miembros visibles en la interfaz
    loading: boolean = false;  // Para manejar el estado de carga
    loadingScroll: boolean = false;
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
    //expulsado: boolean = false; // Indica si el usuario fue expulsado
    motivoExpulsion: string = '';
    rolesCalculados: { [id: string]: string } = {};
    expulsado!: Expulsado;
    usuariosPublicadores: { [key: number]: Usuario } = {};
    searchTimeout: any // Variable para almacenar el timer
    haSolicitadoIngreso: boolean = false; // Estado inicial

    comentarios: { [key: number]: Comentario[] } = {}; // Para almacenar comentarios por publicación
    likesCount: { [key: number]: number } = {}; // Para almacenar cantidad de likes por publicación
    isLiked: { [key: number]: boolean } = {}; // Para almacenar estado del like por publicación
    newComments: { [key: number]: string } = {}; // Para manejar nuevos comentarios
    showCommentInput: { [key: number]: boolean } = {}; // Para mostrar/ocultar input de comentarios

    @ViewChild('modalInvitarAmigos') modalInvitarAmigos!: TemplateRef<any>;

    eventos: any[] = [];


    publicacionesPorAprobar: Publicacion[] = [];

    misPublicacionesPendientes: Publicacion[] = [];
    currentIndexMisPublicacionesPendientes: number = 0;
    noMasMisPublicacionesPendientes: boolean = false;
    loandingMisPublicacionesPendientes: boolean = false;

    misPublicacionesRechazadas: Publicacion[] = [];
    currentIndexMisPublicacionesRechazadas: number = 0;
    noMasMisPublicacionesRechazadas: boolean = false;
    loandingMisPublicacionesRechazadas: boolean = false;



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
        private eventoService: EventoService,
        protected idEncryptorService: IdEncryptorService


    ) { }

    ngOnInit(): void {
        const state = window.history.state;
        if (state && state.mensajeSnackBar) {
            this.snackBar.open(state.mensajeSnackBar, 'Cerrar', {
                duration: 3000,
            });
        }
        this.idUsuarioAutenticado = Number(this.authService.getUsuarioId());
        this.getComunidad().then(async () => {
            if ((!this.comunidad.esPrivada) || (this.esParte)) {
                this.getPublicaciones();
                this.traerMiembros();
                this.obtenerEventosDeLaComunidad();
                await this.traerAdministradores();

            }
            if (this.comunidad.esModerada && (this.esAdministrador || this.esCreador || this.esModerador)) {
                this.getPublicacionesPorAprobar();
            }
            if (this.comunidad.esModerada && !this.esCreador) {
                this.getPublicacionesPendientesUsuario();
                this.getPublicacionesRechazadasUsuario();
            }
            this.checkExpulsion();
            this.contarUsuariosAnonimos();

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
                this.expulsado = response.data as Expulsado;
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
        const idCifrado = this.idEncryptorService.encodeId(eventoId);

        this.router.navigate([`/eventos`, idCifrado]);
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

        // Obtener la lista de referencia con usuarios ordenados
        this.usuarioService.usuariosConMasInteracciones().subscribe((dataPackage) => {
            this.listaReferencia = dataPackage.data as Usuario[];

            // Cargar amigos que ya están en la comunidad
            this.usuarioService.todosLosAmigosDeUnUsuarioPertenecientesAUnaComunidad(idComunidad).subscribe((dataPackage) => {
                this.amigosEnComunidad = dataPackage.data as Usuario[];
                this.ordenarLista(this.amigosEnComunidad);
                this.amigosEnComunidadFiltrados = [...this.amigosEnComunidad];
                this.mostrarCategorias();
            });

            // Cargar amigos ya invitados a la comunidad
            this.usuarioService.todosLosAmigosDeUnUsuarioYaInvitadosAUnaComunidadPorElUsuario(idComunidad).subscribe((dataPackage) => {
                this.amigosYaInvitados = dataPackage.data as Usuario[];
                this.ordenarLista(this.amigosYaInvitados);
                this.amigosYaInvitadosFiltrados = [...this.amigosYaInvitados];
                this.mostrarCategorias();
            });

            // Cargar amigos que no están en la comunidad
            this.usuarioService.todosLosAmigosDeUnUsuarioNoPertenecientesAUnaComunidad(idComunidad).subscribe((dataPackage) => {
                this.amigosNoEnComunidad = dataPackage.data as Usuario[];
                this.filtrarYOrdenarAmigosNoEnComunidad();
                this.amigosNoEnComunidadFiltrados = [...this.amigosNoEnComunidad];
                this.mostrarCategorias();
            });
        });
    }

    // Método para ordenar una lista de usuarios en base a la lista de referencia
    ordenarLista(lista: Usuario[]): void {
        lista.sort((a, b) => {
            const indexA = this.listaReferencia.findIndex(usuario => usuario.id === a.id);
            const indexB = this.listaReferencia.findIndex(usuario => usuario.id === b.id);
            return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB);
        });
    }

    // Filtra y ordena amigos que no están en la comunidad
    filtrarYOrdenarAmigosNoEnComunidad(): void {
        this.amigosNoEnComunidad = this.amigosNoEnComunidad.filter(
            amigoNoEnComunidad =>
                !this.amigosEnComunidad.some(amigoEnComunidad => amigoEnComunidad.id === amigoNoEnComunidad.id) &&
                !this.amigosYaInvitados.some(amigoYaInvitado => amigoYaInvitado.id === amigoNoEnComunidad.id)
        );
        this.ordenarLista(this.amigosNoEnComunidad);
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
                        this.loadUsuariosPublicadores(resultados); // Cargar datos de los usuarios publicadores
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
    loadUsuariosPublicadores(publicaciones: Publicacion[]) {
        publicaciones.forEach(publicacion => {
            this.publicacionService.publicadoPor(publicacion.id).subscribe(
                (dataPackage) => {
                    if (dataPackage.status === 200) {
                        this.usuariosPublicadores[publicacion.id] = dataPackage.data as unknown as Usuario;
                    }
                }
            );
        });
    }


    // Función para traer los miembros con paginación y término de búsqueda
    async traerMiembros(): Promise<void> {
        if (this.loading) return;  // Evitar solicitudes repetidas mientras se cargan datos
        this.loading = true;

        // Llamada al servicio para obtener miembros filtrados por el término de búsqueda
        this.usuarioService.buscarMiembro(this.comunidad.id, this.searchTerm, this.page, this.size)
            .subscribe(async dataPackage => {
                if (Array.isArray(dataPackage.data)) {
                    console.info("datapackage ", dataPackage.data);
                    // Si es la primera página, reinicia la lista de miembros
                    if (this.page === 0) {
                        this.miembros = dataPackage.data;

                    } else {
                        // Si no es la primera página, agrega los nuevos miembros a la lista
                        this.miembros = [...this.miembros, ...dataPackage.data];
                    }

                    // Realiza la obtención de amigos y administradores para el filtrado de visibilidad
                    //await this.obtenerAmigos();
                    //await this.traerAdministradores();
                }
                this.loadingScroll = false;
                this.loading = false;
            });
    }

    contarUsuariosAnonimos(): void {
        if ((this.comunidad.esPrivada) && (!this.esParte)) {
            this.comunidadService.cantidadMiembrosEnComunidad(this.comunidad.id).subscribe(
                (dataPackage) => {
                    console.info("menor");
                    if (dataPackage && typeof dataPackage.data === 'number') {
                        this.comunidad.participantes = dataPackage.data; // Asignar el número de miembros
                        this.usuariosAnonimos = this.comunidad.participantes - 1;
                    }
                },
                (error) => {
                    console.error(`Error al traer los miembros de la comunidad ${this.comunidad.id}:`, error);
                }
            );

        } else {

            this.usuarioService.contarUsuariosAnonimos(this.comunidad.id).subscribe((dataPackage: DataPackage) => {
                this.usuariosAnonimos = Number(dataPackage.data); // Convierte explícitamente a number
            });
        }
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
            this.comunidad.miembros = <number><unknown>dataPackage.data;
            this.comunidad.participantes = this.cantidadMiembros;
            // this.usuariosAnonimos = this.cantidadMiembros - 1;

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
                    this.haSolicitadoIngreso = true;
                }
                if (estado == "Creador") {
                    this.esCreador = true;
                    this.esParte = true;
                }
                if (estado == "Administrador") {
                    this.esAdministrador = true;
                    this.esParte = true;
                }
                if (estado == "Moderador") {
                    this.pendiente = false;
                    this.esModerador = true;
                    this.esParte = true;
                }



                resolve();
            });
        });
    }


    getComunidad(): Promise<void> {
        return new Promise((resolve) => {
            //const id = this.route.snapshot.paramMap.get('id');
            const idCifrado = this.route.snapshot.paramMap.get('id');

            let id: number | string = 'new'; // Inicializamos con 'new' para que la comparación funcione
        
            if (idCifrado && idCifrado !== 'new') {
                id = this.idEncryptorService.decodeId(idCifrado).toString();
            }
        
            if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
                this.router.navigate(['comunidades/crearComunidad']);
                resolve();
            } else {
                this.comunidadService.get(parseInt(id)).subscribe(async dataPackage => {
                    this.comunidadService.puedeVer(Number(id)).subscribe(dataP => {
                        this.visible = <boolean><unknown>dataP.data
                    });
                    this.visible = true
                    this.comunidad = <Comunidad>dataPackage.data;
                    this.idComunidad = this.comunidad.id;
                    await this.procesarEstado(); // Asegúrate de que procesarEstado complete
                    await this.getCreadorOAdministradorComunidad();
                    this.getCantidadMiembros();
                    //this.usuariosAnonimos = this.miembros.length - 1;

                    resolve();
                });
            }
        });
    }

    seleccionarTab(tab: string): void {
        this.tabSeleccionada = tab;
    }

    seleccionarSubTabAdministrador(tab: string): void {
        this.subTabSeleccionada = tab;
    }


    irADetallePublicacion(idPublicacion: number): void {
        const idCifrado = this.idEncryptorService.encodeId(idPublicacion);
        this.router.navigate(['/publicacion', idCifrado]);
    }

    publicarEnComunidad(): void {

        this.router.navigate(['/publicacion'], {
            queryParams: {
                
                tipo: 'comunidad',
                idComunidad:  this.idEncryptorService.encodeId(this.idComunidad)
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



    ingresar(): void {
        this.isLoading = true; // Activar el estado de carga
        this.usuarioService.solicitarIngresoAComunidad(this.comunidad.id).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.procesarEstado();
            this.haSolicitadoIngreso = true;
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
        }, error => {
            console.error('Error al ingresar a la comunidad:', error);
            this.snackBar.open('Error al ingresar a la comunidad', 'Cerrar', {
                duration: 3000,
            });
        }).add(() => {
            this.isLoading = false; // Desactivar el estado de carga
        });
    }

    cancelarSolicitud() {
        this.isLoading = true;
        this.comunidadService.eliminarSolicitudIngreso(this.comunidad.id).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.procesarEstado().then(() => {
                this.haSolicitadoIngreso = false;
                this.pendiente = false; // Asegurar que pendiente es false
                this.isLoading = false; // Detener la carga
            });
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000,
            });
        }, error => {
            console.error('Error al cancelar la solicitud:', error);
            this.snackBar.open('Error al cancelar la solicitud', 'Cerrar', {
                duration: 3000,
            });
        }).add(() => {
            this.isLoading = false;
        });
    }


    salir(): void {
        this.isLoading = true; // Activar el estado de carga
        this.comunidadService.salir(this.comunidad.id).subscribe(dataPackage => {
            let mensaje = dataPackage.message;
            this.procesarEstado();
            this.snackBar.open(mensaje, 'Cerrar', {
                duration: 3000, // Duración del snackbar en milisegundos
            });
        }, error => {
            console.error('Error al salir de la comunidad:', error);
            this.snackBar.open('Error al salir de la comunidad', 'Cerrar', {
                duration: 3000,
            });
        }).add(() => {
            this.isLoading = false; // Desactivar el estado de carga
        });
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
        if (this.comunidad.cantidadMaximaMiembros > this.comunidad.miembros) {
            return (!this.esParte && !this.esCreador) || this.pendiente;
        }
        return false;
    }


    gestionarComunidad() {
        const idCifrado = this.idEncryptorService.encodeId(this.comunidad.id);
        this.router.navigate(['/creadorComunidad', idCifrado]);
    }


    crearEvento() {
        if (this.esParte) {
            const idCifrado = (this.idEncryptorService.encodeId(this.comunidad.id));
            console.log(this.comunidad.id);
            console.log(idCifrado);

            this.router.navigate(['/comunidades', idCifrado, 'eventos', 'crearEvento']);
        }
    }

    obtenerRol(miembro: Usuario): string {
        if (!this.rolesCalculados[miembro.id]) {
            if (miembro.id === this.creadorComunidad.id) {
                this.rolesCalculados[miembro.id] = 'Creador';
            } else if (this.administradores.some(admin => admin.id === miembro.id)) {
                this.rolesCalculados[miembro.id] = 'Administrador';
            } else {
                this.rolesCalculados[miembro.id] = 'Miembro';
            }
        }
        return this.rolesCalculados[miembro.id];
    }

    onScroll(tabName: string): void {
        const element = document.querySelector('.publicaciones-grid') as HTMLElement; //si se quiere hacer scroll en otros lados. llamar a todos con el mismo class en el div

        if (element) {
            // Detecta si se ha alcanzado el final del scroll
            const isAtBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 1;

            if (isAtBottom) {
                switch (tabName) {
                    case 'publicaciones':
                        this.getPublicaciones();
                        break;
                    case 'publicacionesPorAprobar':
                        this.getPublicacionesPorAprobar();
                        break;
                    case 'publicacionesPendientes':
                        this.getPublicacionesPendientesUsuario();
                        break;
                    case 'publicacionesRechazadas':
                        this.getPublicacionesRechazadasUsuario();
                        break;
                    default:
                        console.error('Vista no reconocida:', tabName);
                }
            }
        } else {
            console.error('.scrollable-list no encontrado.');
        }
    }

    /*   onScrollMiembros(): void {
          const element = document.querySelector('.perfil-miembros') as HTMLElement;
          if (element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
              this.cargarMasMiembros();
          }
      } */

    onScrollMiembros(): void {
        const element = document.querySelector('.perfil-miembros') as HTMLElement;
        if (!this.loadingScroll && element.scrollTop + element.clientHeight >= element.scrollHeight - 10) {
            this.loadingScroll = true;  // Marca como en proceso de carga
            this.page++;
            this.traerMiembros();  // Llama a la función de carga de miembros con la nueva página
        }
    }

    cargarMasMiembros(): void {
        const totalCargados = this.miembrosVisiblesPaginados.length;
        const nuevosMiembros = this.miembrosVisibles.slice(totalCargados, totalCargados + this.cargaIncremento);

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
    goToPerfil(usuarioId: number) {
        const idCifrado = this.idEncryptorService.encodeId(usuarioId);

        this.router.navigate(['/perfil', idCifrado]); // Ajusta la ruta según tu configuración de enrutamiento
    }


    buscarMiembros(): void {
        // Limpia el timer anterior, si existe
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Configura un nuevo timer para ejecutar después de 2 segundos
        this.searchTimeout = setTimeout(() => {
            this.miembrosVisiblesPaginados = [];
            this.page = 0; // Reinicia la página cuando cambia el término de búsqueda
            this.traerMiembros(); // Trae los miembros con el nuevo término
        }, 1000); // Retraso de 2 segundos
    }



    getPublicacionesPorAprobar(): void {
        if (this.loandingPublicacionesPorAprobar || this.noMasPublicacionesPorAprobar) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
        this.loandingPublicacionesPorAprobar = true;
        // Suponiendo que tienes un método que obtiene más comunidades con paginación
        this.publicacionService
            .publicacionesComunidadPorAprobar(this.idComunidad, this.currentIndexPublicacionesPorAprobar, this.cantidadPorPagina)
            .subscribe(
                async (dataPackage) => {
                    const resultados = dataPackage.data as Publicacion[]
                    if (resultados && resultados.length > 0) {
                        this.loadUsuariosPublicadores(resultados); // Cargar datos de los usuarios publicadores
                        this.publicacionesPorAprobar = [...this.publicacionesPorAprobar, ...resultados,];
                        this.currentIndexPublicacionesPorAprobar++; // Aumentar el índice para la siguiente carga

                    } else {
                        this.noMasPublicacionesPorAprobar = true; // No hay más comunidades por cargar
                    }
                    this.loandingPublicacionesPorAprobar = false; // Desactivar el indicador de carga
                },
                (error) => {
                    console.error('Error al cargar las publicaciones:', error);
                    this.loandingPublicacionesPorAprobar = false;
                }
            );
    }


    aprobarPublicacion(publicacion: Publicacion) {
        this.publicacionService.actualizarEstadoPublicacion(publicacion, this.comunidad.id, 'Aprobada').subscribe(dataPackage => {
            let publicacionActualizada: Publicacion = dataPackage.data as Publicacion
            publicacion = publicacionActualizada;
            this.publicacionesPorAprobar = this.publicacionesPorAprobar.filter(p => p.id !== publicacion.id);
            this.publicaciones = [publicacion, ...this.publicaciones];
        });
    }
    rechazarPublicacion(publicacion: Publicacion) {
        this.publicacionService.actualizarEstadoPublicacion(publicacion, this.comunidad.id, 'Rechazada').subscribe(dataPackage => {
            let publicacionActualizada: Publicacion = dataPackage.data as Publicacion
            publicacion = publicacionActualizada;
            this.publicacionesPorAprobar = this.publicacionesPorAprobar.filter(p => p.id !== publicacion.id);
        });

    }



    getPublicacionesPendientesUsuario(): void {
        if (this.loandingMisPublicacionesPendientes || this.noMasMisPublicacionesPendientes) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
        this.loandingMisPublicacionesPendientes = true;
        // Suponiendo que tienes un método que obtiene más comunidades con paginación
        this.publicacionService
            .publicacionesPendientesUsuarioComunidad(this.idComunidad, this.currentIndexMisPublicacionesPendientes, this.cantidadPorPagina)
            .subscribe(
                async (dataPackage) => {
                    const resultados = dataPackage.data as Publicacion[]
                    if (resultados && resultados.length > 0) {
                        this.loadUsuariosPublicadores(resultados); // Cargar datos de los usuarios publicadores
                        this.misPublicacionesPendientes = [...this.misPublicacionesPendientes, ...resultados,];
                        this.currentIndexMisPublicacionesPendientes++; // Aumentar el índice para la siguiente carga

                    } else {
                        this.noMasMisPublicacionesPendientes = true; // No hay más comunidades por cargar
                    }
                    this.loandingMisPublicacionesPendientes = false; // Desactivar el indicador de carga
                },
                (error) => {
                    console.error('Error al cargar las publicaciones:', error);
                    this.loandingMisPublicacionesPendientes = false;
                }
            );
    }
    getPublicacionesRechazadasUsuario(): void {
        if (this.loandingMisPublicacionesRechazadas || this.noMasMisPublicacionesRechazadas) return; // Evitar solicitudes mientras se cargan más comunidades o si ya no hay más
        this.loandingMisPublicacionesRechazadas = true;
        // Suponiendo que tienes un método que obtiene más comunidades con paginación
        this.publicacionService
            .publicacionesRechazadasUsuarioComunidad(this.idComunidad, this.currentIndexMisPublicacionesRechazadas, this.cantidadPorPagina)
            .subscribe(
                async (dataPackage) => {
                    const resultados = dataPackage.data as Publicacion[]
                    if (resultados && resultados.length > 0) {
                        this.loadUsuariosPublicadores(resultados); // Cargar datos de los usuarios publicadores
                        this.misPublicacionesRechazadas = [...this.misPublicacionesRechazadas, ...resultados,];
                        this.currentIndexMisPublicacionesRechazadas++; // Aumentar el índice para la siguiente carga

                    } else {
                        this.noMasMisPublicacionesRechazadas = true; // No hay más comunidades por cargar
                    }
                    this.loandingMisPublicacionesRechazadas = false; // Desactivar el indicador de carga
                },
                (error) => {
                    console.error('Error al cargar las publicaciones:', error);
                    this.loandingMisPublicacionesRechazadas = false;
                }
            );
    }
}
