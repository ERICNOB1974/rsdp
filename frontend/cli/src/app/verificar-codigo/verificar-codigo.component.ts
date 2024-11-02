import { Component, ElementRef, ViewChildren, QueryList } from '@angular/core';
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

  @ViewChildren('codigoInput') codigoInputs!: QueryList<ElementRef>;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {
    const tipoParam = this.route.snapshot.queryParamMap.get('tipo') as 'registro' | 'recuperacion';

    if (tipoParam !== 'registro' && tipoParam !== 'recuperacion') {
      this.router.navigate(['/login']);
      return;
    }

    this.tipo = tipoParam;

    if (this.tipo === 'registro') {
      const registroData = JSON.parse(localStorage.getItem('registroData') || '{}');
      this.email = registroData.correoElectronico || '';
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
