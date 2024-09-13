// Crear usuarios con todos los atributos, incluyendo listas inicializadas en null
CREATE (u1:Usuario {
    nombreUsuario: 'usuario1', 
    nombreReal: 'Usuario Uno', 
    fechaNacimiento: null, 
    fechaDeCreacion: null, 
    correoElectronico: 'usuario1@example.com', 
    contrasena: null, 
    descripcion: null,
    publicaciones: null, 
    comunidades: null, 
    inscripciones: null, 
    rutinas: null, 
    amigos: null
}),
(u2:Usuario {
    nombreUsuario: 'usuario2', 
    nombreReal: 'Usuario Dos', 
    fechaNacimiento: null, 
    fechaDeCreacion: null, 
    correoElectronico: 'usuario2@example.com', 
    contrasena: null, 
    descripcion: null,
    publicaciones: null, 
    comunidades: null, 
    inscripciones: null, 
    rutinas: null, 
    amigos: null
});

// Crear eventos con todos los atributos, incluyendo listas inicializadas en null
CREATE (e1:Evento {
    nombre: 'Partido de fútbol', 
    fechaHora: null, 
    fechaCreacion: null, 
    ubicacion: null, 
    descripcion: null, 
    cantidadMaximaParticipantes: null,
    creador: null, 
    participantes: null, 
    etiquetas: null
}),
(e2:Evento {
    nombre: 'Maratón 10K', 
    fechaHora: null, 
    fechaCreacion: null, 
    ubicacion: null, 
    descripcion: null, 
    cantidadMaximaParticipantes: null,
    creador: null, 
    participantes: null, 
    etiquetas: null
});

// Crear inscripciones como entidades intermedias, dejando todos los atributos en null
MATCH (u1:Usuario {nombreUsuario: 'usuario1'}), (e1:Evento {nombre: 'Partido de fútbol'})
CREATE (u1)-[:PARTICIPA_EN]->(ins1:InscripcionAEvento {
    fechaInscripcion: null,
    evento: null
})-[:RELACIONADO_CON]->(e1);

MATCH (u2:Usuario {nombreUsuario: 'usuario2'}), (e2:Evento {nombre: 'Maratón 10K'})
CREATE (u2)-[:PARTICIPA_EN]->(ins2:InscripcionAEvento {
    fechaInscripcion: null,
    evento: null
})-[:RELACIONADO_CON]->(e2);

// Conectar otro usuario al primer evento con inscripciones en null
MATCH (u2:Usuario {nombreUsuario: 'usuario2'}), (e1:Evento {nombre: 'Partido de fútbol'})
CREATE (u2)-[:PARTICIPA_EN]->(ins3:InscripcionAEvento {
    fechaInscripcion: null,
    evento: null
})-[:RELACIONADO_CON]->(e1);
