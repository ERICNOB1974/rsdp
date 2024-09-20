MERGE 
(c1:Comunidad {
    nombre: 'Amantes del Running'
}),
(c2:Comunidad {
    nombre: 'Ciclistas Urbanos'
}),
(c3:Comunidad {
    nombre: 'Escaladores Expertos'
}),
(c4:Comunidad {
    nombre: 'Futboleros Unidos'
}),
(c5:Comunidad {
    nombre: 'Caminatas y Senderismo'
}),
(c6:Comunidad {
    nombre: 'Entrenamiento Funcional'
}),
(c7:Comunidad {
    nombre: 'Aficionados al Tenis'
}),
(c8:Comunidad {
    nombre: 'Triatlón Challenge'
}),
(c9:Comunidad {
    nombre: 'Yoga y Meditación'
}),
(c10:Comunidad {
    nombre: 'Ciclistas de Montaña'
}),
(c11:Comunidad {
    nombre: 'Crossfit Warriors'
}),
(c12:Comunidad {
    nombre: 'Atletas del Parque'
}),
(c13:Comunidad {
    nombre: 'Fútbol Femenino'
}),
(c14:Comunidad {
    nombre: 'Natación de Alto Rendimiento'
}),
(c15:Comunidad {
    nombre: 'Amantes del Paddle'
}),
(c16:Comunidad {
    nombre: 'Escalada y Aventura'
}),
(c17:Comunidad {
    nombre: 'Senderismo en Familia'
}),
(c18:Comunidad {
    nombre: 'Maratones del Mundo'
}),
(c19:Comunidad {
    nombre: 'Básquet 3x3'
}),
(c20:Comunidad {
    nombre: 'Surf y Deportes Acuáticos'
});


CREATE
(evento1:Evento {
    id: 100,
    nombre: 'Surfistas amateurs',
    fechaHora: datetime('2024-09-20T16:00:00'),
    ubicacion: 'Bajada 2, Playa Union',
    descripcion: 'Torneo amistoso de surf en Playa Union.',
    cantidadMaximaParticipantes: 30,
    fechaCreacion: date('2024-09-15'),
    esPrivadoParaLaComunidad: true
})

CREATE
(evento2:Evento {
    id: 101,
    nombre: 'Senderismo por cerro avanzado ',
    fechaHora: datetime('2024-09-21T17:30:00'),
    ubicacion: 'Cerro Avanzado, Puerto Madryn',
    descripcion: 'Actividad para hacer en familia y disfrutar de un lindo momento mirando el atardecer.',
    cantidadMaximaParticipantes: 40,
    fechaCreacion: date('2024-09-12'),
    esPrivadoParaLaComunidad: true
})

CREATE
(evento3:Evento {
    id: 102,
    nombre: 'Torneo de Fútbol Interbarrial',
    fechaHora: datetime('2024-10-01T10:00:00'),
    ubicacion: 'Polideportivo Municipal, Puerto Madryn',
    descripcion: 'Torneo de fútbol para equipos amateur. ¡Ven y disfruta del deporte con amigos!',
    cantidadMaximaParticipantes: 16,
    fechaCreacion: date('2024-09-15'),
    esPrivadoParaLaComunidad: false
}),
(evento4:Evento {
    id: 103,
    nombre: 'Ciclismo de Montaña',
    fechaHora: datetime('2024-10-05T08:00:00'),
    ubicacion: 'Senderos de Piedra Buena, Puerto Madryn',
    descripcion: 'Ruta de ciclismo por la montaña, ideal para los amantes del deporte al aire libre.',
    cantidadMaximaParticipantes: 25,
    fechaCreacion: date('2024-09-18'),
    esPrivadoParaLaComunidad: false
}),
(evento5:Evento {
    id: 104,
    nombre: 'Clínica de Surf Avanzado',
    fechaHora: datetime('2024-09-28T14:00:00'),
    ubicacion: 'Playa Paraná, Puerto Madryn',
    descripcion: 'Entrenamiento especializado para surfistas con experiencia que desean mejorar sus habilidades.',
    cantidadMaximaParticipantes: 12,
    fechaCreacion: date('2024-09-13'),
    esPrivadoParaLaComunidad: true
}),
(evento6:Evento {
    id: 105,
    nombre: 'Carrera de Atletismo 10K',
    fechaHora: datetime('2024-10-10T09:00:00'),
    ubicacion: 'Costanera, Puerto Madryn',
    descripcion: 'Carrera de 10 kilómetros por la costanera. Abierta a participantes de todos los niveles.',
    cantidadMaximaParticipantes: 100,
    fechaCreacion: date('2024-09-17'),
    esPrivadoParaLaComunidad: false
})



(c20)<-[:ORGANIZADO_POR:]-(evento1)
(c17)<-[:ORGANIZADO_POR:]-(evento2)
(c4)<-[:ORGANIZADO_POR:]-(evento3)
(c10)<-[:ORGANIZADO_POR:]-(evento4)
(c20)<-[:ORGANIZADO_POR:]-(evento5)
(c1)<-[:ORGANIZADO_POR:]-(evento6)

