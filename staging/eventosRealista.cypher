// Crear eventos con fechaCreacion
CREATE 
(evento1:Evento {
    id: 1,
    nombre: 'Torneo de Fútbol 5',
    fechaHora: datetime('2024-09-20T18:00:00'),
    ubicacion: 'Cancha Los Olivos',
    descripcion: 'Un torneo de fútbol 5 entre amigos.',
    cantidadMaximaParticipantes: 10,
    fechaCreacion: date('2024-09-15')
}),
(evento2:Evento {
    id: 2,
    nombre: 'Carrera de 10K',
    fechaHora: datetime('2024-09-25T07:00:00'),
    ubicacion: 'Parque de la Ciudad',
    descripcion: 'Carrera de 10 kilómetros en el parque.',
    cantidadMaximaParticipantes: 50,
    fechaCreacion: date('2024-09-15')
}),
(evento3:Evento {
    id: 3,
    nombre: 'Torneo de Tenis',
    fechaHora: datetime('2024-10-10T09:00:00'),
    ubicacion: 'Club de Tenis Los Cedros',
    descripcion: 'Un torneo de tenis amateur.',
    cantidadMaximaParticipantes: 20,
    fechaCreacion: date('2024-09-15')
}),
(evento4:Evento {
    id: 4,
    nombre: 'Caminata por la Montaña',
    fechaHora: datetime('2024-10-15T08:00:00'),
    ubicacion: 'Sendero Las Cumbres',
    descripcion: 'Caminata recreativa en la montaña.',
    cantidadMaximaParticipantes: 30,
    fechaCreacion: date('2024-09-15')
}),
(evento5:Evento {
    id: 5,
    nombre: 'Clase de Yoga al Aire Libre',
    fechaHora: datetime('2024-10-20T17:00:00'),
    ubicacion: 'Plaza Central',
    descripcion: 'Clase de yoga para todos los niveles.',
    cantidadMaximaParticipantes: 20,
    fechaCreacion: date('2024-09-15')
}),
(evento6:Evento {
    id: 6,
    nombre: 'Torneo de Voleibol de Playa',
    fechaHora: datetime('2024-09-22T15:00:00'),
    ubicacion: 'Playa Azul',
    descripcion: 'Competencia amistosa de voleibol de playa.',
    cantidadMaximaParticipantes: 16,
    fechaCreacion: date('2024-09-15')
}),
(evento7:Evento {
    id: 7,
    nombre: 'Ciclismo de Montaña',
    fechaHora: datetime('2024-10-01T09:00:00'),
    ubicacion: 'Circuito de la Sierra',
    descripcion: 'Carrera de ciclismo de montaña de 20 km.',
    cantidadMaximaParticipantes: 40,
    fechaCreacion: date('2024-09-15')
}),
(evento8:Evento {
    id: 8,
    nombre: 'Torneo de Padel',
    fechaHora: datetime('2024-10-05T11:00:00'),
    ubicacion: 'Club Deportivo Sur',
    descripcion: 'Competencia de padel en dobles.',
    cantidadMaximaParticipantes: 24,
    fechaCreacion: date('2024-09-15')
}),
(evento9:Evento {
    id: 9,
    nombre: 'Maratón de Natación',
    fechaHora: datetime('2024-10-12T08:00:00'),
    ubicacion: 'Centro Acuático Municipal',
    descripcion: 'Maratón de natación de 2 horas.',
    cantidadMaximaParticipantes: 30,
    fechaCreacion: date('2024-09-15')
}),
(evento10:Evento {
    id: 10,
    nombre: 'Clase de Zumba',
    fechaHora: datetime('2024-10-22T18:00:00'),
    ubicacion: 'Gimnasio Fit Life',
    descripcion: 'Clase de zumba al ritmo de música latina.',
    cantidadMaximaParticipantes: 20,
    fechaCreacion: date('2024-09-15')
}),
(evento11:Evento {
    id: 11,
    nombre: 'Torneo de Ajedrez',
    fechaHora: datetime('2024-09-30T10:00:00'),
    ubicacion: 'Centro Cultural Norte',
    descripcion: 'Torneo de ajedrez abierto a todas las edades.',
    cantidadMaximaParticipantes: 32,
    fechaCreacion: date('2024-09-15')
}),
(evento12:Evento {
    id: 12,
    nombre: 'Caminata por la Ciudad',
    fechaHora: datetime('2024-09-29T08:00:00'),
    ubicacion: 'Plaza Mayor',
    descripcion: 'Caminata guiada por el centro histórico de la ciudad.',
    cantidadMaximaParticipantes: 25,
    fechaCreacion: date('2024-09-15')
}),
(evento13:Evento {
    id: 13,
    nombre: 'Torneo de Ping Pong',
    fechaHora: datetime('2024-10-09T15:00:00'),
    ubicacion: 'Club Atlético Central',
    descripcion: 'Torneo de ping pong individual.',
    cantidadMaximaParticipantes: 16,
    fechaCreacion: date('2024-09-15')
}),
(evento14:Evento {
    id: 14,
    nombre: 'Partido de Básquetbol',
    fechaHora: datetime('2024-09-28T18:00:00'),
    ubicacion: 'Estadio Municipal de Básquet',
    descripcion: 'Partido amistoso de básquet entre equipos locales.',
    cantidadMaximaParticipantes: 12,
    fechaCreacion: date('2024-09-15')
}),
(evento15:Evento {
    id: 15,
    nombre: 'Torneo de Bádminton',
    fechaHora: datetime('2024-10-14T09:00:00'),
    ubicacion: 'Polideportivo Norte',
    descripcion: 'Torneo de bádminton en modalidad individual.',
    cantidadMaximaParticipantes: 20,
    fechaCreacion: date('2024-09-15')
}),
(evento16:Evento {
    id: 16,
    nombre: 'Carrera de Bicicletas',
    fechaHora: datetime('2024-09-26T07:30:00'),
    ubicacion: 'Circuito El Mirador',
    descripcion: 'Competencia de ciclismo en carretera.',
    cantidadMaximaParticipantes: 50,
    fechaCreacion: date('2024-09-15')
}),
(evento17:Evento {
    id: 17,
    nombre: 'Yoga al Amanecer',
    fechaHora: datetime('2024-09-23T06:00:00'),
    ubicacion: 'Parque El Sol',
    descripcion: 'Clase de yoga al amanecer para relajarse.',
    cantidadMaximaParticipantes: 15,
    fechaCreacion: date('2024-09-15')
}),
(evento18:Evento {
    id: 18,
    nombre: 'Maratón de Escalada',
    fechaHora: datetime('2024-10-18T08:00:00'),
    ubicacion: 'Centro de Escalada Roca Firme',
    descripcion: 'Maratón de escalada en modalidad boulder.',
    cantidadMaximaParticipantes: 12,
    fechaCreacion: date('2024-09-15')
}),
(evento19:Evento {
    id: 19,
    nombre: 'Torneo de Hockey',
    fechaHora: datetime('2024-10-13T16:00:00'),
    ubicacion: 'Club Deportivo Oeste',
    descripcion: 'Torneo de hockey sobre césped.',
    cantidadMaximaParticipantes: 22,
    fechaCreacion: date('2024-09-15')
}),
(evento20:Evento {
    id: 20,
    nombre: 'Competencia de Esgrima',
    fechaHora: datetime('2024-10-21T10:00:00'),
    ubicacion: 'Sala de Armas Central',
    descripcion: 'Competencia de esgrima en categoría abierta.',
    cantidadMaximaParticipantes: 18,
    fechaCreacion: date('2024-09-15')
});
