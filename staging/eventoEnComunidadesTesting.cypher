//RecomendacionesEventosBasadosEnComunidades
MATCH (n)
DETACH DELETE n;

CREATE
(evento1:Evento {
  id: 1,
  nombre: 'Torneo de Fútbol 5',
  fechaHora: datetime('2025-09-20T18:00:00'),
  ubicacion: 'Buenos Aires',
  descripcion: 'Un torneo de fútbol 5 entre amigos.',
  cantidadMaximaParticipantes: 10,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false
}),
(evento2:Evento {
  id: 2,
  nombre: 'Carrera de 10K',
  fechaHora: datetime('2025-09-25T07:00:00'),
  ubicacion: 'Rosario, Santa Fe',
  descripcion: 'Carrera de 10 kilómetros en el parque.',
  cantidadMaximaParticipantes: 50,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false
}),
(evento3:Evento {
  id: 3,
  nombre: 'Torneo natacion 100M',
  fechaHora: datetime('2025-09-28T15:00:00'),
  ubicacion: 'Córdoba',
  descripcion: '100M libre',
  cantidadMaximaParticipantes: 20,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false
}),
(evento4:Evento {
  id: 4,
  nombre: 'Torneo natacion 200M',
  fechaHora: datetime('2025-09-28T15:30:00'),
  ubicacion: 'Córdoba',
  descripcion: '200M combinados',
  cantidadMaximaParticipantes: 20,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false
}),
(evento5:Evento {
  id: 5,
  nombre: 'Torneo de Básquet',
  fechaHora: datetime('2025-09-22T10:00:00'),
  ubicacion: 'Mar del Plata, Buenos Aires',
  descripcion: 'Torneo amistoso de básquet.',
  cantidadMaximaParticipantes: 12,
  fechaDeCreacion: date('2024-09-16'),
  esPrivadoParaLaComunidad: false
}),
(evento6:Evento {
  id: 6,
  nombre: 'Carrera de 5K',
  fechaHora: datetime('2025-09-26T08:00:00'),
  ubicacion: 'Mendoza',
  descripcion: 'Carrera de 5 kilómetros.',
  cantidadMaximaParticipantes: 30,
  fechaDeCreacion: date('2024-09-16'),
  esPrivadoParaLaComunidad: false
}),
(evento7:Evento {
  id: 7,
  nombre: 'Clase de Yoga',
  fechaHora: datetime('2025-09-24T09:00:00'),
  ubicacion: 'San Juan',
  descripcion: 'Clase de yoga para principiantes.',
  cantidadMaximaParticipantes: 15,
  fechaDeCreacion: date('2024-09-17'),
  esPrivadoParaLaComunidad: false
}),
(evento8:Evento {
  id: 8,
  nombre: 'Clase abierta de pilates',
  fechaHora: datetime('2025-09-21T10:00:00'),
  ubicacion: 'Bariloche, Río Negro',
  descripcion: 'Pilates',
  cantidadMaximaParticipantes: 10,
  fechaDeCreacion: date('2024-09-17'),
  esPrivadoParaLaComunidad: false
}),
(evento9:Evento {
  id: 9,
  nombre: 'Torneo de Tenis',
  fechaHora: datetime('2025-09-29T09:00:00'),
  ubicacion: 'Santa Fe',
  descripcion: 'Torneo individual de tenis.',
  cantidadMaximaParticipantes: 16,
  fechaDeCreacion: date('2024-09-18'),
  esPrivadoParaLaComunidad: false
}),
(evento10:Evento {
  id: 10,
  nombre: 'Carrera de Montaña 15K',
  fechaHora: datetime('2025-10-01T07:30:00'),
  ubicacion: 'San Carlos de Bariloche, Río Negro',
  descripcion: 'Carrera de montaña con un recorrido de 15 kilómetros.',
  cantidadMaximaParticipantes: 30,
  fechaDeCreacion: date('2024-09-18'),
  esPrivadoParaLaComunidad: false
}),
(evento11:Evento {
  id: 11,
  nombre: 'Futbol 11',
  fechaHora: datetime('2025-10-01T22:30:00'),
  ubicacion: 'Salta',
  descripcion: 'Partido de futbol 11.',
  cantidadMaximaParticipantes: 25,
  fechaDeCreacion: date('2024-09-25'),
  esPrivadoParaLaComunidad: false
}),
(evento12:Evento {
  id: 12,
  nombre: 'Badmington',
  fechaHora: datetime('2023-10-01T22:30:00'),
  ubicacion: 'Salta',
  descripcion: 'Evento pasado',
  cantidadMaximaParticipantes: 25,
  fechaDeCreacion: date('2023-09-25'),
  esPrivadoParaLaComunidad: false
})

