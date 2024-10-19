import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.css'],
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class VerificarCodigoComponent {
  codigoForm!: FormGroup;
  email!: string;
  tipo!: 'registro' | 'recuperacion'; // Tipo de flujo (registro o recuperación)

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    // Obtener el tipo desde los parámetros de la URL
    const tipoParam = this.route.snapshot.queryParamMap.get('tipo') as 'registro' | 'recuperacion';

    if (tipoParam !== 'registro' && tipoParam !== 'recuperacion') {
      // Si el tipo es inválido, redirigir al login
      this.router.navigate(['/login']);
      return;
    }

    this.tipo = tipoParam;

    // Determinar el email según el tipo
    if (this.tipo === 'registro') {
      const registroData = JSON.parse(localStorage.getItem('registroData') || '{}');
      this.email = registroData.correoElectronico || '';
    } else {
      this.email = localStorage.getItem('correoElectronico') || '';
    }

    // Si no hay email en el flujo esperado, redirigir al login
    if (!this.email) {
      this.router.navigate(['/login']);
      return;
    }

    // Crear el formulario para ingresar el código
    this.codigoForm = this.formBuilder.group({
      codigo1: ['', [Validators.required, Validators.maxLength(1)]],
      codigo2: ['', [Validators.required, Validators.maxLength(1)]],
      codigo3: ['', [Validators.required, Validators.maxLength(1)]],
      codigo4: ['', [Validators.required, Validators.maxLength(1)]],
      codigo5: ['', [Validators.required, Validators.maxLength(1)]],
      codigo6: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  onSubmit() {
    const codigo =
      this.codigoForm.value.codigo1 +
      this.codigoForm.value.codigo2 +
      this.codigoForm.value.codigo3 +
      this.codigoForm.value.codigo4 +
      this.codigoForm.value.codigo5 +
      this.codigoForm.value.codigo6;

    this.authService.verificarCodigo(this.email, codigo).subscribe((dataPackage) => {
      if (dataPackage.status === 200) {
        alert('Código verificado exitosamente.');

        if (this.tipo === 'registro') {
          this.crearUsuario();
        } else {
          this.router.navigate(['/cambiar-contrasena']);
        }
      } else {
        alert(dataPackage.message);
      }
    });
  }

  crearUsuario() {
    const registroData = JSON.parse(localStorage.getItem('registroData') || '{}');
    this.authService
      .registro(
        registroData.nombreReal,
        registroData.nombreUsuario,
        this.email,
        registroData.contrasena,
        registroData.fechaNacimiento,
        registroData.descripcion
      )
      .subscribe(
        () => {
          alert('Usuario creado exitosamente.');
          this.router.navigate(['/login']);
        },
        (error) => {
          const errorMessage = error.error.message || 'Error al crear el usuario.';
          alert(errorMessage);
        }
      );
  }
}
