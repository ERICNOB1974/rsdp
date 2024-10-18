import { AuthService } from '../autenticacion/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../autenticacion/auth.interceptor';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { dateValidator } from './date-validator';
import { Observable, catchError, map, of } from 'rxjs';
import { UsuarioService } from '../usuarios/usuario.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  imports: [MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    NgIf,
    HttpClientModule],
  standalone: true
})
export class RegistroComponent implements OnInit {
  registroForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private usuarioService: UsuarioService
  ) {
    this.registroForm = this.formBuilder.group(
      {
        nombreReal: ['', [Validators.required]],
        nombreUsuario: [
          '',
          [Validators.required, Validators.minLength(3)],
          [this.nombreUsuarioValidator.bind(this)], 
        ],
        correoElectronico: [
          '',
          [Validators.required, Validators.email],
          [this.correoElectronicoValidator.bind(this)], 
        ],
        contrasena: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/), 
          ],
        ],
        confirmarContrasena: ['', [Validators.required]],
        fechaNacimiento: ['', [Validators.required, dateValidator()]],
        descripcion: [''],
      },
      { validators: this.matchPasswords('contrasena', 'confirmarContrasena') }
    );
  }
  
  nombreUsuarioValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usuarioService.existeNombreUsuario(control.value).pipe(
      map((response) => (response.data ? { nombreUsuarioExistente: true } : null)),
      catchError(() => of(null))
    );
  }

  correoElectronicoValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usuarioService.existeMail(control.value).pipe(
      map((response) => (response.data ? { correoExistente: true } : null)),
      catchError(() => of(null))
    );
  }

  matchPasswords(contrasena: string, confirmarContrasena: string) {
    return (formGroup: FormGroup) => {
      const passwordControl = formGroup.get(contrasena);
      const confirmPasswordControl = formGroup.get(confirmarContrasena);
  
      if (confirmPasswordControl?.errors && !confirmPasswordControl.errors['mismatch']) {
        return;
      }
  
      if (passwordControl?.value !== confirmPasswordControl?.value) {
        confirmPasswordControl?.setErrors({ mismatch: true });
      } else {
        confirmPasswordControl?.setErrors(null); 
      }
    };
  }
  
  goBack() {
    this.router.navigate(['/login']); 
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registroForm.valid) {
      const formData = this.registroForm.value;
  
      localStorage.setItem('registroData', JSON.stringify(formData));
  
      this.authService.enviarCodigo(formData.correoElectronico).subscribe(
        () => {
          alert('Código de verificación enviado. Revisa tu correo.');
          
          this.router.navigate(['/verificar-codigo'], {
            queryParams: { tipo: 'registro' },
          });
        },
        (error) => {
          console.error('Error al enviar el código de verificación:', error);
          alert('Error al enviar el código de verificación.');
        }
      );
    } else {
      console.warn('Formulario de registro inválido');
    }
  }
  
  
}
