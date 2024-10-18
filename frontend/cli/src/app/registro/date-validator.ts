import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateValue = control.value;
    if (dateValue) {
      const selectedDate = new Date(dateValue);
      const minDate = new Date('1920-01-01');
      const maxDate = new Date('2020-12-31');
      if (selectedDate < minDate || selectedDate > maxDate) {
        return { invalidDate: true };
      }
    }
    return null; 
  };
}
