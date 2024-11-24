import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minimoUnaEtiqueta(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const etiquetas = control.value;
    if (Array.isArray(etiquetas) && etiquetas.length > 0) {
      return null; // Válido
    }
    return { sinEtiqueta: true }; // Inválido si no hay etiquetas
  };
}
