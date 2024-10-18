import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../autenticacion/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { UsuarioService } from '../usuarios/usuario.service';

@Component({
  selector: 'app-verificar-mail',
  templateUrl: './verificar-mail.component.html',
  styleUrls: ['./verificar-mail.component.css'],
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    NgIf,
    HttpClientModule
  ]
})
export class VerificarMailComponent implements OnInit {
  recoverForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    public router: Router,
    private usuarioService: UsuarioService
  ) {
    this.recoverForm = this.formBuilder.group({
        correoElectronico: [
            '',
            [Validators.required, Validators.email],
            [this.correoElectronicoValidator.bind(this)], 
          ]
    });
  }

  correoElectronicoValidator(control: AbstractControl): Observable<ValidationErrors | null> {
    return this.usuarioService.existeMail(control.value).pipe(
      map((response) => (response.data ? null : { correoNoExistente: true })), // Invertimos la lógica
      catchError(() => of({ correoNoExistente: true })) // Maneja errores del servicio
    );
  }  

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.recoverForm.valid) {
      const correo = this.recoverForm.value.correoElectronico;
      
      // Guardar el correo en localStorage
      localStorage.setItem('correoElectronico', correo);
      
      this.authService.enviarCodigo(correo).subscribe(
        () => {
          alert('Código de verificación enviado. Revisa tu correo.');
          this.router.navigate(['/verificar-codigo'], {
            queryParams: { tipo: 'recuperacion' },
          });
        },
        (error) => {
          console.error('Error al enviar el código de verificación:', error);
          alert('Error al enviar el código de verificación.');
        }
      );
    } else {
      console.warn('Formulario inválido');
    }
  }
  
}
