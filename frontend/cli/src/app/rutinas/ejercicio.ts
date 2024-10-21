export interface Ejercicio {
    nombre: any;
    repeticiones: number | null;
    series: number | null;
    tiempo: string;
    descripcion: string;
    imagen: string;
    tipo: TipoEjercicio;
    seriesValido?: boolean;
    repeticionesValido?: boolean;
    tiempoValido?: boolean;
  }