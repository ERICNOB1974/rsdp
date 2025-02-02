import { ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms'; // Importa FormsModule
import { ComunidadService } from './comunidad.service';
import { Comunidad } from './comunidad';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { cantidadParticipantesValidator } from '../eventos/validacionesEvento';
import { Etiqueta } from '../etiqueta/etiqueta';
import { catchError, debounceTime, distinctUntilChanged, filter, firstValueFrom, map, Observable, of, switchMap, tap } from 'rxjs';
import { EtiquetaPopularidadDTO } from '../etiqueta/etiquetaPopularidadDTO';
import { DataPackage } from '../data-package';
import { EtiquetaService } from '../etiqueta/etiqueta.service';

@Component({
  selector: 'app-editar-comunidad',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NgbTypeaheadModule, MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatFormFieldModule, ReactiveFormsModule,
    NgIf],
  templateUrl: './editarComunidad.component.html',
  styleUrls: ['./editarComunidad.component.css', '../css/crear.component.css', '../css/registro.component.css', '../css/etiquetas.css']
})
export class EditarComunidadComponent implements OnInit {
  comunidad!: Comunidad; // Comunidad que se va a editar
  idComunidad!: number;
  formatoValido: boolean = true;
  archivoSeleccionado!: File; // Para almacenar la imagen o video seleccionado
  tipoArchivo: string = ''; // Para distinguir entre imagen o video
  vistaPreviaArchivo: string | ArrayBuffer | null = null;
  formComunidad: FormGroup;
  searching: boolean = false;
  searchFailed: boolean = false;
  etiquetasSeleccionadas: Etiqueta[] = [];
  etiquetasOriginales: Etiqueta[] = [];
  etiquetaSeleccionada: Etiqueta | null = null;
  mostrarTooltip: boolean = false;
  mostrarTooltipPrivada: boolean = false;
  @ViewChild('etiquetasInput') etiquetasInput!: ElementRef<HTMLInputElement>;
  @ViewChild('etiquetasModel') etiquetasModel!: NgModel;


  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private comunidadService: ComunidadService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private etiquetaService: EtiquetaService,
    private snackBar: MatSnackBar
  ) {

    this.formComunidad = this.formBuilder.group(
      {
        nombre: ['', [Validators.required]],

        cantidadMaximaMiembros: [
          '',
          [Validators.required],
          [cantidadParticipantesValidator.bind(this)],
        ],
        latitud: [
          '',
          [Validators.required]
        ],
        longitud: ['', [Validators.required]],
        descripcion: [''],
        imagen: [''],
        esPrivada: [false],  // Inicializar con false
        esModerada: [false],
        etiquetas: this.formBuilder.array([], Validators.required) // Agregar FormArray para etiquetas

      }

    );
  }

  ngOnInit(): void {
    this.idComunidad = Number(this.route.snapshot.paramMap.get('id'));
    this.cargarComunidad();
    this.formComunidad.markAllAsTouched();

  }

  cargarComunidad(): void {
    this.comunidadService.get(this.idComunidad).subscribe((dataPackage) => {
      if (dataPackage.status === 200) {
        this.comunidad = dataPackage.data as Comunidad;
      } else {
        console.error(dataPackage.message);
      }
      this.formComunidad.patchValue({
        nombre: this.comunidad.nombre,
        cantidadMaximaMiembros: this.comunidad.cantidadMaximaMiembros,
        latitud: this.comunidad.latitud,
        longitud: this.comunidad.longitud,
        imagen: this.comunidad.imagen,
        descripcion: this.comunidad.descripcion,
        esPrivada: this.comunidad.esPrivada,
        esModerada: this.comunidad.esModerada,
        etiquetas: this.etiquetasSeleccionadas
      });
      this.cargarEtiquetas();
    });
  }

  guardarCambios(): void {

    this.comunidad = { ...this.comunidad, ...this.formComunidad.value };
    this.etiquetasSeleccionadas = this.etiquetas.value;
    this.comunidadService.save(this.comunidad).subscribe(async () => {
      this.snackBar.open('Comunidad actualizada con éxito', 'Cerrar', {
        duration: 3000
      });

      // Verificar y crear etiquetas si es necesario
      for (const etiqueta of this.etiquetasSeleccionadas) {
        const existe = await this.etiquetaService.verificarExistencia(etiqueta.nombre).toPromise();
        let etiquetaFinal = etiqueta;

        if (!existe) {
          const nuevaEtiqueta = { id: 0, nombre: etiqueta.nombre };
          etiquetaFinal = await firstValueFrom(this.etiquetaService.crearEtiqueta(nuevaEtiqueta));
        }

        // Realizar la etiquetación con la etiqueta final
        if (!this.etiquetasOriginales.some(e => e.id === etiquetaFinal.id)) {
          await this.comunidadService.etiquetar(this.comunidad, etiquetaFinal.id).toPromise();
        }
      }
      // Desetiquetar etiquetas removidas
      for (const etiqueta of this.etiquetasOriginales) {
        if (!this.etiquetasSeleccionadas.some(e => e.id === etiqueta.id)) {
          await this.comunidadService.desetiquetar(this.comunidad.id, etiqueta.id).toPromise();
        }
      }

      //por cada uno tengo que etiquetarlo si es que no esta etiquetado de antes.
      //si esta en etiquetasOriginales y no en etiquetasSeleccionadas, entonces tengo que mandar a desetiquetar
      //si no esta en etiquetasOriginales y si en etiquetasSeleccionadas, entonces tengo que mandar a etiquetar
      //si esta en los dos no hago nada


      this.router.navigate(['/comunidad-muro', this.idComunidad]);
    }, error => {
      console.error('Error al actualizar la comunidad', error);
      this.snackBar.open('Error al actualizar la comunidad', 'Cerrar', {
        duration: 3000,
      });
    });
  }

  cancelar(): void {
    this.router.navigate(['/comunidades']); // Navegar de vuelta si se cancela
  }



  onFileSelect(event: any) {
    const file = event.target.files[0];
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file) {
      // Verificar si el archivo es una imagen o un video
      if (validImageTypes.includes(file.type)) {
        this.formatoValido = true; // El formato es válido
        this.archivoSeleccionado = file;

        // Detecta el tipo de archivo
        const fileType = file.type.split('/')[0];
        this.tipoArchivo = fileType; // 'image' o 'video'

        // Crea la vista previa
        const reader = new FileReader();
        reader.onload = () => {
          this.vistaPreviaArchivo = reader.result;
          this.comunidad.imagen = reader.result as string; // Aquí obtenemos la cadena base64
        };
        reader.readAsDataURL(file);

        this.comunidad.imagen = file;

      } else {
        this.formatoValido = false; // El formato no es válido
        this.vistaPreviaArchivo = null; // No se muestra la vista previa
        this.snackBar.open('Formato no válido. Solo se permiten imágenes (JPEG, PNG, GIF).', 'Cerrar', {
          duration: 3000,
        });
      }
    }
  }


  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevenir el comportamiento predeterminado
    event.stopPropagation();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Asegurarse de que existen archivos en el evento
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0]; // Toma el primer archivo
      const inputEvent = { target: { files: [file] } }; // Crea un evento similar al del input
      this.onFileSelect(inputEvent); // Reutiliza tu lógica para manejar el archivo
    }
  }


  eliminarArchivo(): void {
    this.vistaPreviaArchivo = null;
    this.formatoValido = false;
    this.comunidad.imagen = '';

  }

  /*   agregarEtiqueta(event: any): void {
      const etiqueta: Etiqueta = event.item;
  
      // Verificar por nombre en lugar de por ID para evitar duplicados
      if (!this.etiquetasSeleccionadas.some(e => e.nombre === etiqueta.nombre)) {
        this.etiquetasSeleccionadas.push(etiqueta);
      }
  
      // Restablecer la etiqueta seleccionada
      this.etiquetaSeleccionada = null;
      
      // Forzar actualización visual del input
      this.cdr.detectChanges();
    }
    
    eliminarEtiqueta(etiqueta: Etiqueta): void {
      this.etiquetasSeleccionadas = this.etiquetasSeleccionadas.filter(
        e => e.nombre !== etiqueta.nombre
      );
    } */


  cargarEtiquetas2() {
    this.etiquetaService.etiquetasEnComunidad(this.comunidad.id).subscribe(dataPackage => {
      this.etiquetasSeleccionadas = dataPackage.data as Etiqueta[]
    });
  }


  cargarEtiquetas() {
    this.etiquetaService.etiquetasEnComunidad(this.comunidad.id).subscribe(dataPackage => {
      this.etiquetasSeleccionadas = dataPackage.data as Etiqueta[];
      this.etiquetasOriginales = dataPackage.data as Etiqueta[];

      // Accedemos al FormArray y lo llenamos con las etiquetas obtenidas
      const etiquetasFormArray = this.formComunidad.get('etiquetas') as FormArray;
      etiquetasFormArray.clear(); // Limpiar antes de agregar nuevas etiquetas

      this.etiquetasSeleccionadas.forEach(etiqueta => {
        etiquetasFormArray.push(new FormControl(etiqueta));
      });

      this.cdr.detectChanges(); // Forzar actualización de la vista si es necesario
    });
  }



  get etiquetas(): FormArray {
    return this.formComunidad.get('etiquetas') as FormArray;
  }


  agregarEtiqueta(event: any) {
    const etiqueta = event.item;
    const etiquetasArray = this.etiquetas as FormArray; // Aseguramos que es un FormArray

    // Verificamos si la etiqueta ya existe comparando por ID
    if (!etiquetasArray.controls.some(control => control.value.id === etiqueta.id)) {
      etiquetasArray.push(new FormControl(etiqueta));
    }

    setTimeout(() => {
      this.etiquetasInput.nativeElement.value = '';
      this.etiquetasModel.control.setValue('');
    });
  }


  eliminarEtiqueta(etiqueta: any) {
    const index = this.etiquetas.value.findIndex((e: any) => e.id === etiqueta.id);
    if (index !== -1) {
      this.etiquetas.removeAt(index);
    }
  }



  searchEtiqueta = (text$: Observable<string>): Observable<EtiquetaPopularidadDTO[]> =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(term => term.length >= 2),
      tap(() => (this.searching = true)),
      switchMap(term =>
        this.etiquetaService.search(term).pipe(
          map((response: DataPackage) => response.data as EtiquetaPopularidadDTO[]),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          })
        )
      ),
      tap(() => (this.searching = false))
    );



  resultFormatEtiqueta(value: EtiquetaPopularidadDTO): string {
    return `${value.nombre} (${value.popularidad})`;
  }

  inputFormatEtiqueta(value: Etiqueta): string {
    return value ? value.nombre : '';
  }

  toggleTooltip(event: Event): void {
    event.stopPropagation(); // Evita que el click en el ícono cierre el tooltip
    this.mostrarTooltip = !this.mostrarTooltip;
  }

  @HostListener('document:click')
  cerrarTooltip(): void {
    this.mostrarTooltip = false;
  }

  toggleTooltipPrivada(event: Event): void {
    event.stopPropagation(); // Evita que el click en el ícono cierre el tooltip
    this.mostrarTooltipPrivada = !this.mostrarTooltipPrivada;
  }

  @HostListener('document:click')
  cerrarTooltipPrivada(): void {
    this.mostrarTooltipPrivada = false;
  }
}