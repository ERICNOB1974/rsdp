import { Component, OnInit, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { PublicacionService } from '../publicaciones/publicacion.service';
import { Publicacion } from '../publicaciones/publicacion';
import { AuthService } from '../autenticacion/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../usuarios/usuario';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  publicaciones: Publicacion[] = [];
  usuariosPublicadores: { [key: number]: Usuario } = {};
  page = 0;
  pageSize = 5;
  loading = false;

  constructor(
    private publicacionService: PublicacionService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.loadPublicaciones();
  }

  @HostListener('window:scroll', ['$event'])
  onScroll() {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100 && !this.loading) {
      this.loadPublicaciones();
    }
  }

  loadPublicaciones() {
    if (this.loading) return;
    this.loading = true;
    const userId = this.authService.getUsuarioId();
    if (userId) {
      this.publicacionService.publicacionesAmigos2(+userId).subscribe(
        (dataPackage) => {
          if (dataPackage.status === 200) {
            const newPublicaciones = dataPackage.data as Publicacion[];

            // Verificamos que no haya publicaciones duplicadas
            newPublicaciones.forEach(pub => {
              if (!this.publicaciones.some(p => p.id === pub.id)) {
                this.publicaciones.push(pub);
              }
            });

            this.loadUsuariosPublicadores(newPublicaciones);
            this.page++;
          }
          this.loading = false;
        },
        (error) => {
          console.error('Error loading publicaciones:', error);
          this.loading = false;
        }
      );
    }
  }


  loadUsuariosPublicadores(publicaciones: Publicacion[]) {
    publicaciones.forEach(publicacion => {
      this.publicacionService.publicadoPor(publicacion.id).subscribe(
        (dataPackage) => {
          if (dataPackage.status === 200) {
            this.usuariosPublicadores[publicacion.id] = dataPackage.data as unknown as Usuario;
          }
        }
      );
    });
  }

  toggleLike(publicacion: Publicacion) {
    this.publicacionService.estaLikeada(publicacion.id).subscribe(
      (dataPackage) => {
        if (dataPackage.status === 200) {
          const isLiked = dataPackage.data as unknown as boolean;
          if (isLiked) {
            this.publicacionService.sacarLike(publicacion.id).subscribe();
          } else {
            this.publicacionService.darLike(publicacion.id).subscribe();
          }
        }
      }
    );
  }

  goToPublicacionDetail(id: number) {
    this.router.navigate(['/publicacion', id]);
  }

  


}