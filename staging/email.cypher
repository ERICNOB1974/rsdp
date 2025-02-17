MATCH (n) DETACH DELETE n;

CREATE 
(evento:Evento {
    nombre: 'Torneo de Fútbol 5',
    fechaHora: datetime('2025-10-02T18:00:00'),
    ubicacion: 'Cancha Los Olivos',
    descripcion: 'Un torneo de fútbol 5 entre amigos.',
    cantidadMaximaParticipantes: 10,
    fechaCreacion: date('2024-09-15')
})
CREATE (e2:Evento {
    nombre: "Entrenamiento de natación en Posadas",
    fechaDeCreacion: date("2023-08-10"),
    fechaHora: datetime("2025-10-03T12:00:00"),
    descripcion: "Entrenamiento en la piscina municipal",
    cantidadMaximaParticipantes: 30,
    esPrivadoParaLaComunidad: false,
    latitud: -27.38714029003687, 
    longitud: -55.92143101061461
})

CREATE (e3:Evento {
    nombre: "Caminata en el parque de Bahia Blanca",
    fechaDeCreacion: date("2023-08-10"),
    fechaHora: datetime("2025-10-03T14:00:00"),
    descripcion: "Caminata tranquila en el parque",
    cantidadMaximaParticipantes: 20,
    esPrivadoParaLaComunidad: false,
    latitud: -38.7139680437262,
    longitud: -62.2872759788477
})

CREATE (e4:Evento {
    nombre: "Aerobico en la plaza de Comodoro",
    fechaDeCreacion: date("2023-08-10"),
    fechaHora: datetime("2025-10-02T16:00:00"),
    descripcion: "Aerobico en Comodoro",
    cantidadMaximaParticipantes: 20,
    esPrivadoParaLaComunidad: false,
    latitud: -45.8666676301876,
    longitud: -67.52256636176106
})

CREATE (e5:Evento {
    nombre: "Estiramiento en la plaza de Comodoro",
    fechaDeCreacion: date("2023-08-10"),
    fechaHora: datetime("2024-10-20T20:00:00"),
    descripcion: "Estiramiento en Comodoro",
    cantidadMaximaParticipantes: 3,
    esPrivadoParaLaComunidad: false,
    latitud: -45.8666676301876,
    longitud: -67.52256636176106
})

CREATE 
(u1:Usuario {
    nombreUsuario: 'facundo', 
    nombreReal: 'Facundo', 
    fechaNacimiento: date('1990-05-15'), 
    fechaDeCreacion: date('2024-04-10'), 
    correoElectronico: 'facuespaniol@gmail.com',
    contrasena: 'password1',
    descripcion: 'Amante de la natacion'
})

CREATE 
(u2:Usuario {
    nombreUsuario: 'ernesto', 
    nombreReal: 'Ernesto Mayorga', 
    fechaNacimiento: date('1990-05-15'), 
    fechaDeCreacion: date('2024-04-10'), 
    correoElectronico: 'ericnob1974@gmail.com',
    contrasena: 'password1',
    descripcion: 'Amante de las caminatas'
})
CREATE 
(u3:Usuario {
    nombreUsuario: 'alan', 
    nombreReal: 'Alan Kalevich', 
    fechaNacimiento: date('1990-05-15'), 
    fechaDeCreacion: date('2024-04-10'), 
    correoElectronico: 'alankalevich@gmail.com',
    contrasena: 'password1',
    descripcion: 'Amante del gimnasio'
})

//MERGE (u1)-[:PARTICIPA_EN]->(evento)
MERGE (u1)-[:PARTICIPA_EN]->(e5)
MERGE (u2)-[:PARTICIPA_EN]->(e2)
MERGE (u3)-[:PARTICIPA_EN]->(e2)
 