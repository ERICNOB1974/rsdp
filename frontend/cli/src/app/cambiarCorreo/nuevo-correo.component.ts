import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../autenticacion/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService } from '../usuarios/usuario.service';
import { Observable, map, catchError, of } from 'rxjs';

@Component({
    selector: 'app-nuevo-correo',
    templateUrl: './nuevo-correo.component.html',
    styleUrls: ['./nuevo-correo.component.css'],
    imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        NgIf,
        HttpClientModule
    ],
    standalone: true,
})
export class NuevoCorreoComponent {
    nuevoCorreoForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private usuarioService: UsuarioService,
        private location: Location
    ) {
        this.nuevoCorreoForm = this.formBuilder.group({
            nuevoCorreo: ['', [
                Validators.required, 
                Validators.email
            ], [this.correoElectronicoValidator.bind(this)]]
        });
    }

    correoElectronicoValidator(control: AbstractControl): Observable<ValidationErrors | null> {
        return this.usuarioService.existeMail(control.value).pipe(
            map((response) => (response.data ? { correoExistente: true } : null)),
            catchError(() => of(null))
        );
    }

    goBack(): void {
        this.location.back();
    }

    onSubmit(): void {
        if (this.nuevoCorreoForm.valid) {
            const { nuevoCorreo } = this.nuevoCorreoForm.value;
            
            // Guardar el nuevo correo en localStorage para usarlo después de la verificación
            localStorage.setItem('nuevoCorreo', nuevoCorreo);
            
            // Enviar código de verificación al nuevo correo
            this.authService.enviarCodigo(nuevoCorreo).subscribe(
                (response) => {
                    if (response.status === 200) {
                        this.router.navigate(['/verificar-codigo'], {
                            queryParams: { tipo: 'cambio-correo' }
                        });
                    } else {
                        alert('Error al enviar el código de verificación');
                    }
                },
                (error) => {
                    alert('Error en el servidor');
                }
            );
        }
    }
}