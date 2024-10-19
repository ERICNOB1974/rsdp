import { Component, ElementRef, OnInit, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonModule } from '@angular/common'; // Para permitir navegar de vuelta
import { MatSnackBar } from '@angular/material/snack-bar';
import { PublicacionService } from './publicacion.service';
import { Publicacion } from './publicacion';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';



@Component({
  selector: 'app-publicaciones',
  templateUrl: './publicacion-detail.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./publicacion.css'],
  standalone: true
})
export class PublicacionDetailComponent implements OnInit {

  publicacion!: Publicacion;
  isActive: boolean = false;

  constructor(
    private route: ActivatedRoute, // Para obtener el parámetro de la URL
    private publicacionService: PublicacionService, // Servicio para obtener el evento por ID
    private location: Location, // Para manejar la navegación
    private router: Router,
    private snackBar: MatSnackBar,
    private el: ElementRef,
    private renderer: Renderer2 // Renderer2 para modificar el DOM
  ) { }
  showInput = false;  // Para mostrar el campo de texto
  newComment = '';    // Almacena el comentario ingresado
  comment = '';       // Comentario final mostrado

  toggleComment() {
    this.showInput = true;  // Muestra el campo de texto cuando se hace clic en el icono
  }

  submitComment() {
    if (this.newComment.trim()) {
      this.comment = this.newComment;
      this.newComment = '';
      this.showInput = false;  // Oculta el campo de texto después de agregar el comentario
    }
  }

  toggleHeart() {
    this.isActive = !this.isActive;
    const heartElement = document.querySelector('.heart');
    if (this.isActive) {
      heartElement?.classList.add('active');
    } else {
      heartElement?.classList.remove('active');
    }
  }
  ngOnInit(): void {
    this.getPublicacion();
    //this.traerParticipantes();
  }


  getPublicacion(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (!id || isNaN(parseInt(id, 10)) || id === 'new') {
      this.router.navigate(['publicacion/crear']);
    }
    else {
      this.publicacionService.get(parseInt(id)).subscribe(async dataPackage => {
        this.publicacion = <Publicacion>dataPackage.data;
      });
    }
  }

  goBack(): void {
    this.location.back();
  }


}
