import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventoService } from './evento.service';
import { Evento } from './evento';
import { FormsModule } from '@angular/forms';
import { catchError, debounceTime, distinctUntilChanged, filter, map, Observable, of, switchMap, tap } from 'rxjs';
import { Etiqueta } from '../etiqueta/etiqueta';
import { EtiquetaService } from '../etiqueta/etiqueta.service';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common'; // Importar CommonModule


@Component({
  selector: 'app-crear-evento',
  templateUrl: './crearEvento.component.html',
  styleUrls: ['./crearEvento.component.css'],
  standalone: true,
  imports: [FormsModule, NgbTypeaheadModule, CommonModule]
})
export class CrearEventoComponent {
  evento! : Evento;
  minFechaHora: string = '';
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;

  constructor(
    private eventoService: EventoService,
    private etiquetaService: EtiquetaService,
    private router: Router
  ) {}

    ngOnInit(): void {
        this.evento = <Evento>{
            fechaHora:'2025-02-19T12:41:00Z'
        }; // Aseguramos que el objeto evento esté inicializado
        this.setMinFechaHora();
    }

  setMinFechaHora(): void {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    const hours = today.getHours().toString().padStart(2, '0');
    const minutes = today.getMinutes().toString().padStart(2, '0');
    this.minFechaHora = `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  searchEtiqueta = (text$: Observable<string>): Observable<Etiqueta[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      tap(() => (this.searching = true)),
      switchMap((term) =>
        this.etiquetaService
          .search(term)
          .pipe(
            map((response) => response.data as Etiqueta[]),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            })
          )
      ),
      tap(() => (this.searching = false))
    );

  agregarEtiqueta(event: any): void {
    const etiqueta: Etiqueta = event.item;  
    if (!this.etiquetasSeleccionadas.some(e => e.id === etiqueta.id)) {
      this.etiquetasSeleccionadas.push(etiqueta);
      console.info(etiqueta.nombre);
    }
    this.etiquetaSeleccionada = null;  
  }

  eliminarEtiqueta(etiqueta: Etiqueta): void {
    this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(e => e.id !== etiqueta.id);
  }

  resultFormatEtiqueta(value: Etiqueta) {
    return value.nombre;
  }

  inputFormatEtiqueta(value: Etiqueta) {
    return value ? value.nombre : '';
  }

  cancel(): void {
    this.router.navigate(['/eventos']);
  }

  saveEvento(): void {
   // this.evento.fechaHora = new Date(this.evento.fechaHora).toISOString(); // Convierte a formato ISO
   //console.info (this.evento);
   this.eventoService.save(this.evento).subscribe(dataPackage => {
        this.evento = <Evento>dataPackage.data;
       // this.goBack();
    });
  }


}
