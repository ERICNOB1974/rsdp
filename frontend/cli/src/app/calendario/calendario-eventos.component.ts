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
import { RutinaService } from '../rutinas/rutina.service';
import { Rutina } from '../rutinas/rutina';

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
                arg.event.extendedProps['type'] === 'recomendado' ? 'Evento Recomendado' : 'Evento Desconocido'}
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
              ${arg.event.extendedProps['type'] === 'recomendado' ?
              `<div class="custom-event-motivo" style="font-size: 14px; color: #555; margin-top: 5px; width: 100%; text-align: left; white-space: normal; overflow: hidden; text-overflow: ellipsis; word-wrap: break-word; word-break: break-word; line-height: 1.4;">
            <strong>Motivo:</strong> ${arg.event.extendedProps['motivo']}
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
      height: 'auto', // Adapta automáticamente la altura del calendario
      contentHeight: 'auto', // Ajusta el contenido dinámicamente
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
    window.addEventListener('resize', this.updateView.bind(this)); // Detectar cambios en tamaño de pantalla
    const colors = ['#FFA500', '#1E90FF', '#32CD32', '#FF6347', '#9370DB']; // Paleta de colores
    const calendarEvents: any[] = [];

    // Cargar rutinas
    this.rutinaService.rutinasRealizaUsuarioSinPaginacion().subscribe(
      (dataPackage: DataPackage[]) => {
        const rutinas = dataPackage as unknown as Rutina[];
        console.log('Rutinas recibidas y procesadas:', rutinas);

        rutinas.forEach((rutina, rutinaIndex) => {
          const color = colors[rutinaIndex % colors.length];
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
                backgroundColor: color,
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
        this.loadEventos(calendarEvents);
      },
      (error) => console.error('Error al cargar rutinas:', error)
    );
  }

  showMotivo(motivo: string) {
    alert(motivo);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.updateView.bind(this)); // Limpiar el evento
  }

  getInitialView(): string {
    return window.innerWidth < 600 ? 'dayGridDay' : 'dayGridMonth'; // Vista inicial según el tamaño
  }

  updateView() {
    const newView = this.getInitialView();
    const calendarApi = this.fullcalendar?.getApi();
    if (calendarApi && calendarApi.view.type !== newView) {
      calendarApi.changeView(newView); // Cambiar la vista dinámicamente
    }
  }


  loadEventos(calendarEvents: any[]) {
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
            extendedProps: {
              type: 'evento',
              id: evento.id
            }
          });
        });

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

        }, (error) => console.error('Error al cargar eventos recomendados:', error));
      },
      (error) => console.error('Error al cargar eventos:', error)
    );
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
