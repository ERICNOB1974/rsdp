import { Component, OnInit, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import { EventoService } from '../eventos/evento.service';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import { Evento } from '../eventos/evento';
import { DataPackage } from '../data-package';
import { Router } from '@angular/router';
import esLocale from '@fullcalendar/core/locales/es'; 


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.css'],
  standalone: true,
  imports: [FullCalendarModule]
})
export class CalendarioEventosComponent implements OnInit {
  calendarOptions: CalendarOptions;
  eventos: Evento[] = [];

  @ViewChild('fullcalendar') fullcalendar?: FullCalendarComponent;

  constructor(private eventosService: EventoService, private router: Router) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      locales: [esLocale], // Agrega el idioma aquí
      locale: 'es', // Establece el idioma como español
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
          html: `<div class="fc-event-title" style="white-space: normal; overflow: hidden; text-overflow: ellipsis; cursor: pointer">${arg.event.title}</div>`
        };
      },
      nextDayThreshold: '00:00:00',
      displayEventEnd: true,
      fixedWeekCount: false,
      showNonCurrentDates: true // Habilita la visualización de días no actuales
    };
  }

  ngOnInit() {
    this.eventosService.eventosFuturosPertenecientesAUnUsuario().subscribe((dataPackage: DataPackage) => {
      this.eventos = dataPackage.data as Evento[];
  
      console.log('Eventos recibidos del backend:', this.eventos); // Agrega esta línea
  
      this.calendarOptions.events = this.eventos.map(evento => {
        const startDate = new Date(evento.fechaHora);
        startDate.setHours(0, 0, 0, 0); // Asegura que la fecha de inicio sea a las 00:00:00
  
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1); // Añade un día
        endDate.setMilliseconds(endDate.getMilliseconds() - 1); // Resta 1 milisegundo para que termine justo antes de la medianoche
  
        const calendarEvent = {
          title: evento.nombre,
          start: startDate.toISOString(),
          end: endDate.toISOString(),
          allDay: true,
          extendedProps: {
            id: evento.id
          }
        };
  
        console.log('Evento procesado:', calendarEvent); // Agrega esta línea
  
        return calendarEvent;
      });
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