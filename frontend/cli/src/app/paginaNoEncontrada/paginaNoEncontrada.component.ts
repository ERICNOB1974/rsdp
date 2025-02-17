import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error404',
  templateUrl: './paginaNoEncontrada.component.html',
  styleUrl: './paginaNoEncontrada.component.css'
})
export class PaginaNoEncontrada {
  constructor(private router: Router) {}

  volverAlInicio(): void {
    this.router.navigate(['']); 
  }
}
