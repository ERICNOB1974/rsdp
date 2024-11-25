import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../autenticacion/auth.service';
import { DataPackage } from '../data-package';
import { UsuarioService } from '../usuarios/usuario.service';
import { NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verificar-codigo',
  templateUrl: './verificar-codigo.component.html',
  styleUrls: ['./verificar-codigo.component.css'],
  imports: [ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule],
  standalone: true,
})
export class VerificarCodigoComponent {
  codigoForm!: FormGroup;
  email!: string;
  tipo!: 'registro' | 'recuperacion' | 'cambio-correo'; // Tipo de flujo (registro o recuperación)

  @ViewChildren('codigoInput') codigoInputs!: QueryList<ElementRef>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private snackBar: MatSnackBar
  ) {
    const tipoParam = this.route.snapshot.queryParamMap.get('tipo') as 'registro' | 'recuperacion' | 'cambio-correo';

    if (tipoParam !== 'registro' && tipoParam !== 'recuperacion' && tipoParam !== 'cambio-correo') {
      this.router.navigate(['/login']);
      return;
    }
    
    this.tipo = tipoParam;
    
    if (this.tipo === 'registro') {
      const registroData = JSON.parse(localStorage.getItem('registroData') || '{}');
      this.email = registroData.correoElectronico || '';
    } else if (this.tipo === 'cambio-correo') {
      this.email = localStorage.getItem('nuevoCorreo') || '';
    } else {
      this.email = localStorage.getItem('correoElectronico') || '';
    }

    if (!this.email) {
      this.router.navigate(['/login']);
      return;
    }

    this.codigoForm = this.formBuilder.group({
      codigo1: ['', [Validators.required, Validators.maxLength(1)]],
      codigo2: ['', [Validators.required, Validators.maxLength(1)]],
      codigo3: ['', [Validators.required, Validators.maxLength(1)]],
      codigo4: ['', [Validators.required, Validators.maxLength(1)]],
      codigo5: ['', [Validators.required, Validators.maxLength(1)]],
      codigo6: ['', [Validators.required, Validators.maxLength(1)]],
    });
  }

  ngOnInit(): void {
    const state = window.history.state;
    if (state && state.mensajeSnackBar) {
      this.snackBar.open(state.mensajeSnackBar, 'Cerrar', {
        duration: 3000
      });
    }
  }

  ngAfterViewInit() {
    this.codigoInputs.forEach((input, index) => {
      input.nativeElement.addEventListener('input', (event: any) => this.onInput(event, index));
      input.nativeElement.addEventListener('paste', (event: ClipboardEvent) => this.onPaste(event));
      input.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => this.onKeyDown(event, index));
    });
  }

  onInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (value.length > 1) {
      input.value = value[0]; // Solo permite un carácter por campo
    }

    // Mover al siguiente campo si hay un carácter ingresado
    if (value && index < this.codigoInputs.length - 1) {
      this.codigoInputs.toArray()[index + 1].nativeElement.focus();
    }
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = this.codigoInputs.toArray()[index].nativeElement;

    // Mover al campo anterior si se presiona 'Backspace' y el campo está vacío
    if (event.key === 'Backspace' && !input.value && index > 0) {
      this.codigoInputs.toArray()[index - 1].nativeElement.focus();
    }
  }

  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pasteData = event.clipboardData?.getData('text')?.trim() || '';
    if (pasteData.length === 6) {
      pasteData.split('').forEach((char, index) => {
        this.codigoForm.controls[`codigo${index + 1}`].setValue(char);
      });

      // Después de pegar, poner el foco en el último campo
      this.codigoInputs.toArray()[5].nativeElement.focus();
    }
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
        if (this.tipo === 'registro') {
          this.crearUsuario();
        } else if (this.tipo === 'recuperacion') {
          this.router.navigate(['/cambiar-contrasena'], {
            state: { mensajeSnackBar: 'Código verificado exitosamente.' }
          });
        } else if (this.tipo === 'cambio-correo') {
          const nuevoCorreo = localStorage.getItem('nuevoCorreo');
          if (nuevoCorreo) {
            this.usuarioService.actualizarCorreo(nuevoCorreo).subscribe(
              (response: DataPackage) => {
                if (response.status === 200) {
                  this.router.navigate(['/login'], {
                    state: { mensajeSnackBar: 'Correo electrónico actualizado correctamente. Por favor, inicia sesión nuevamente.' }
                  });                  
                  localStorage.removeItem('nuevoCorreo'); // Limpiamos el localStorage
                  this.authService.logout(); // Cerramos la sesión actual
                } else {
                  this.snackBar.open('Error al actualizar el correo electrónico: ' + response.message, 'Cerrar', {
                    duration: 3000,
                  });
                }
              },
              () => {
                this.snackBar.open('Error en el servidor al actualizar el correo electrónico', 'Cerrar', {
                  duration: 3000,
                });
              }
            );
          } else {
            this.snackBar.open('No se encontró el nuevo correo electrónico', 'Cerrar', {
              duration: 3000,
            });
          }
        }
      } else {
        this.snackBar.open(dataPackage.message, 'Cerrar', {
          duration: 3000,
        });
      }
    });
  }

  crearUsuario() {
    const registroData = JSON.parse(localStorage.getItem('registroData') || '{}');
    
    // Atributos de privacidad predeterminados, solo si están en null o undefined
    registroData.privacidadPerfil = registroData.privacidadPerfil ?? 'Privada';
    registroData.privacidadEventos = registroData.privacidadEventos ?? 'Privada';
    registroData.privacidadComunidades = registroData.privacidadComunidades ?? 'Privada';
    
    this.authService
      .registro(
        registroData.nombreReal,
        registroData.nombreUsuario,
        this.email,
        registroData.contrasena,
        registroData.fechaNacimiento,
        registroData.descripcion,
        registroData.privacidadPerfil,
        registroData.privacidadEventos,
        registroData.privacidadComunidades
      )
      .subscribe(
        () => {
          this.router.navigate(['/login'], {
            state: { mensajeSnackBar: 'Usuario creado exitosamente.' }
          });
        },
        (error) => {
          const errorMessage = error.error.message || 'Error al crear el usuario.';
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 3000,
          });
        }
      );
  }
  
}
