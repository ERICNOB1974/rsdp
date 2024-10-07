//RecomendacionesEventosBasadosEnAmigos
MATCH (n)
DETACH DELETE n;

CREATE
(evento1:Evento {
  id: 1,
  nombre: 'Torneo de Fútbol 5 en Puerto Madryn',
  fechaHora: datetime('2025-09-20T18:00:00'),
  ubicacion: 'Cancha Los Olivos',
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
    ubicacion: 'Parque de la Ciudad',
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
      ubicacion: 'Club ferro',
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
        ubicacion: 'Club ferro',
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
          ubicacion: 'Polideportivo Central',
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
            ubicacion: 'Parque Central',
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
              ubicacion: 'Parque de la Costa',
              descripcion: 'Clase de yoga para principiantes.',
              cantidadMaximaParticipantes: 15,
              fechaDeCreacion: date('2024-09-17'),
              esPrivadoParaLaComunidad: false ,
              latitud: -22.104939502876547,
              longitud: -65.59893638666203
              }),
              (evento8:Evento {
                id: 8,
                nombre: 'Clase abierta de pilates en Rio Colorado',
                fechaHora: datetime('2025-09-21T10:00:00'),
                ubicacion: 'Parador 9',
                descripcion: 'Pilates',
                cantidadMaximaParticipantes: 10,
                fechaDeCreacion: date('2024-09-17'),
                esPrivadoParaLaComunidad: false ,
                latitud: -38.99558682754139,
                longitud: -64.09293995572037
                }),
                (evento9:Evento {
                  id: 9,
                  nombre: 'Torneo de Tenis',
                  fechaHora: datetime('2025-09-29T09:00:00'),
                  ubicacion: 'Cancha del Club',
                  descripcion: 'Torneo individual de tenis.',
                  cantidadMaximaParticipantes: 16,
                  fechaDeCreacion: date('2024-09-18'),
                  esPrivadoParaLaComunidad: false ,
                  latitud: -54.80426286553308,
                  longitud: -68.30623991284084
                  }),
                  (evento10:Evento {
                    id: 10,
                    nombre: 'Carrera de Montaña 15K en Avellaneda',
                    fechaHora: datetime('2025-10-01T07:30:00'),
                    ubicacion: 'Montañas de la Ciudad',
                    descripcion: 'Carrera de montaña con un recorrido de 15 kilómetros.',
                    cantidadMaximaParticipantes: 30,
                    fechaDeCreacion: date('2024-09-18'),
                    esPrivadoParaLaComunidad: false ,
                    latitud: -34.66250627976314,
                    longitud: -58.36639727736851
                    }),
                    (evento11:Evento {
                      id: 11,
                      nombre: 'Futbol 11 en Rio Gallegos',
                      fechaHora: datetime('2025-10-01T22:30:00'),
                      ubicacion: 'El doradillo',
                      descripcion: 'Partido de futbol 11.',
                      cantidadMaximaParticipantes: 25,
                      fechaDeCreacion: date('2024-09-25'),
                      esPrivadoParaLaComunidad: false ,
                      latitud: -51.624288461583525,
                      longitud: -69.22815080583135
                      }),
                      (evento12:Evento {
                        id: 12,
                        nombre: 'Estiramiento Muscular en Trelew',
                        fechaHora: datetime('2025-10-11T10:30:00'),
                        ubicacion: 'Domo en el doradillo',
                        descripcion: 'Clase abierta de esitramiento, ideal para aprender!',
                        cantidadMaximaParticipantes: 20,
                        fechaDeCreacion: date('2024-09-25'),
                        esPrivadoParaLaComunidad: false ,
                        latitud: -43.25504588141385,
                        longitud: -65.30790438418944
                        }),
                        (evento13:Evento {
                          id: 13,
                          nombre: 'Vuelta ballena en Sarmiento',
                          fechaHora: datetime('2025-09-22T10:30:00'),
                          ubicacion: 'Rayentray',
                          descripcion: 'Carrera de ciclismo',
                          cantidadMaximaParticipantes: 100,
                          fechaDeCreacion: date('2024-09-01'),
                          esPrivadoParaLaComunidad: false ,
                          latitud: -45.58608687340768,
                          longitud: -69.06518122442799
                          }),
                          (evento14:Evento {
                            id: 14,
                            nombre: 'Ciclismo en Comodoro',
                            fechaHora: datetime('2025-09-30T10:30:00'),
                            ubicacion: 'Sara',
                            descripcion: 'Ciclismo amistoso',
                            cantidadMaximaParticipantes: 30,
                            fechaDeCreacion: date('2024-09-01'),
                            esPrivadoParaLaComunidad: false ,
                            latitud: -45.87049255594576,
                            longitud: -67.54110579041235
                            }),
                            (evento15:Evento {
                              id: 15,
                              nombre: 'Badmington en Viedma',
                              fechaHora: datetime('2024-08-30T10:30:00'),
                              ubicacion: 'Sara',
                              descripcion: 'Evento pasado',
                              cantidadMaximaParticipantes: 30,
                              fechaDeCreacion: date('2024-08-01'),
                              esPrivadoParaLaComunidad: false ,
                              latitud: -40.81657277607133,
                              longitud: -63.01044036933311
                              })
                              
                              CREATE
                              (atletismo:Etiqueta{ id:1, nombre: 'Atletismo' }),
                              (futbol:Etiqueta{ id:2, nombre: 'Futbol' }),
                              (natacion:Etiqueta{ id:3, nombre: 'Natacion' }),
                              (pilates:Etiqueta { id: 4, nombre: 'Pilates' }),
                              (basquet:Etiqueta { id: 5, nombre: 'Básquet' }),
                              (tenis:Etiqueta { id: 6, nombre: 'Tenis' }),
                              (yoga:Etiqueta { id: 7, nombre: 'Yoga' }),
                              (ciclismo:Etiqueta { id: 8, nombre: 'Ciclismo' }),
                              (casual:Etiqueta { id: 9, nombre: 'Casual' }),
                              (futbol5:Etiqueta { id: 10, nombre: 'Futbol 5' }),
                              (badmington:Etiqueta { id: 11, nombre: 'Badmington' })
                              
                              CREATE
                              (lucas:Usuario { nombreUsuario: 'lucas', nombreReal: 'Lucas', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (juan:Usuario { nombreUsuario: 'juan', nombreReal: 'Juan', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (marcos:Usuario { nombreUsuario: 'marcos', nombreReal: 'Marcos', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (joaquin:Usuario { nombreUsuario: 'joaquin', nombreReal: 'Joaquin', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (pedro:Usuario { nombreUsuario: 'pedro', nombreReal: 'Pedro', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (patricia:Usuario { nombreUsuario: 'patricia', nombreReal: 'Patricia', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (martin:Usuario { nombreUsuario: 'martin', nombreReal: 'Martín', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (diego:Usuario { nombreUsuario: 'diego', nombreReal: 'Diego', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (ana:Usuario { nombreUsuario: 'ana', nombreReal: 'Ana', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (eric:Usuario { nombreUsuario: 'eric', nombreReal: 'Eric', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (lucia:Usuario { nombreUsuario: 'lucia', nombreReal: 'Lucia', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (hector:Usuario { nombreUsuario: 'hector', nombreReal: 'Hector', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (olga:Usuario { nombreUsuario: 'olga', nombreReal: 'Olga', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (maria:Usuario { nombreUsuario: 'maria', nombreReal: 'Maria', latitud: -42.762555975850084,
                              longitud: -65.04467329781565 }),
                              (marta:Usuario { nombreUsuario: 'marta', nombreReal: 'Marta' , latitud: -42.762555975850084,
                              longitud: -65.04467329781565})
                              
                              MERGE (evento1)-[:ETIQUETADO_CON]->(futbol)
                              MERGE (evento1)-[:ETIQUETADO_CON]->(futbol5)
                              MERGE (evento2)-[:ETIQUETADO_CON]->(atletismo)
                              MERGE (evento3)-[:ETIQUETADO_CON]->(natacion)
                              MERGE (evento4)-[:ETIQUETADO_CON]->(natacion)
                              MERGE (evento5)-[:ETIQUETADO_CON]->(basquet)
                              MERGE (evento6)-[:ETIQUETADO_CON]->(atletismo)
                              MERGE (evento7)-[:ETIQUETADO_CON]->(yoga)
                              MERGE (evento8)-[:ETIQUETADO_CON]->(casual)
                              MERGE (evento8)-[:ETIQUETADO_CON]->(pilates)
                              MERGE (evento9)-[:ETIQUETADO_CON]->(tenis)
                              MERGE (evento10)-[:ETIQUETADO_CON]->(atletismo)
                              MERGE (evento11)-[:ETIQUETADO_CON]->(futbol)
                              MERGE (evento12)-[:ETIQUETADO_CON]->(casual)
                              MERGE (evento12)-[:ETIQUETADO_CON]->(pilates)
                              MERGE (evento13)-[:ETIQUETADO_CON]->(ciclismo)
                              
                              MERGE (evento14)-[:ETIQUETADO_CON]->(ciclismo)
                              MERGE (evento15)-[:ETIQUETADO_CON]->(badmington)
                              
                              MERGE (lucas)-[:PARTICIPA_EN]->(evento1)
                              MERGE (lucas)-[:PARTICIPA_EN]->(evento11)
                              MERGE (diego)-[:PARTICIPA_EN]->(evento11)
                              MERGE (ana)-[:PARTICIPA_EN]->(evento7)
                              MERGE (joaquin)-[:PARTICIPA_EN]->(evento6)
                              MERGE (martin)-[:PARTICIPA_EN]->(evento5)
                              MERGE (patricia)-[:PARTICIPA_EN]->(evento4)
                              MERGE (marcos)-[:PARTICIPA_EN]->(evento6)
                              MERGE (maria)-[:PARTICIPA_EN]->(evento15)
                              
                              MERGE (lucas)-[:ES_AMIGO_DE]->(diego)
                              MERGE (diego)-[:ES_AMIGO_DE]->(lucas)
                              MERGE (ana)-[:ES_AMIGO_DE]->(juan)
                              MERGE (juan)-[:ES_AMIGO_DE]->(ana)
                              
                              MERGE (maria)-[:ES_AMIGO_DE]->(marta)
                              MERGE (marta)-[:ES_AMIGO_DE]->(maria)
                              
                              MERGE (patricia)-[:ES_AMIGO_DE]->(martin)
                              MERGE (martin)-[:ES_AMIGO_DE]->(patricia)
                              
                              MERGE (joaquin)-[:ES_AMIGO_DE]->(pedro)
                              MERGE (pedro)-[:ES_AMIGO_DE]->(joaquin)
                              MERGE (joaquin)-[:ES_AMIGO_DE]->(marcos)
                              MERGE (marcos)-[:ES_AMIGO_DE]->(joaquin)
                              MERGE (marcos)-[:ES_AMIGO_DE]->(pedro)
                              MERGE (pedro)-[:ES_AMIGO_DE]->(marcos)
                              
                              MERGE (eric)-[:ES_AMIGO_DE]->(lucia)
                              MERGE (lucia)-[:ES_AMIGO_DE]->(eric)
                              
                              MERGE (olga)-[:ES_AMIGO_DE]->(hector)
                              MERGE (hector)-[:ES_AMIGO_DE]->(olga)
                              MERGE (olga)-[:PARTICIPA_EN]->(evento14)
                              
                              MERGE (eric)-[:PARTICIPA_EN]->(evento4)
                              MERGE (eric)-[:PARTICIPA_EN]->(evento12)
                              
                              MERGE (evento9)-[:CREADO_POR]->(marcos)
                              MERGE (evento13)-[:CREADO_POR]->(hector)
