import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { Etiqueta } from '../etiqueta/etiqueta';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateValue = control.value;
    const selectedDate = new Date(dateValue).getTime(); // Fecha seleccionada en milisegundos
    const minDate = Date.now(); // Fecha y hora actuales en milisegundos
    if (selectedDate < minDate) {
      return { invalidDate: true }; // Fecha inválida
    }

    return null; // Fecha válida


  };
}

export function minimoUnaEtiqueta(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const etiquetas = control.value; 
    
    // Verificar que sea un array y tenga entre 1 y 15 etiquetas
    if (Array.isArray(etiquetas) && etiquetas.length > 0 && etiquetas.length <= 15) {
      return null; // Válido si hay entre 1 y 15 etiquetas
    }
    
    // Retorna un error si no hay etiquetas o hay más de 15
    return { 
      sinEtiqueta: etiquetas.length === 0,
      demasiasEtiquetas: etiquetas.length > 15
    }; 
  };
}


export function minimoUnaEtiqueta2(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const etiquetas = control.value; // Obtiene el valor del control
    if (Array.isArray(etiquetas) && etiquetas.length > 0) {
      return null; // Válido si hay al menos una etiqueta
    }
    return { sinEtiqueta: true }; // Inválido si no hay etiquetas
  };
}

export function cantidadParticipantesValidator(control: AbstractControl): Observable<ValidationErrors | null> {
  const cantidadIngresada = control.value;

  // Verificar si la cantidad es válida
  if (cantidadIngresada > 0) {
    // La cantidad es válida
    return of(null);
  } else {
    // La cantidad es inválida
    return of({ cantidadInvalida: true });
  }
}