CREATE
(comu1:Comunidad { nombre: 'Comunidad atletismo', descripcion: 'Comunidad para atletas', ubicacion: 'Buenos Aires' }),
(comu2:Comunidad { nombre: 'Comunidad futbol', descripcion: 'Comunidad para futbolistas', ubicacion: 'Rosario, Santa Fe' }),
(comu3:Comunidad { nombre: 'Comunidad natacion', descripcion: 'Comunidad para nadadores', ubicacion: 'Córdoba' }),
(comu4:Comunidad { nombre: 'Comunidad yoga', descripcion: 'Comunidad para amantes del yoga', ubicacion: 'Comodoro Rivadavia, Chubut' }),
(comu5:Comunidad { nombre: 'Comunidad pilates', descripcion: 'Comunidad para pilates', ubicacion: 'San Juan' }),
(comu6:Comunidad { nombre: 'Comunidad tenis', descripcion: 'Comunidad para jugadores de tenis', ubicacion: 'Santa Fe' }),
(comu7:Comunidad { nombre: 'Comunidad badmington', descripcion: 'Comunidad para badmington', ubicacion: 'Santa Fe' })
           
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
(futbol5:Etiqueta { id: 10, nombre: 'Futbol 5' }),
(badmington:Etiqueta { id: 11, nombre: 'Badmington' })


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
(maria:Usuario { nombreUsuario: 'maria', nombreReal: 'Maria' }),
(marta:Usuario { nombreUsuario: 'marta', nombreReal: 'Marta' })


MERGE (evento1)-[:ETIQUETADO_CON]->(futbol)
MERGE (evento1)-[:ETIQUETADO_CON]->(futbol5)
MERGE (evento2)-[:ETIQUETADO_CON]->(atletismo)
MERGE (evento3)-[:ETIQUETADO_CON]->(natacion)
MERGE (evento4)-[:ETIQUETADO_CON]->(natacion)
MERGE (evento5)-[:ETIQUETADO_CON]->(basquet)
MERGE (evento6)-[:ETIQUETADO_CON]->(atletismo)
MERGE (evento7)-[:ETIQUETADO_CON]->(yoga)
MERGE (evento8)-[:ETIQUETADO_CON]->(pilates)
MERGE (evento9)-[:ETIQUETADO_CON]->(tenis)
MERGE (evento10)-[:ETIQUETADO_CON]->(atletismo)
MERGE (evento11)-[:ETIQUETADO_CON]->(futbol)
MERGE (evento12)-[:ETIQUETADO_CON]->(badmington)


MERGE (comu1)-[:ETIQUETADA_CON]->(atletismo)

MERGE (comu2)-[:ETIQUETADA_CON]->(futbol)
MERGE (comu2)-[:ETIQUETADA_CON]->(futbol5)

MERGE (comu3)-[:ETIQUETADA_CON]->(natacion)


MERGE (comu4)-[:ETIQUETADA_CON]->(yoga)
MERGE (comu5)-[:ETIQUETADA_CON]->(yoga)
MERGE (comu5)-[:ETIQUETADA_CON]->(pilates)


MERGE (comu6)-[:ETIQUETADA_CON]->(tenis)

MERGE (diego)-[:MIEMBRO]->(comu1)
MERGE (ana)-[:MIEMBRO]->(comu2)
MERGE (lucas)-[:MIEMBRO]->(comu3)


MERGE (patricia)-[:MIEMBRO]->(comu4)
MERGE (patricia)-[:MIEMBRO]->(comu5)
MERGE (martin)-[:MIEMBRO]->(comu5)


MERGE (maria)-[:MIEMBRO]->(comu7)
MERGE (marta)-[:MIEMBRO]->(comu7)



MERGE (marcos)-[:MIEMBRO]->(comu6)
MERGE (martin)-[:PARTICIPA_EN]->(evento8)
MERGE (lucas)-[:PARTICIPA_EN]->(evento3)
MERGE (evento9)-[:CREADO_POR]->(marcos)
    
//lucas, ana, joaquin, diego, marcos
//comu3, comu2, comu1, comu6
