export interface Usuario {
    id: number;
    nombreUsuario: string;
    nombreReal: string;
    fechaNacimiento: Date;
    fechaDeCreacion: Date;
    correoElectronico: string;
    contrasena: string;
    descripcion: string;
    latitud: number;
    longitud: number;
    privacidadPerfil?: 'Privada' | 'Solo amigos' | 'Pública';
    privacidadEventos?: 'Privada' | 'Solo amigos' | 'Pública';
    privacidadComunidades?: 'Privada' | 'Solo amigos' | 'Pública';
}
