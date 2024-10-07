//RecomendacionesEventosBasadosEnComunidades
MATCH (n)
DETACH DELETE n;

CREATE
(evento1:Evento {
  id: 1,
  nombre: 'Torneo de Fútbol 5 en Trelew',
  fechaHora: datetime('2025-09-20T18:00:00'),
  descripcion: 'Un torneo de fútbol 5 entre amigos.',
  cantidadMaximaParticipantes: 10,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false,
  latitud: -43.25456793905463,
  longitud: -65.30652780881938
}),
(evento2:Evento {
  id: 2,
  nombre: 'Carrera de 10K en Comodoro',
  fechaHora: datetime('2025-09-25T07:00:00'),
  descripcion: 'Carrera de 10 kilómetros en el parque.',
  cantidadMaximaParticipantes: 50,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false,
  latitud: -45.838061022086976,
  longitud: -67.49405805975792
}),
(evento3:Evento {
  id: 3,
  nombre: 'Torneo natacion 100M en CABA',
  fechaHora: datetime('2025-09-28T15:00:00'),
  descripcion: '100M libre',
  cantidadMaximaParticipantes: 20,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false,
  latitud: -34.605906167370584,
  longitud: -58.421286244002474
}),
(evento4:Evento {
  id: 4,
  nombre: 'Torneo natacion 200M en Bahia Blanca',
  fechaHora: datetime('2025-09-28T15:30:00'),
  descripcion: '200M combinados',
  cantidadMaximaParticipantes: 20,
  fechaDeCreacion: date('2024-09-15'),
  esPrivadoParaLaComunidad: false,
  latitud: -38.70688604597644,
  longitud: -62.261285196916916
}),
(evento5:Evento {
  id: 5,
  nombre: 'Torneo de Básquet en Posadas',
  fechaHora: datetime('2025-09-22T10:00:00'),
  descripcion: 'Torneo amistoso de básquet.',
  cantidadMaximaParticipantes: 12,
  fechaDeCreacion: date('2024-09-16'),
  esPrivadoParaLaComunidad: false,
  latitud: -27.389749552546853,
  longitud: -55.92589020428568
}),
(evento6:Evento {
  id: 6,
  nombre: 'Carrera de 5K en Madryn',
  fechaHora: datetime('2025-09-26T08:00:00'),
  descripcion: 'Carrera de 5 kilómetros.',
  cantidadMaximaParticipantes: 30,
  fechaDeCreacion: date('2024-09-16'),
  esPrivadoParaLaComunidad: false,
  latitud: -42.761328851689385,
  longitud: -65.04370337286537
}),
(evento7:Evento {
  id: 7,
  nombre: 'Clase de Yoga en Rosario',
  fechaHora: datetime('2025-09-24T09:00:00'),
  descripcion: 'Clase de yoga para principiantes.',
  cantidadMaximaParticipantes: 15,
  fechaDeCreacion: date('2024-09-17'),
  esPrivadoParaLaComunidad: false,
  latitud: -32.952758313618176,
  longitud: -60.687030644588646
}),
(evento8:Evento {
  id: 8,
  nombre: 'Clase abierta de pilates en La Quiaca',
  fechaHora: datetime('2025-09-21T10:00:00'),
  descripcion: 'Pilates',
  cantidadMaximaParticipantes: 10,
  fechaDeCreacion: date('2024-09-17'),
  esPrivadoParaLaComunidad: false,
  latitud: -22.106729699062793,
  longitud: -65.5988932108674
}),
(evento9:Evento {
  id: 9,
  nombre: 'Torneo de Tenis en Bariloche',
  fechaHora: datetime('2025-09-29T09:00:00'),
  descripcion: 'Torneo individual de tenis.',
  cantidadMaximaParticipantes: 16,
  fechaDeCreacion: date('2024-09-18'),
  esPrivadoParaLaComunidad: false,
  latitud: -41.14244285275629,
  longitud: -71.30452441773161
}),
(evento10:Evento {
  id: 10,
  nombre: 'Carrera de Montaña 15K en Gan gan',
  fechaHora: datetime('2025-10-01T07:30:00'),
  descripcion: 'Carrera de montaña con un recorrido de 15 kilómetros.',
  cantidadMaximaParticipantes: 30,
  fechaDeCreacion: date('2024-09-18'),
  esPrivadoParaLaComunidad: false,
  latitud: -42.52290555141708,
  longitud: -68.28504372909048
}),
(evento11:Evento {
  id: 11,
  nombre: 'Futbol 11 en Sarmiento',
  fechaHora: datetime('2025-10-01T22:30:00'),
  descripcion: 'Partido de futbol 11.',
  cantidadMaximaParticipantes: 25,
  fechaDeCreacion: date('2024-09-25'),
  esPrivadoParaLaComunidad: false,
  latitud: -45.587654151798596,
  longitud: -69.06492294137121
}),
(evento12:Evento {
  id: 12,
  nombre: 'Badmington en Piramides',
  fechaHora: datetime('2023-10-01T22:30:00'),
  descripcion: 'Evento pasado',
  cantidadMaximaParticipantes: 25,
  fechaDeCreacion: date('2023-09-25'),
  esPrivadoParaLaComunidad: false,
  latitud: -42.57025037592773, 
  longitud: -64.27793283786775
})

