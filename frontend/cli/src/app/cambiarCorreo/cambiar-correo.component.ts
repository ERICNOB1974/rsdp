import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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

@Component({
    selector: 'app-cambiar-correo',
    templateUrl: './cambiar-correo.component.html',
    styleUrls: ['./cambiar-correo.component.css'],
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
export class CambiarCorreoComponent {
    correoForm: FormGroup;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private authService: AuthService,
        private location: Location
    ) {
        this.correoForm = this.formBuilder.group({
            contrasenaActual: ['', [
                Validators.required,
                Validators.minLength(8),
                Validators.pattern(/^(?=.*[A-Z])(?=.*\d).*$/)
            ]]
        });
    }

    goBack(): void {
        this.location.back();
    }

    onSubmit(): void {
        if (this.correoForm.valid) {
            const { contrasenaActual } = this.correoForm.value;
            
            this.authService.verificarContrasena(contrasenaActual).subscribe(
                (response) => {
                    if (response.status === 200) {
                        this.router.navigate(['/nuevo-correo']);
                    } else {
                        alert('Contraseña incorrecta');
                    }
                },
                (error) => {
                    alert('Error al verificar la contraseña');
                }
            );
        }
    }
}