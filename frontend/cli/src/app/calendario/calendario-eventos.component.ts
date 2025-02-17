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
import { IdEncryptorService } from '../idEcnryptorService';

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
  indiceActual: number = 0;
  disablePrev: boolean = false;
  disableNext: boolean = false;

  @ViewChild('fullcalendar') fullcalendar!: FullCalendarComponent;

  constructor(
    private eventosService: EventoService,
    private router: Router,
    private rutinaService: RutinaService,
    private idEncryptorService: IdEncryptorService

  ) {
    this.calendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: this.getInitialView(),
      locales: [esLocale],
      locale: 'es',
      headerToolbar: {
        left: 'customPrev,customNext today',
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
    this.calendarOptions.customButtons = {
      customPrev: {
        text: '<',
        click: () => this.navigateToPreviousActivity()
      },
      customNext: {
        text: '>',
        click: () => this.navigateToNextActivity()
      },
      today: {
        text: 'Hoy',
        click: () => this.goToToday()
      }
    };
    this.updateNavigationButtons();
  }

  updateNavigationButtons(): void {
    if (!this.fullcalendar || !this.fullcalendar.getApi()) return; // Asegurar que el calendario esté listo

    const calendarApi = this.fullcalendar.getApi();
    const currentDate = calendarApi.getDate(); // Fecha actual en la vista
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    currentDate.setHours(0, 0, 0, 0);

    const prevButton = document.querySelector('.fc-customPrev-button');
    const nextButton = document.querySelector('.fc-customNext-button');

    const isMonthView = calendarApi.view.type === 'dayGridMonth';
    const isDayView = calendarApi.view.type === 'dayGridDay';

    const previousActivityDate = this.getPreviousActivityDate();
    this.disablePrev = !previousActivityDate;


    // 🔹 Habilitar "siguiente" solo si hay una actividad futura
    this.disableNext = !this.getNextActivityDate();

    if (prevButton) {
      prevButton.classList.toggle('disabled', this.disablePrev);
      this.disablePrev ? prevButton.setAttribute('disabled', 'true') : prevButton.removeAttribute('disabled');
    }

    if (nextButton) {
      nextButton.classList.toggle('disabled', this.disableNext);
      this.disableNext ? nextButton.setAttribute('disabled', 'true') : nextButton.removeAttribute('disabled');
    }
  }






  getFilteredEventDates(): string[] {
    if (!this.calendarOptions.events) return [];

    // Filtra solo los eventos visibles según los filtros activados
    const filteredEvents = (this.calendarOptions.events as any[]).filter(event => {
      return (
        (event.extendedProps.type === 'evento' && this.showEventos) ||
        (event.extendedProps.type === 'rutina' && this.showRutinas) ||
        (event.extendedProps.type === 'recomendado' && this.showRecomendados)
      );
    });

    // Obtener fechas únicas ordenadas en formato YYYY-MM-DD
    const uniqueDates = Array.from(
      new Set(filteredEvents.map(event => new Date(event.start).toISOString().split('T')[0]))
    ).sort();

    return uniqueDates;
  }



  navigateToNextActivity(): void {
    const calendarApi = this.fullcalendar?.getApi();
    if (!calendarApi || this.disableNext) return;  // Evita la ejecución si el botón está deshabilitado

    const currentView = calendarApi.view.type;

    if (currentView === 'dayGridDay') {
      const nextActivityDate = this.getNextActivityDate();
      if (nextActivityDate) {
        calendarApi.gotoDate(nextActivityDate);
      }
    } else {
      calendarApi.next();
    }

    this.updateNavigationButtons(); // Actualizar botones después de la navegación
  }

  navigateToPreviousActivity(): void {
    const calendarApi = this.fullcalendar?.getApi();
    if (!calendarApi || this.disablePrev) return;  // Evita la ejecución si el botón está deshabilitado

    const currentView = calendarApi.view.type;

    if (currentView === 'dayGridDay') {
      const previousActivityDate = this.getPreviousActivityDate();
      if (previousActivityDate) {
        calendarApi.gotoDate(previousActivityDate);
      }
    } else {
      calendarApi.prev();
    }

    this.updateNavigationButtons(); // Actualizar botones después de la navegación
  }


  getNextActivityDate(): string | null {
    const eventDates = this.getFilteredEventDates();
    if (eventDates.length === 0) return null;  // No hay fechas de actividad

    const calendarApi = this.fullcalendar?.getApi();
    if (!calendarApi) return null;

    const currentDate = new Date(calendarApi.getDate()).toISOString().split('T')[0]; // Obtener la fecha actual desde el calendario

    // Buscar la primera fecha futura disponible en el calendario
    const nextDate = eventDates.find(date => date > currentDate) || null;
    return nextDate;
  }

  getPreviousActivityDate(): string | null {
    const eventDates = this.getFilteredEventDates();
    if (eventDates.length === 0) return null;  // No hay fechas de actividad

    const calendarApi = this.fullcalendar?.getApi();
    if (!calendarApi) return null;

    const currentDate = new Date(calendarApi.getDate()).toISOString().split('T')[0]; // Fecha actual en vista

    // Buscar la última fecha anterior a la actual
    const previousDate = [...eventDates].reverse().find(date => date < currentDate) || null;
    return previousDate;
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

  goToToday(): void {
    const calendarApi = this.fullcalendar?.getApi();
    if (!calendarApi) return;

    calendarApi.today(); // Mueve el calendario a la fecha actual
    this.updateNavigationButtons(); // Asegurar que los botones se actualicen correctamente
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

        this.loadEventos(calendarEvents, colorMap);
        this.updateNavigationButtons();
        setTimeout(() => {
          if (Array.isArray(this.calendarOptions.events)) {
            this.allEvents = [...this.calendarOptions.events];
          } else {
            this.allEvents = []; // Asignar un valor predeterminado si no es un array
          }
        }, 0);
        this.updateNavigationButtons();
      },
      (error) => console.error('Error al cargar rutinas:', error)
    );
    this.updateNavigationButtons();
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

    this.updateNavigationButtons();

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

    this.updateNavigationButtons(); // Actualizar botones después de la navegación

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

        eventos.forEach(evento => {
          //esto hice yo para poner bien la fecha eric, hay que adaptar lo del endDate
          evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
          const fechaUTC = new Date(evento.fechaHora);
          evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);


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

        this.updateNavigationButtons();

        this.calendarOptions.events = calendarEvents;

        // Cargar eventos recomendados
        this.eventosService.sugerencias(0, 1000).subscribe((dataPackage: DataPackage) => {
          const data = dataPackage.data as { data: any[], totalPaginas: number };
          data.data.forEach(item => {
            const evento = item.evento;

            //esto hice yo para poner bien la fecha eric
            evento.fechaDeCreacion = new Date(evento.fechaDeCreacion);
            const fechaUTC = new Date(evento.fechaHora);
            evento.fechaHora = new Date(fechaUTC.getTime() + 3 * 60 * 60 * 1000);

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
      const idCifrado = this.idEncryptorService.encodeId(rutinaId);

      this.router.navigate([`/rutinas`, idCifrado]);
    } else if (type === 'evento' || type === 'recomendado') {
      const idCifrado = this.idEncryptorService.encodeId(id);

      this.router.navigate([`/eventos`, idCifrado]);
    }
  }
}
