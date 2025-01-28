import { Component, NgModule, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventoService } from '../eventos/evento.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { Evento } from '../eventos/evento';
import { DataPackage } from '../data-package';
import { Router } from '@angular/router';
import esLocale from '@fullcalendar/core/locales/es';
import { RutinaService } from '../rutinas/rutina.service';
import { Rutina } from '../rutinas/rutina';
import { FormsModule } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.css'],
  standalone: true,
  imports: [FullCalendarModule, FormsModule, NgIf, NgClass]
})
export class CalendarioEventosComponent implements OnInit {
  calendarOptions: CalendarOptions;
  eventos: Evento[] = [];
  filtersVisible = false;
  filtersAnimating: boolean = false;
  showEventos = true;
  showRutinas = true;
  showRecomendados = true;
  allEvents: any[] = []; // Variable para almacenar todos los eventos


  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  constructor(
    private eventosService: EventoService,
    private router: Router,
    private rutinaService: RutinaService
  ) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: this.getInitialView(),
      locales: [esLocale],
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },
      buttonText: {
        today: 'Hoy'
      },
      events: [],
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventContent: (arg) => {
        return {
          html: `
            <div class="custom-event" style="display: flex; flex-direction: column; justify-content: center; align-items: center; padding: 10px; background-color: rgba(0, 123, 255, 0.1); border: 1px solid #007bff; color: #007bff; text-align: center; font-family: 'Arial', sans-serif; font-size: 14px; width: 100%; box-sizing: border-box; cursor: pointer; overflow: hidden;">
              <div class="custom-event-title" style="font-size: 18px; color: #111; font-weight: bold; margin-bottom: 5px; width: 100%; white-space: normal; overflow: hidden; text-overflow: ellipsis; cursor: pointer; word-wrap: break-word; word-break: break-word; line-height: 1.4; text-transform: uppercase;">
                ${arg.event.extendedProps['type'] === 'rutina' ? 'Rutina' :
              arg.event.extendedProps['type'] === 'evento' ? 'Evento' :
                arg.event.extendedProps['type'] === 'recomendado' ? 'Sugerencia Evento' : 'Evento Desconocido'}
              </div>
              <div class="custom-event-name" style="font-size: 16px; color: #555; font-weight: bold; margin-bottom: 5px; width: 100%; white-space: normal; overflow: hidden; text-overflow: ellipsis; cursor: pointer; word-wrap: break-word; word-break: break-word; line-height: 1.4;">
                ${arg.event.title} 
              </div>
              ${arg.event.extendedProps['type'] === 'rutina' ?
              `<div class="custom-event-description" style="font-size: 14px; color: #555; margin-top: 5px; width: 100%; text-align: left; white-space: normal; overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; word-break: break-word; line-height: 1.4;">
                  <strong>Día:</strong> ${arg.event.extendedProps['description']}
                </div>`
              : ''
            }
            </div>`
        };
      },
      nextDayThreshold: '00:00:00',
      displayEventEnd: true,
      fixedWeekCount: false,
      showNonCurrentDates: true,
      longPressDelay: 0,
      height: '100%', // Adapta la altura al contenedor
      contentHeight: 'auto', // Ajusta dinámicamente según el contenido
      aspectRatio: 1.8, // Relación de aspecto entre ancho y alto (ajusta este valor según el diseño)
    };
  }

  // Asegúrate de que el código de la lupa se quede dentro de esta función
  openMotivoModal(motivo: string, event: Event) {
    // Detener la propagación del clic al contenedor de FullCalendar
    event.stopPropagation();

    const modal = document.getElementById('motivoModal');
    const motivoText = document.getElementById('motivoText');
    if (modal && motivoText) {
      motivoText.innerHTML = motivo;
      modal.style.display = 'block'; // Mostrar el modal
    }
  }

  ngOnInit() {

    // Guardar los eventos cargados en `allEvents`

    window.addEventListener('resize', this.updateView.bind(this)); // Detectar cambios en tamaño de pantalla

    const colorMap = {
      rutina: ['#FFA500', '#1E90FF', '#32CD32', '#FF6347', '#9370DB'], // Colores únicos para rutinas
      evento: '#FFC0CB', // Rosa para eventos
      recomendado: '#FFD700' // Dorado para sugerencias
    };
    const calendarEvents: any[] = [];
    this.loadEventos([], colorMap);

    // Cargar rutinas
    this.rutinaService.rutinasRealizaUsuarioSinPaginacion().subscribe(
      (dataPackage: DataPackage[]) => {
        const rutinas = dataPackage as unknown as Rutina[];
        console.log('Rutinas recibidas y procesadas:', rutinas);

        rutinas.forEach((rutina, rutinaIndex) => {
          const color = colorMap.rutina[rutinaIndex % colorMap.rutina.length]; // Color cíclico para rutinas
          let baseDate = new Date();
          baseDate.setHours(0, 0, 0, 0);

          if (rutina.hizoUltimoDiaHoy) {
            baseDate.setDate(baseDate.getDate() + 1); // Comenzar desde el día siguiente
          }

          if (rutina.dias && rutina.dias.length > 0) {
            rutina.dias.forEach((dia, diaIndex) => {
              const eventDate = new Date(baseDate);
              eventDate.setDate(baseDate.getDate() + diaIndex);

              calendarEvents.push({
                title: `${rutina.nombre}`,
                start: eventDate.toISOString(),
                end: eventDate.toISOString(),
                allDay: true,
                backgroundColor: color, // Color específico para cada rutina
                extendedProps: {
                  type: 'rutina',
                  rutinaId: rutina.id ?? 0,
                  diaId: dia.id ?? 0,
                  description: `${dia.nombre}`
                }
              });
            });
          }
        });

        console.log('Eventos de rutinas generados:', calendarEvents);
        this.loadEventos(calendarEvents, colorMap);
        setTimeout(() => {
          if (Array.isArray(this.calendarOptions.events)) {
            this.allEvents = [...this.calendarOptions.events];
          } else {
            this.allEvents = []; // Asignar un valor predeterminado si no es un array
          }
        }, 0);

      },
      (error) => console.error('Error al cargar rutinas:', error)
    );
  }

  toggleFilters() {
    if (this.filtersAnimating) return; 

    this.filtersAnimating = true;

    if (this.filtersVisible) {

      this.filtersVisible = false;

      setTimeout(() => {
        this.filtersAnimating = false;
      }, 500); 
    } else {

      this.filtersVisible = true;

      setTimeout(() => {
        this.filtersAnimating = false;
      }, 500); 
    }
  }

  updateCalendar() {
    // Filtrar los eventos en función de los filtros activados
    const filteredEvents = this.allEvents.filter((event: any) => {
      const showEvento = event.extendedProps.type === 'evento' && this.showEventos;
      const showRutina = event.extendedProps.type === 'rutina' && this.showRutinas;
      const showRecomendados = event.extendedProps.type === 'recomendado' && this.showRecomendados;      
      return showEvento || showRutina || showRecomendados; // Solo mostramos eventos que cumplan con los filtros
    });
  
    // Actualizar la lista de eventos que se muestra en el calendario
    if (this.fullcalendar) {
      const calendarApi = this.fullcalendar.getApi();
      calendarApi.removeAllEvents(); // Eliminar todos los eventos actuales
      this.addEvents(filteredEvents); // Añadir los eventos filtrados
    }
  }
  
  addEvents(filteredEvents: any[]) {
    this.calendarOptions.events = filteredEvents;
  }
  
  loadEventos(calendarEvents: any[], colorMap: any) {
    this.allEvents = calendarEvents;

    // Cargar eventos deportivos
    this.eventosService.eventosFuturosPertenecientesAUnUsuario().subscribe(
      (dataPackage: DataPackage) => {
        const eventos = dataPackage.data as Evento[];
        console.log('Eventos recibidos del backend:', eventos);

        eventos.forEach(evento => {
          const startDate = new Date(evento.fechaHora);
          startDate.setHours(0, 0, 0, 0);
          const endDate = new Date(startDate);
          endDate.setDate(endDate.getDate() + 1);
          endDate.setMilliseconds(endDate.getMilliseconds() - 1);

          calendarEvents.push({
            title: evento.nombre,
            start: startDate.toISOString(),
            end: endDate.toISOString(),
            allDay: true,
            backgroundColor: colorMap.evento, // Azul para eventos
            extendedProps: {
              type: 'evento',
              id: evento.id
            }
          });
        });

        this.allEvents = [...calendarEvents]; // Asegúrate de que allEvents se actualice aquí

        this.updateCalendar();

        console.log('Eventos deportivos generados:', calendarEvents);
        this.calendarOptions.events = calendarEvents;

        // Cargar eventos recomendados
        this.eventosService.sugerencias(0, 1000).subscribe((dataPackage: DataPackage) => {
          const data = dataPackage.data as { data: any[], totalPaginas: number };
          data.data.forEach(item => {
            const evento = item.evento;
            const startDate = new Date(evento.fechaHora);
            startDate.setHours(0, 0, 0, 0);
            const endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            endDate.setMilliseconds(endDate.getMilliseconds() - 1);

            calendarEvents.push({
              title: evento.nombre,
              start: startDate.toISOString(),
              end: endDate.toISOString(),
              allDay: true,
              backgroundColor: colorMap.recomendado, // Dorado para sugerencias
              extendedProps: {
                type: 'recomendado',
                id: evento.id,
                motivo: item.motivo
              }
            });
          });

          console.log('Eventos recomendados generados:', calendarEvents);

          setTimeout(() => {
            this.calendarOptions.events = [...calendarEvents];
          }, 0);

          this.allEvents = [...calendarEvents]; // Asegúrate de que allEvents se actualice aquí

          this.updateCalendar();
          
        }, (error) => console.error('Error al cargar eventos recomendados:', error));
      },
      (error) => console.error('Error al cargar eventos:', error)
    );
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateView.bind(this)); // Limpiar el evento
  }

  getInitialView(): string {
    return window.innerWidth < 900 ? 'dayGridDay' : 'dayGridMonth'; // Vista inicial según el tamaño
  }

  updateView() {
    const newView = this.getInitialView();
    const calendarApi = this.fullcalendar?.getApi();
    if (calendarApi && calendarApi.view.type !== newView) {
      calendarApi.changeView(newView); // Cambiar la vista dinámicamente
    }
  }

  handleDateClick(arg: DateClickArg) {
    console.log('Clicked on: ', arg.date);
  }

  handleEventClick(arg: EventClickArg) {
    const { type, rutinaId, id } = arg.event.extendedProps;

    if (type === 'rutina') {
      this.router.navigate([`/rutinas/${rutinaId}`]);
    } else if (type === 'evento' || type === 'recomendado') {
      this.router.navigate([`/eventos/${id}`]);
    }
  }
}
