// RecomendacionesRutinasBasadosEnEventos
MATCH (n) DETACH DELETE n;

CREATE
(evento1:Evento {
  id: 1,
  nombre: 'Torneo de Fútbol 5',
  fechaHora: datetime('2024-09-20T18:00:00'),
  ubicacion: 'Cancha Los Olivos',
  descripcion: 'Un torneo de fútbol 5 entre amigos.',
  cantidadMaximaParticipantes: 10,
  fechaDeCreacion: date('2024-09-15')
  }),
  (evento2:Evento {
    id: 2,
    nombre: 'Carrera de 10K',
    fechaHora: datetime('2024-09-25T07:00:00'),
    ubicacion: 'Parque de la Ciudad',
    descripcion: 'Carrera de 10 kilómetros en el parque.',
    cantidadMaximaParticipantes: 50,
    fechaDeCreacion: date('2024-09-15')
    }),
    (evento3:Evento {
      id: 3,
      nombre: 'Torneo natacion 100M',
      fechaHora: datetime('2024-09-28T15:00:00'),
      ubicacion: 'Club ferro',
      descripcion: '100M libre',
      cantidadMaximaParticipantes: 20,
      fechaDeCreacion: date('2024-09-15')
      }),
      (evento4:Evento {
        id: 4,
        nombre: 'Torneo natacion 200M ',
        fechaHora: datetime('2024-09-28T15:30:00'),
        ubicacion: 'Club ferro',
        descripcion: '200M combinados',
        cantidadMaximaParticipantes: 20,
        fechaDeCreacion: date('2024-09-15')
        }),
        (evento5:Evento {
          id: 5,
          nombre: 'Torneo de Básquet',
          fechaHora: datetime('2024-09-22T10:00:00'),
          ubicacion: 'Polideportivo Central',
          descripcion: 'Torneo amistoso de básquet.',
          cantidadMaximaParticipantes: 12,
          fechaDeCreacion: date('2024-09-16')
          }),
          (evento6:Evento {
            id: 6,
            nombre: 'Carrera de 5K',
            fechaHora: datetime('2024-09-26T08:00:00'),
            ubicacion: 'Parque Central',
            descripcion: 'Carrera de 5 kilómetros.',
            cantidadMaximaParticipantes: 30,
            fechaDeCreacion: date('2024-09-16')
            }),
            (evento7:Evento {
              id: 7,
              nombre: 'Clase de Yoga',
              fechaHora: datetime('2024-09-24T09:00:00'),
              ubicacion: 'Parque de la Costa',
              descripcion: 'Clase de yoga para principiantes.',
              cantidadMaximaParticipantes: 15,
              fechaDeCreacion: date('2024-09-17')
              }),
              (evento8:Evento {
                id: 8,
                nombre: 'Clase abierta de pilates',
                fechaHora: datetime('2024-09-21T10:00:00'),
                ubicacion: 'Parador 9',
                descripcion: 'Pilates',
                cantidadMaximaParticipantes: 10,
                fechaDeCreacion: date('2024-09-17')
                }),
                (evento9:Evento {
                  id: 9,
                  nombre: 'Torneo de Tenis',
                  fechaHora: datetime('2024-09-29T09:00:00'),
                  ubicacion: 'Cancha del Club',
                  descripcion: 'Torneo individual de tenis.',
                  cantidadMaximaParticipantes: 16,
                  fechaDeCreacion: date('2024-09-18')
                  }),
                  (evento10:Evento {
                    id: 10,
                    nombre: 'Carrera de Montaña 15K',
                    fechaHora: datetime('2024-10-01T07:30:00'),
                    ubicacion: 'Montañas de la Ciudad',
                    descripcion: 'Carrera de montaña con un recorrido de 15 kilómetros.',
                    cantidadMaximaParticipantes: 30,
                    fechaDeCreacion: date('2024-09-18')
                    }),
                  (evento11:Evento {
                    id: 11,
                    nombre: 'Futbol 11',
                    fechaHora: datetime('2024-10-01T22:30:00'),
                    ubicacion: 'El doradillo',
                    descripcion: 'Partido de futbol 11.',
                    cantidadMaximaParticipantes: 25,
                    fechaDeCreacion: date('2024-09-25')
                    })



// Crear rutinas
CREATE (rutina1:Rutina { id: 2711, nombre: 'Cardio para principiantes', descripcion: 'Rutina de cardio para principiantes.', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE' }),
(rutina2:Rutina { id: 2712, nombre: 'Yoga y meditación', descripcion: 'Rutina de yoga y meditación para relajarse.', duracionMinutosPorDia: 30, dificultad: 'PRINCIPIANTE' }),
(rutina3:Rutina { id: 2713, nombre: 'Fuerza avanzada', descripcion: 'Rutina avanzada de fuerza y resistencia.', duracionMinutosPorDia: 50, dificultad: 'AVANZADO' }),
(rutina4:Rutina { id: 2714, nombre: 'Cardio avanzado con fuerza', descripcion: 'Rutina combinada de cardio y fuerza.', duracionMinutosPorDia: 45, dificultad: 'INTERMEDIO' }),
(rutina5:Rutina { id: 2715, nombre: 'Entrenamiento funcional', descripcion: 'Rutina de entrenamiento funcional.', duracionMinutosPorDia: 35, dificultad: 'INTERMEDIO' }),
(rutina6:Rutina { id: 2716, nombre: 'Fuerza básica', descripcion: 'Rutina de fuerza para principiantes.', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE' })


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
(carlos:Usuario { nombreUsuario: 'carlos', nombreReal: 'Carlos' })

CREATE (lucas)-[:PARTICIPA_EN]->(evento1)
CREATE (lucas)-[:PARTICIPA_EN]->(evento2)
CREATE (lucas)-[:PARTICIPA_EN]->(evento3)
CREATE (pedro)-[:PARTICIPA_EN]->(evento2)
CREATE (ana)-[:PARTICIPA_EN]->(evento1)
CREATE (ana)-[:PARTICIPA_EN]->(evento2)
CREATE (lucas)-[:REALIZA_RUTINA]->(rutina1)
CREATE (lucas)-[:REALIZA_RUTINA]->(rutina3)
CREATE (ana)-[:REALIZA_RUTINA]->(rutina5)
CREATE (pedro)-[:REALIZA_RUTINA]->(rutina1)

//una sola recomendaion
CREATE (diego)-[:PARTICIPA_EN]->(evento6)
CREATE (diego)-[:REALIZA_RUTINA]->(rutina4)
CREATE (juan)-[:PARTICIPA_EN]->(evento6)
CREATE (juan)-[:REALIZA_RUTINA]->(rutina6)


CREATE (marcos)-[:PARTICIPA_EN]->(evento5)
CREATE (marcos)-[:PARTICIPA_EN]->(evento7)



//usuario que no participe en evento carlos

//usuario que participe solo en un evento
CREATE (joaquin)-[:PARTICIPA_EN]->(evento8)



CREATE (patricia)-[:PARTICIPA_EN]->(evento10)
CREATE (martin)-[:PARTICIPA_EN]->(evento11)



CREATE (marcos)-[:REALIZA_RUTINA]->(rutina2)
CREATE (joaquin)-[:REALIZA_RUTINA]->(rutina5)
CREATE (patricia)-[:REALIZA_RUTINA]->(rutina3)
CREATE (martin)-[:REALIZA_RUTINA]->(rutina4)
