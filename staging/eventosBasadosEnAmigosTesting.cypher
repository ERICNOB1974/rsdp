//RecomendacionesEventosBasadosEnComunidades
MATCH (n)
DETACH DELETE n;

CREATE
(evento1:Evento {
  id: 1,
  nombre: 'Torneo de Fútbol 5',
  fechaHora: datetime('2024-09-20T18:00:00'),
  ubicacion: 'Cancha Los Olivos',
  descripcion: 'Un torneo de fútbol 5 entre amigos.',
  cantidadMaximaParticipantes: 10,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false
  }),
  (evento2:Evento {
    id: 2,
    nombre: 'Carrera de 10K',
    fechaHora: datetime('2024-09-25T07:00:00'),
    ubicacion: 'Parque de la Ciudad',
    descripcion: 'Carrera de 10 kilómetros en el parque.',
    cantidadMaximaParticipantes: 50,
    fechaDeCreacion: date('2024-09-15'),
    esPrivadoParaLaComunidad: false
    }),
    (evento3:Evento {
      id: 3,
      nombre: 'Torneo natacion 100M',
      fechaHora: datetime('2024-09-28T15:00:00'),
      ubicacion: 'Club ferro',
      descripcion: '100M libre',
      cantidadMaximaParticipantes: 20,
      fechaDeCreacion: date('2024-09-15'),
    esPrivadoParaLaComunidad: false
      }),
      (evento4:Evento {
        id: 4,
        nombre: 'Torneo natacion 200M ',
        fechaHora: datetime('2024-09-28T15:30:00'),
        ubicacion: 'Club ferro',
        descripcion: '200M combinados',
        cantidadMaximaParticipantes: 20,
        fechaDeCreacion: date('2024-09-15'),
        esPrivadoParaLaComunidad: false
        }),
        (evento5:Evento {
          id: 5,
          nombre: 'Torneo de Básquet',
          fechaHora: datetime('2024-09-22T10:00:00'),
          ubicacion: 'Polideportivo Central',
          descripcion: 'Torneo amistoso de básquet.',
          cantidadMaximaParticipantes: 12,
          fechaDeCreacion: date('2024-09-16'),
            esPrivadoParaLaComunidad: false
          }),
          (evento6:Evento {
            id: 6,
            nombre: 'Carrera de 5K',
            fechaHora: datetime('2024-09-26T08:00:00'),
            ubicacion: 'Parque Central',
            descripcion: 'Carrera de 5 kilómetros.',
            cantidadMaximaParticipantes: 30,
            fechaDeCreacion: date('2024-09-16'),
            esPrivadoParaLaComunidad: false
            }),
            (evento7:Evento {
              id: 7,
              nombre: 'Clase de Yoga',
              fechaHora: datetime('2024-09-24T09:00:00'),
              ubicacion: 'Parque de la Costa',
              descripcion: 'Clase de yoga para principiantes.',
              cantidadMaximaParticipantes: 15,
              fechaDeCreacion: date('2024-09-17'),
            esPrivadoParaLaComunidad: false
              }),
              (evento8:Evento {
                id: 8,
                nombre: 'Clase abierta de pilates',
                fechaHora: datetime('2024-09-21T10:00:00'),
                ubicacion: 'Parador 9',
                descripcion: 'Pilates',
                cantidadMaximaParticipantes: 10,
                fechaDeCreacion: date('2024-09-17'),
                esPrivadoParaLaComunidad: false
                }),
                (evento9:Evento {
                  id: 9,
                  nombre: 'Torneo de Tenis',
                  fechaHora: datetime('2024-09-29T09:00:00'),
                  ubicacion: 'Cancha del Club',
                  descripcion: 'Torneo individual de tenis.',
                  cantidadMaximaParticipantes: 16,
                  fechaDeCreacion: date('2024-09-18'),
                  esPrivadoParaLaComunidad: false
                  }),
                  (evento10:Evento {
                    id: 10,
                    nombre: 'Carrera de Montaña 15K',
                    fechaHora: datetime('2024-10-01T07:30:00'),
                    ubicacion: 'Montañas de la Ciudad',
                    descripcion: 'Carrera de montaña con un recorrido de 15 kilómetros.',
                    cantidadMaximaParticipantes: 30,
                    fechaDeCreacion: date('2024-09-18'),
                    esPrivadoParaLaComunidad: false
                    }),
                  (evento11:Evento {
                    id: 11,
                    nombre: 'Futbol 11',
                    fechaHora: datetime('2024-10-01T22:30:00'),
                    ubicacion: 'El doradillo',
                    descripcion: 'Partido de futbol 11.',
                    cantidadMaximaParticipantes: 25,
                    fechaDeCreacion: date('2024-09-25'),
                    esPrivadoParaLaComunidad: false
                    }),
                     (evento12:Evento {
                    id: 12,
                    nombre: 'Estiramiento Muscular',
                    fechaHora: datetime('2024-10-11T10:30:00'),
                    ubicacion: 'Domo en el doradillo',
                    descripcion: 'Clase abierta de esitramiento, ideal para aprender!',
                    cantidadMaximaParticipantes: 20,
                    fechaDeCreacion: date('2024-09-25'),
                    esPrivadoParaLaComunidad: false
                    }),
                     (evento13:Evento {
                    id: 13,
                    nombre: 'Vuelta ballena',
                    fechaHora: datetime('2024-09-22T10:30:00'),
                    ubicacion: 'Rayentray',
                    descripcion: 'Carrera de ciclismo',
                    cantidadMaximaParticipantes: 100,
                    fechaDeCreacion: date('2024-09-01'),
                    esPrivadoParaLaComunidad: false
                    }),
                     (evento14:Evento {
                    id: 14,
                    nombre: 'Ciclismo en la rambla',
                    fechaHora: datetime('2024-09-30T10:30:00'),
                    ubicacion: 'Sara',
                    descripcion: 'Ciclismo amistoso',
                    cantidadMaximaParticipantes: 30,
                    fechaDeCreacion: date('2024-09-01'),
                    esPrivadoParaLaComunidad: false
                    })
                    
