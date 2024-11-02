import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Comunidad } from './comunidad'; // Asegúrate de tener un modelo Comunidad
import { ComunidadService } from './comunidad.service'; // Crea este servicio
import { AuthService } from '../autenticacion/auth.service';

@Component({
  selector: 'app-comunidades-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: 'comunidadesCreadasUsuario.component.html',
  styleUrls: ['comunidadesCreadasUsuario.component.css']
})
export class ComunidadesCreadasUsuarioComponent implements OnInit, OnDestroy {
  comunidadesUsuario: Comunidad[] = []; // Arreglo para almacenar las comunidades creadas por el usuario
  offset: number = 0; // Inicializar el offset
  limit: number = 10; // Número de comunidades a cargar por solicitud
  loading: boolean = false; // Para manejar el estado de carga

  constructor(
    private comunidadService: ComunidadService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getComunidadesUsuario(); // Cargar las comunidades creadas por el usuario al inicializar el componente
    window.addEventListener('scroll', this.onScroll.bind(this));
  }

  private getComunidadesUsuario(): void {
    if (this.loading) return; // Evitar cargar si ya se está cargando
    this.loading = true; // Establecer estado de carga
    const usuarioId = this.authService.getUsuarioId();
    this.comunidadService.comunidadesCreadasPorUsuario(this.offset, this.limit).subscribe(
      (dataPackage) => {
        const responseData = dataPackage.data;
        if (Array.isArray(responseData)) {
          this.comunidadesUsuario.push(...responseData); // Agregar comunidades a la lista existente
          this.offset += this.limit; // Aumentar el offset
        }
        this.loading = false; // Restablecer estado de carga
      },
      (error) => {
        console.error("Error al cargar las comunidades del usuario:", error);
        this.loading = false; // Restablecer estado de carga en caso de error
      }
    );
  }

  irADetallesDeComunidad(id: number): void {
    this.router.navigate(['/creadorComunidad', id]); // Navega a la ruta /comunidades/:id
  }

  onScroll(): void {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight && !this.loading) {
      this.getComunidadesUsuario(); // Cargar más comunidades al llegar al final de la página
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onScroll.bind(this)); // Limpiar el listener
  }
}
