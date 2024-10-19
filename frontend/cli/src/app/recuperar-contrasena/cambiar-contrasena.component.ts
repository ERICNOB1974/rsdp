import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../autenticacion/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { NgIf } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../autenticacion/auth.interceptor';
import { Observable, catchError, map, of } from 'rxjs';
import { UsuarioService } from '../usuarios/usuario.service';


@Component({
    selector: 'app-cambiar-contrasena',
    templateUrl: './cambiar-contrasena.component.html',
    styleUrls: ['./cambiar-contrasena.component.css'],
    imports: [ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        ReactiveFormsModule,
        NgIf,
        HttpClientModule],
    standalone: true,
})
export class CambiarContrasenaComponent {
    contrasenaForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService
    ) {
        this.contrasenaForm = this.formBuilder.group(
            {
                nuevaContrasena: [
                    '',
                    [
                        Validators.required,
                        Validators.minLength(8),
                        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/),
                    ],
                ],
                confirmarContrasena: ['', Validators.required],
            },
            { validators: this.matchPasswords('nuevaContrasena', 'confirmarContrasena') }
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

    onSubmit(): void {
        if (this.contrasenaForm.valid) {
            const { nuevaContrasena } = this.contrasenaForm.value;

            // Recuperar el correo desde localStorage
            const correo = localStorage.getItem('correoElectronico');

            if (correo) {
                this.authService.cambiarContrasena(correo, nuevaContrasena).subscribe(
                    (dataPackage) => {
                        if (dataPackage.status == 200) {
                            alert('Contraseña cambiada exitosamente.');
                            localStorage.removeItem('correoElectronico'); // Eliminar el correo del localStorage
                            this.router.navigate(['/login']);
                        } else {
                            alert(dataPackage.message);
                        }
                    }
                );
            } else {
                alert('No se encontró el correo electrónico. Vuelve a intentarlo.');
            }
        }
    }

    goBack(): void {
        this.router.navigate(['/login']); // Reemplaza '/ruta-de-atras' con la ruta adecuada.
    }

    ngOnInit(): void {
        this.contrasenaForm.get('contrasenaActual')?.setValue('');
    }


}