CREATE 
(atletismo:Etiqueta{id:1,nombre: 'Atletismo'}),
(futbol:Etiqueta{id:2, nombre: 'Futbol'}),
(natacion:Etiqueta{ id:3, nombre: 'Natacion'}), 
(pilates:Etiqueta { id: 4, nombre: 'Pilates' }),
(basquet:Etiqueta { id: 5, nombre: 'Básquet' }),
(tenis:Etiqueta { id: 6, nombre: 'Tenis' }),
(yoga:Etiqueta { id: 7, nombre: 'Yoga' }),
(ciclismo:Etiqueta { id: 8, nombre: 'Ciclismo' }),
(casual:Etiqueta { id: 9, nombre: 'Casual' }),
(futbol5:Etiqueta { id: 10, nombre: 'Futbol 5' })


CREATE 
(lucas:Usuario { nombreUsuario: 'lucas', nombreReal: 'Lucas' }),
(juan:Usuario { nombreUsuario: 'juan', nombreReal: 'Juan' }),
(marcos:Usuario { nombreUsuario: 'marcos', nombreReal: 'Marcos' }),
(joaquin:Usuario { nombreUsuario: 'joaquin', nombreReal: 'Joaquin' }),
(pedro:Usuario { nombreUsuario: 'pedro', nombreReal: 'Pedro' }),
(patricia:Usuario { nombreUsuario: 'patricia', nombreReal: 'Patricia' }),
(martin:Usuario { nombreUsuario: 'martin', nombreReal: 'Martín' }),
(diego:Usuario { nombreUsuario: 'diego', nombreReal: 'Diego' }),
(ana:Usuario { nombreUsuario: 'ana', nombreReal: 'Ana' }),
(eric:Usuario { nombreUsuario: 'eric', nombreReal: 'Eric' }),
(lucia:Usuario { nombreUsuario: 'lucia', nombreReal: 'Lucia' }),
(hector:Usuario { nombreUsuario: 'hector', nombreReal: 'Hector' }),
(olga:Usuario { nombreUsuario: 'olga', nombreReal: 'Olga' })

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


MERGE (lucas)-[:PARTICIPA_EN]->(evento1)
MERGE (lucas)-[:PARTICIPA_EN]->(evento11)
MERGE (diego)-[:PARTICIPA_EN]->(evento11)
MERGE (ana)-[:PARTICIPA_EN]->(evento7)
MERGE (joaquin)-[:PARTICIPA_EN]->(evento6)
MERGE (martin)-[:PARTICIPA_EN]->(evento5)
MERGE (patricia)-[:PARTICIPA_EN]->(evento4)
MERGE (marcos)-[:PARTICIPA_EN]->(evento6)


MERGE (lucas)-[:ES_AMIGO_DE]->(diego)
MERGE (diego)-[:ES_AMIGO_DE]->(lucas)
MERGE (ana)-[:ES_AMIGO_DE]->(juan)
MERGE (juan)-[:ES_AMIGO_DE]->(ana)


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
    