// Crear eventos
CREATE (evento1:Evento {
    id: 1,
    nombre: 'Torneo de Fútbol 5',
    fechaHora: datetime('2024-09-20T18:00:00'),
    ubicacion: 'Cancha Los Olivos',
    descripcion: 'Un torneo de fútbol 5 entre amigos.',
    cantidadMaximaParticipantes: 10
}),
(evento2:Evento {
    id: 2,
    nombre: 'Carrera de 10K',
    fechaHora: datetime('2024-09-25T07:00:00'),
    ubicacion: 'Parque de la Ciudad',
    descripcion: 'Carrera de 10 kilómetros en el parque.',
    cantidadMaximaParticipantes: 50
}),
(evento3:Evento {
    id: 3,
    nombre: 'Torneo de Tenis',
    fechaHora: datetime('2024-10-10T09:00:00'),
    ubicacion: 'Club de Tenis Los Cedros',
    descripcion: 'Un torneo de tenis amateur.',
    cantidadMaximaParticipantes: 20
}),
(evento4:Evento {
    id: 4,
    nombre: 'Caminata por la Montaña',
    fechaHora: datetime('2024-10-15T08:00:00'),
    ubicacion: 'Sendero Las Cumbres',
    descripcion: 'Caminata recreativa en la montaña.',
    cantidadMaximaParticipantes: 30
}),
(evento5:Evento {
    id: 5,
    nombre: 'Clase de Yoga al Aire Libre',
    fechaHora: datetime('2024-10-20T17:00:00'),
    ubicacion: 'Plaza Central',
    descripcion: 'Clase de yoga para todos los niveles.',
    cantidadMaximaParticipantes: 20
})

// Usar WITH para pasar los eventos creados al siguiente bloque
WITH evento1, evento2, evento3, evento4, evento5

// Crear relaciones CREADO_POR (El creador de los eventos)
MATCH (lucas:Usuario {nombreUsuario: 'lucas123'})
MATCH (eric:Usuario {nombreUsuario: 'eric456'})
MATCH (facundo:Usuario {nombreUsuario: 'facundo789'})
MATCH (maia:Usuario {nombreUsuario: 'maia654'})
MATCH (melisa:Usuario {nombreUsuario: 'melisa987'})

MERGE (lucas)-[:CREADO_POR]->(evento1)
MERGE (eric)-[:CREADO_POR]->(evento2)
MERGE (facundo)-[:CREADO_POR]->(evento3)
MERGE (maia)-[:CREADO_POR]->(evento4)
MERGE (melisa)-[:CREADO_POR]->(evento5)

// Usar WITH para pasar los usuarios y eventos al siguiente bloque
WITH evento1, evento2, evento3, evento4, evento5

// Crear relaciones PARTICIPA_EN (Participantes en los eventos)
MATCH (lucas:Usuario {nombreUsuario: 'lucas123'})
MATCH (eric:Usuario {nombreUsuario: 'eric456'})
MATCH (facundo:Usuario {nombreUsuario: 'facundo789'})
MATCH (alan:Usuario {nombreUsuario: 'alan321'})
MATCH (ramiro:Usuario {nombreUsuario: 'ramiro123'})
MATCH (matias:Usuario {nombreUsuario: 'matias456'})
MATCH (agustin:Usuario {nombreUsuario: 'agustin789'})
MATCH (juarito:Usuario {nombreUsuario: 'juarito654'})
MATCH (evelyn:Usuario {nombreUsuario: 'evelyn987'})
MATCH (maia:Usuario {nombreUsuario: 'maia654'})
MATCH (melisa:Usuario {nombreUsuario: 'melisa987'})

MERGE (lucas)-[:PARTICIPA_EN]->(evento2)
MERGE (lucas)-[:PARTICIPA_EN]->(evento3)
MERGE (lucas)-[:PARTICIPA_EN]->(evento5)
MERGE (eric)-[:PARTICIPA_EN]->(evento1)
MERGE (eric)-[:PARTICIPA_EN]->(evento3)
MERGE (facundo)-[:PARTICIPA_EN]->(evento1)
MERGE (facundo)-[:PARTICIPA_EN]->(evento2)
MERGE (alan)-[:PARTICIPA_EN]->(evento1)
MERGE (alan)-[:PARTICIPA_EN]->(evento4)
MERGE (maia)-[:PARTICIPA_EN]->(evento1)
MERGE (maia)-[:PARTICIPA_EN]->(evento5)
MERGE (melisa)-[:PARTICIPA_EN]->(evento3)
MERGE (melisa)-[:PARTICIPA_EN]->(evento5)
MERGE (ramiro)-[:PARTICIPA_EN]->(evento2)
MERGE (ramiro)-[:PARTICIPA_EN]->(evento3)
MERGE (ramiro)-[:PARTICIPA_EN]->(evento5)
MERGE (matias)-[:PARTICIPA_EN]->(evento1)
MERGE (matias)-[:PARTICIPA_EN]->(evento4)
MERGE (agustin)-[:PARTICIPA_EN]->(evento2)
MERGE (agustin)-[:PARTICIPA_EN]->(evento4)
MERGE (juarito)-[:PARTICIPA_EN]->(evento5)
MERGE (juarito)-[:PARTICIPA_EN]->(evento3)
MERGE (evelyn)-[:PARTICIPA_EN]->(evento4)
MERGE (evelyn)-[:PARTICIPA_EN]->(evento5)