CREATE
(comu1:Comunidad { nombre: 'Comunidad atletismo', descripcion: 'Comunidad para atletas'}),
(comu2:Comunidad { nombre: 'Comunidad futbol', descripcion: 'Comunidad para futbolistas'}),
(comu3:Comunidad { nombre: 'Comunidad natacion', descripcion: 'Comunidad para nadadores'}),
(comu4:Comunidad { nombre: 'Comunidad yoga', descripcion: 'Comunidad para amantes del yoga'}),
(comu5:Comunidad { nombre: 'Comunidad pilates', descripcion: 'Comunidad para pilates'}),
(comu6:Comunidad { nombre: 'Comunidad tenis', descripcion: 'Comunidad para jugadores de tenis'}),
(comu7:Comunidad { nombre: 'Comunidad badmington', descripcion: 'Comunidad para badmington'})
      
CREATE 
(piernas:Etiqueta{id:1,nombre: 'Piernas'}),
(explosion:Etiqueta{id:2, nombre: 'Explosión'}),
(torsoSuperior:Etiqueta{ id:3, nombre: 'Torso superior'}), 
(quemarGrasa:Etiqueta { id: 4, nombre: 'Quemar grasa' }),
(aireLibre:Etiqueta { id: 5, nombre: 'Aire libre' }),
(recreativo:Etiqueta { id: 6, nombre: 'Recreativo' }),
(cuadriceps:Etiqueta { id: 7, nombre: 'Cuadriceps' }),
(cuerpoCompleto:Etiqueta { id: 8, nombre: 'Cuerpo completo' }),
(casual:Etiqueta { id: 9, nombre: 'Casual' }),
(estiramiento:Etiqueta { id: 10, nombre: 'Estiramiento' }),
(flexibilidad:Etiqueta { id: 11, nombre: 'Flexibilidad' })


CREATE 
(lucas:Usuario { nombreUsuario: 'lucasMadryn', nombreReal: 'Lucas San Martin', latitud: -42.76180256130219, longitud: -65.04116389846054 }),
(facu:Usuario { nombreUsuario: 'facuMadryn', nombreReal: 'Facundo Espanol', latitud: -42.76180256130219, longitud: -65.04116389846054 })


MERGE (comu1)-[:ETIQUETADA_CON]->(piernas)
MERGE (comu1)-[:ETIQUETADA_CON]->(explosion)
MERGE (comu1)-[:ETIQUETADA_CON]->(torsoSuperior)
MERGE (comu1)-[:ETIQUETADA_CON]->(quemarGrasa)
MERGE (comu1)-[:ETIQUETADA_CON]->(aireLibre)
MERGE (comu1)-[:ETIQUETADA_CON]->(recreativo)
MERGE (comu1)-[:ETIQUETADA_CON]->(cuadriceps)
MERGE (comu1)-[:ETIQUETADA_CON]->(cuerpoCompleto)
MERGE (comu1)-[:ETIQUETADA_CON]->(casual)
MERGE (comu1)-[:ETIQUETADA_CON]->(estiramiento)
MERGE (comu1)-[:ETIQUETADA_CON]->(flexibilidad)

MERGE (evento1)-[:ETIQUETADO_CON]->(piernas)
MERGE (evento1)-[:ETIQUETADO_CON]->(explosion)
MERGE (evento1)-[:ETIQUETADO_CON]->(torsoSuperior)

MERGE (evento2)-[:ETIQUETADO_CON]->(torsoSuperior)
MERGE (evento2)-[:ETIQUETADO_CON]->(quemarGrasa)
MERGE (evento2)-[:ETIQUETADO_CON]->(aireLibre)
MERGE (evento2)-[:ETIQUETADO_CON]->(recreativo)
MERGE (evento2)-[:ETIQUETADO_CON]->(cuadriceps)
MERGE (evento2)-[:ETIQUETADO_CON]->(cuerpoCompleto)
MERGE (evento2)-[:ETIQUETADO_CON]->(casual)
MERGE (evento2)-[:ETIQUETADO_CON]->(estiramiento)
MERGE (evento2)-[:ETIQUETADO_CON]->(flexibilidad)

