import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ImageLoaderService } from './image-loader.service';
import { AuthService } from '../autenticacion/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { Location, NgIf } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../autenticacion/auth.interceptor';
import { UbicacionService } from '../ubicacion.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    ReactiveFormsModule,
    NgIf,
    HttpClientModule
  ],
  standalone: true
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  logoUrl: string = '';
  passwordVisible = false;

  constructor(
    private formBuilder: FormBuilder,
    private imageLoader: ImageLoaderService,
    private ubicacionService: UbicacionService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
    ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    const state = window.history.state;
    if (state && state.mensajeSnackBar) {
      this.snackBar.open(state.mensajeSnackBar, 'Cerrar', {
        duration: 3000
      });
    }
    // this.loadLogo();
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
    const passwordInput = document.getElementById('passwordInput');
    if (passwordInput) { // Verificar que passwordInput no sea null
      if (this.passwordVisible) {
        passwordInput.setAttribute('type', 'text');
      } else {
        passwordInput.setAttribute('type', 'password');
      }
    }
  }

  loadLogo() {
    const logoUrl = 'https://imgur.com/OUCRENo';
    this.imageLoader.loadImage(logoUrl).subscribe((blob: Blob) => {
      this.logoUrl = URL.createObjectURL(blob);
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.login(email, password);
    } else {
      console.warn('Formulario inválido');
    }
  }

  login(email: string, password: string): void {
    this.authService.login(email, password).subscribe(
      (dataPackage) => {
        if (dataPackage.status == 200){
          this.authService.saveToken(<any>dataPackage.data);
          this.ubicacionService.setearUbicacionDeUsuario(); 
          localStorage.setItem('shouldReloadHome', 'true');
          window.location.href = '/';
        } else {
          this.snackBar.open(dataPackage.message, 'Cerrar', {
            duration: 3000,
          });
        }
      }
    );
  }

  forgotPassword(): void {
    this.router.navigate(['/verificar-mail']);
  }
  
  goToRegister(): void {
    this.router.navigate(['/registro']); 
  }

  convertToLower(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.toLowerCase();
    this.loginForm.get('nombreUsuario')?.setValue(input.value);
  }

}
