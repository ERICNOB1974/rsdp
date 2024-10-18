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
import { NgIf } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from '../autenticacion/auth.interceptor';

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

  constructor(
    private formBuilder: FormBuilder,
    // private imageLoader: ImageLoaderService,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  ngOnInit(): void {
    // this.loadLogo();
  }

  // loadLogo() {
  //   const logoUrl = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTmQCLsVPsXkhhqWwZA4MvbrTsuoRzUmUU2UA&s';
  //   this.imageLoader.loadImage(logoUrl).subscribe((blob: Blob) => {
  //     this.logoUrl = URL.createObjectURL(blob);
  //   });
  // }

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
          console.log('Token obtenido:', dataPackage.data);
          this.authService.saveToken(<any>dataPackage.data);
          this.router.navigate(['/']); 
        } else {
          alert(dataPackage.message);
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
  
}