MERGE (evento3)-[:ETIQUETADO_CON]->(torsoSuperior)
MERGE (evento3)-[:ETIQUETADO_CON]->(quemarGrasa)
MERGE (evento3)-[:ETIQUETADO_CON]->(aireLibre)
MERGE (evento3)-[:ETIQUETADO_CON]->(recreativo)
MERGE (evento3)-[:ETIQUETADO_CON]->(cuadriceps)
MERGE (evento3)-[:ETIQUETADO_CON]->(cuerpoCompleto)
MERGE (evento3)-[:ETIQUETADO_CON]->(casual)
MERGE (evento3)-[:ETIQUETADO_CON]->(estiramiento)

MERGE (lucas)-[:MIEMBRO]->(comu1)

CREATE 
(piernas1:Etiqueta{id:11,nombre: 'Piernas'}),
(explosion1:Etiqueta{id:12, nombre: 'Explosión'}),
(torsoSuperior1:Etiqueta{ id:13, nombre: 'Torso superior'}), 
(quemarGrasa1:Etiqueta { id: 14, nombre: 'Quemar grasa' }),
(aireLibre1:Etiqueta { id: 15, nombre: 'Aire libre' }),
(recreativo1:Etiqueta { id: 16, nombre: 'Recreativo' }),
(cuadriceps1:Etiqueta { id: 17, nombre: 'Cuadriceps' }),
(cuerpoCompleto1:Etiqueta { id: 18, nombre: 'Cuerpo completo' }),
(casual1:Etiqueta { id: 19, nombre: 'Casual' }),
(estiramiento1:Etiqueta { id: 20, nombre: 'Estiramiento' }),
(flexibilidad1:Etiqueta { id: 21, nombre: 'Flexibilidad' })

MERGE (comu2)-[:ETIQUETADA_CON]->(piernas1)
MERGE (comu2)-[:ETIQUETADA_CON]->(explosion1)
MERGE (comu2)-[:ETIQUETADA_CON]->(torsoSuperior1)
MERGE (comu2)-[:ETIQUETADA_CON]->(quemarGrasa1)
MERGE (comu2)-[:ETIQUETADA_CON]->(aireLibre1)
MERGE (comu2)-[:ETIQUETADA_CON]->(recreativo1)
MERGE (comu2)-[:ETIQUETADA_CON]->(cuadriceps1)
MERGE (comu2)-[:ETIQUETADA_CON]->(cuerpoCompleto1)
MERGE (comu2)-[:ETIQUETADA_CON]->(casual1)
MERGE (comu2)-[:ETIQUETADA_CON]->(estiramiento1)
MERGE (comu2)-[:ETIQUETADA_CON]->(flexibilidad1)

MERGE (evento4)-[:ETIQUETADO_CON]->(piernas1)
MERGE (evento4)-[:ETIQUETADO_CON]->(explosion1)
MERGE (evento4)-[:ETIQUETADO_CON]->(torsoSuperior1)
MERGE (evento4)-[:ETIQUETADO_CON]->(quemarGrasa1)
MERGE (evento4)-[:ETIQUETADO_CON]->(aireLibre1)
MERGE (evento4)-[:ETIQUETADO_CON]->(recreativo1)
MERGE (evento4)-[:ETIQUETADO_CON]->(cuadriceps1)
MERGE (evento4)-[:ETIQUETADO_CON]->(cuerpoCompleto1)

MERGE (evento5)-[:ETIQUETADO_CON]->(piernas1)
MERGE (evento5)-[:ETIQUETADO_CON]->(explosion1)
MERGE (evento5)-[:ETIQUETADO_CON]->(torsoSuperior1)
MERGE (evento5)-[:ETIQUETADO_CON]->(quemarGrasa1)
MERGE (evento5)-[:ETIQUETADO_CON]->(aireLibre1)
MERGE (evento5)-[:ETIQUETADO_CON]->(recreativo1)
MERGE (evento5)-[:ETIQUETADO_CON]->(cuadriceps1)
MERGE (evento5)-[:ETIQUETADO_CON]->(cuerpoCompleto1)
MERGE (evento5)-[:ETIQUETADO_CON]->(casual1)
MERGE (evento5)-[:ETIQUETADO_CON]->(estiramiento1)
MERGE (evento5)-[:ETIQUETADO_CON]->(flexibilidad1)

MERGE (evento6)-[:ETIQUETADO_CON]->(torsoSuperior1)
MERGE (evento6)-[:ETIQUETADO_CON]->(quemarGrasa1)
MERGE (evento6)-[:ETIQUETADO_CON]->(aireLibre1)
MERGE (evento6)-[:ETIQUETADO_CON]->(recreativo1)

MERGE (facu)-[:MIEMBRO]->(comu2)