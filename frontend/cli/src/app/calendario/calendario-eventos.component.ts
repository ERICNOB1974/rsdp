import { Component, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventoService } from '../eventos/evento.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { NgIf } from '@angular/common';
import { Evento } from '../eventos/evento';
import { DataPackage } from '../data-package';
import { Router } from '@angular/router';
import esLocale from '@fullcalendar/core/locales/es';

@Component({
  selector: 'app-calendario',
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.css'],
  standalone: true,
  imports: [FullCalendarModule, NgIf]
})
export class CalendarioEventosComponent {
  calendarOptions: CalendarOptions;
  eventos: Evento[] = []; // Define aquí tu array de eventos

  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  constructor(private eventosService: EventoService, private router: Router) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      height: 'auto', // Esto permitirá que el calendario se ajuste automáticamente
      aspectRatio: 1.35,
      locale: esLocale,
      headerToolbar: {
        left: 'prev,next today', // Mantiene el botón para navegar entre meses y el botón de "Hoy"
        center: 'title',
        right: '', // Borra el botón 'dayGridMonth'
      },
      buttonText: {
        today: 'Hoy', // Cambia el texto del botón "today" a "Hoy"
      },
      initialView: 'dayGridMonth', // Establece la vista mensual por defecto
      events: [], // Inicializa el array de eventos
      dateClick: this.handleDateClick.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventContent: (arg) => {
        // Renderiza el contenido de cada evento con el cursor configurado
        return {
          html: `<div class="fc-event-title" style="white-space: normal; overflow: hidden; text-overflow: ellipsis; cursor: pointer">${arg.event.title}</div>`
        };
      },
    };
    
  }

  ngOnInit() {
    this.eventosService.eventosFuturosPertenecientesAUnUsuario().subscribe((dataPackage: DataPackage) => {
      this.eventos = dataPackage.data as Evento[];

      // Mapeo de eventos a un formato que FullCalendar entiende
      this.calendarOptions.events = this.eventos.map(evento => ({
        title: evento.nombre,
        start: new Date(evento.fechaHora).toISOString(),
        allDay: true,
        extendedProps: {
          id: evento.id // Asignar el ID del evento
        }
      }));
    });
  }

  handleDateClick(arg: DateClickArg) {
    console.log('Clicked on: ', arg.date);
  }

  handleEventClick(arg: EventClickArg) {
    const eventoId = arg.event.extendedProps['id'];
    this.router.navigate([`eventos/${eventoId}`]);
  }


}
