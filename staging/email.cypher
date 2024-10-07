MATCH (n) DETACH DELETE n;

CREATE 
(evento:Evento {
    nombre: 'Torneo de Fútbol 5',
    fechaHora: datetime('2024-10-02T18:00:00'),
    ubicacion: 'Cancha Los Olivos',
    descripcion: 'Un torneo de fútbol 5 entre amigos.',
    cantidadMaximaParticipantes: 10,
    fechaCreacion: date('2024-09-15')
})

CREATE 
(u1:Usuario {
    nombreUsuario: 'lucas', 
    nombreReal: 'Lucas San Martin', 
    fechaNacimiento: date('1990-05-15'), 
    fechaDeCreacion: date('2024-09-10'), 
    correoElectronico: 'lucassanmartin76@gmail.com',
    contrasena: 'password1',
    descripcion: 'Amante del fútbol y la música'
})

CREATE 
(u2:Usuario {
    nombreUsuario: 'lucas123', 
    nombreReal: 'Eric Newells', 
    fechaNacimiento: date('1990-05-15'), 
    fechaDeCreacion: date('2024-09-10'), 
    correoElectronico: 'facuespaniol@gmail.com',
    contrasena: 'password1',
    descripcion: 'Amante del fútbol y la música'
})

//MERGE (u1)-[:PARTICIPA_EN]->(evento)
MERGE (u2)-[:PARTICIPA_EN]->(evento)
 