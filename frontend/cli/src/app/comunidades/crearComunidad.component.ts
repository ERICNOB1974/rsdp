import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';
import { Location } from '@angular/common'; // Asegúrate de que está importado desde aquí

@Component({
  selector: 'app-comunidades-detail',

  templateUrl: './crearComunidad.component.html',
  styleUrls: ['./comunidades-detail.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ComunidadDetailComponent {
  comunidad!: Comunidad;
  showMessage: boolean = false;
  messageToShow: string = '';
  cursorBlocked: boolean = false;
  creada: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private comunidadService: ComunidadService,
    private router: Router
  ) { }

  goBack(): void {
    this.location.back(); // Esto debería funcionar correctamente
  }

  get(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id === 'new') {
      this.comunidad = <Comunidad>{};
    } else {
      this.comunidadService.get(parseInt(id)).subscribe(dataPackage => this.comunidad = <Comunidad>dataPackage.data);
    }
  }

  ngOnInit() {
    this.get();
  }


  saveComunidad(): void {
    this.comunidadService.save(this.comunidad).subscribe(dataPackage => {
      this.comunidad = <Comunidad>dataPackage.data;
      this.messageToShow = '¡La comunidad se ha guardado exitosamente!';
      this.showMessage = true; // Mostrar el mensaje
      setTimeout(() => {
        this.showMessage = false;
      }, 10000);
    },
    error => {
      this.messageToShow = 'Ocurrió un error al guardar la comunidad.';
      this.showMessage = true; // Mostrar el mensaje de error
      setTimeout(() => {
        this.showMessage = false;
      }, 10000);
    });
    console.log(this.comunidad);
  }
   cancel(): void {
    this.router.navigate(['/comunidades']);
  } 
}
