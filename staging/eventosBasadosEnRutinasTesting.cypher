//RecomendacionesEventosBasadosEnRutinas
MATCH (n)
DETACH DELETE n;

// Crear usuarios
CREATE (lucas:Usuario { nombreUsuario: 'lucas123', nombreReal: 'lucas Lopez', correoElectronico: 'lucas@example.com', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(eric:Usuario { nombreUsuario: 'eric456', nombreReal: 'eric Perez', correoElectronico: 'eric@example.com', latitud: -42.762555975850084,
longitud: -65.04467329781565}),
(facundo:Usuario { nombreUsuario: 'facundo789', nombreReal: 'facundo Sanchez', correoElectronico: 'facundo@example.com' , latitud: -42.762555975850084,
longitud: -65.04467329781565}),
(pepe:Usuario { nombreUsuario: 'pepe', nombreReal: 'Pedro Sanchez', correoElectronico: 'pepe@example.com', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(juan:Usuario { nombreUsuario: 'juan', nombreReal: 'Juan Gomez', correoElectronico: 'juan@example.com', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(luna:Usuario { nombreUsuario: 'luna', nombreReal: 'Luna Gomez', correoElectronico: 'luna@example.com' , latitud: -42.762555975850084,
longitud: -65.04467329781565})

// Crear rutinas
CREATE (rutina1:Rutina { id: 2711, nombre: 'Cardio para principiantes', descripcion: 'Rutina de cardio para principiantes.', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE' }),
(rutina2:Rutina { id: 2712, nombre: 'Yoga y meditación', descripcion: 'Rutina de yoga y meditación para relajarse.', duracionMinutosPorDia: 30, dificultad: 'PRINCIPIANTE' }),
(rutina3:Rutina { id: 2713, nombre: 'Fuerza avanzada', descripcion: 'Rutina avanzada de fuerza y resistencia.', duracionMinutosPorDia: 50, dificultad: 'AVANZADO' }),
(rutina4:Rutina { id: 2714, nombre: 'Cardio avanzado con fuerza', descripcion: 'Rutina combinada de cardio y fuerza.', duracionMinutosPorDia: 45, dificultad: 'INTERMEDIO' }),
(rutina5:Rutina { id: 2715, nombre: 'Entrenamiento funcional', descripcion: 'Rutina de entrenamiento funcional.', duracionMinutosPorDia: 35, dificultad: 'INTERMEDIO' }),
(rutina6:Rutina { id: 2716, nombre: 'Fuerza básica', descripcion: 'Rutina de fuerza para principiantes.', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE' }),
(rutina7:Rutina { id: 2717, nombre: 'Flexiones de brazo', descripcion: 'Rutina de felxiones', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE' }),
(rutina8:Rutina { id: 2718, nombre: 'Rutina para testear el pasado', descripcion: 'Pasado', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE' })

// Crear etiquetas
CREATE (etiquetaCardio:Etiqueta { nombre: 'Cardio' }),
(etiquetaYoga:Etiqueta { nombre: 'Yoga' }),
(etiquetaFuerza:Etiqueta { nombre: 'Fuerza' }),
(etiquetaFuncional:Etiqueta { nombre: 'Funcional' }),
(etiquetaAvanzada:Etiqueta { nombre: 'Avanzada' }),
(etiquetaFlexiones:Etiqueta { nombre: 'Flexiones' }),
(pasado:Etiqueta { nombre: 'Pasado' })

CREATE
(evento1:Evento {
  id: 1,
  nombre: 'Torneo de Fútbol 5 en Puerto Madryn',
  fechaHora: datetime('2025-09-20T18:00:00'),
  descripcion: 'Un torneo de fútbol 5 entre amigos.',
  cantidadMaximaParticipantes: 10,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false ,
  latitud: -42.762555975850084,
  longitud: -65.04467329781565
  }),
  (evento2:Evento {
    id: 2,
    nombre: 'Carrera de 10K en Comodoro',
    fechaHora: datetime('2025-09-25T07:00:00'),
    descripcion: 'Carrera de 10 kilómetros en el parque.',
    cantidadMaximaParticipantes: 50,
    fechaDeCreacion: date('2024-09-15'),
    esPrivadoParaLaComunidad: false ,
    latitud: -45.8666676301876,
    longitud: -67.52256636176106
    }),
    (evento3:Evento {
      id: 3,
      nombre: 'Torneo natacion 100M en Bahia Blanca',
      fechaHora: datetime('2025-09-28T15:00:00'),
      descripcion: '100M libre',
      cantidadMaximaParticipantes: 20,
      fechaDeCreacion: date('2024-09-15'),
      esPrivadoParaLaComunidad: false ,
      latitud: -38.7139680437262,
      longitud: -62.2872759788477
      }),
      (evento4:Evento {
        id: 4,
        nombre: 'Torneo natacion 200M en Posadas',
        fechaHora: datetime('2025-09-28T15:30:00'),
        descripcion: '200M combinados',
        cantidadMaximaParticipantes: 20,
        fechaDeCreacion: date('2024-09-15'),
        esPrivadoParaLaComunidad: false ,
        latitud: -27.38714029003687,
        longitud: -55.92143101061461
        }),
        (evento5:Evento {
          id: 5,
          nombre: 'Torneo de Básquet en Cordoba',
          fechaHora: datetime('2025-09-22T10:00:00'),
          descripcion: 'Torneo amistoso de básquet.',
          cantidadMaximaParticipantes: 12,
          fechaDeCreacion: date('2024-09-16'),
          esPrivadoParaLaComunidad: false ,
          latitud:-31.401692117465025,
          longitud: -64.19560531645799
          }),
          (evento6:Evento {
            id: 6,
            nombre: 'Carrera de 5K en Rosario',
            fechaHora: datetime('2025-09-26T08:00:00'),
            descripcion: 'Carrera de 5 kilómetros.',
            cantidadMaximaParticipantes: 30,
            fechaDeCreacion: date('2024-09-16'),
            esPrivadoParaLaComunidad: false ,
            latitud:-32.93942419471226,
            longitud: -60.69803211778888
            }),
            (evento7:Evento {
              id: 7,
              nombre: 'Clase de Yoga en La Quiaca',
              fechaHora: datetime('2025-09-24T09:00:00'),
              descripcion: 'Clase de yoga para principiantes.',
              cantidadMaximaParticipantes: 1,
              fechaDeCreacion: date('2024-09-17'),
              esPrivadoParaLaComunidad: false ,
              latitud: -22.104939502876547,
              longitud: -65.59893638666203
              })


CREATE (rutina1)-[:ETIQUETADA_CON]->(etiquetaCardio),
(rutina2)-[:ETIQUETADA_CON]->(etiquetaYoga),
(rutina3)-[:ETIQUETADA_CON]->(etiquetaFuerza),
(rutina3)-[:ETIQUETADA_CON]->(etiquetaFuncional),
(rutina4)-[:ETIQUETADA_CON]->(etiquetaCardio), // Relación con etiqueta Cardio
(rutina4)-[:ETIQUETADA_CON]->(etiquetaAvanzada), // Relación con etiqueta adicional
(rutina5)-[:ETIQUETADA_CON]->(etiquetaFuncional), // Rutina de Eric que etiquetará al evento funcional
(rutina6)-[:ETIQUETADA_CON]->(etiquetaFuerza), // Rutina de Eric que etiquetará al evento de fuerza
(rutina7)-[:ETIQUETADA_CON]->(etiquetaFlexiones),
(rutina8)-[:ETIQUETADA_CON]->(pasado)

CREATE (lucas)-[:REALIZA_RUTINA]->(rutina1),
(lucas)-[:REALIZA_RUTINA]->(rutina4),
(lucas)-[:REALIZA_RUTINA]->(rutina2),
(eric)-[:REALIZA_RUTINA]->(rutina5),
(eric)-[:REALIZA_RUTINA]->(rutina6),
(eric)-[:REALIZA_RUTINA]->(rutina4),
(facundo)-[:REALIZA_RUTINA]->(rutina3),
(facundo)-[:REALIZA_RUTINA]->(rutina4),
(pepe)-[:REALIZA_RUTINA]->(rutina7),
(juan)-[:REALIZA_RUTINA]->(rutina7)

// MATCH para crear las relaciones entre eventos y etiquetas
CREATE (evento1)-[:ETIQUETADO_CON]->(etiquetaFuncional),
(evento2)-[:ETIQUETADO_CON]->(etiquetaYoga),
(evento3)-[:ETIQUETADO_CON]->(etiquetaCardio),
(evento4)-[:ETIQUETADO_CON]->(etiquetaFuerza),
(evento4)-[:ETIQUETADO_CON]->(etiquetaAvanzada),
(evento5)-[:ETIQUETADO_CON]->(etiquetaFlexiones),
(evento6)-[:ETIQUETADO_CON]->(etiquetaFlexiones),
(evento7)-[:ETIQUETADO_CON]->(pasado)

// MATCH para establecer que Lucas participa en el evento de yoga
CREATE (lucas)-[:PARTICIPA_EN]->(evento2)
CREATE (facundo)<-[:CREADO_POR]-(evento4) // Facundo creo este evento
