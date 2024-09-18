MATCH (n) DETACH DELETE n;

CREATE (u:Usuario {
    nombreUsuario: 'lucas123',
    nombreReal: 'Lucas Gómez',
    fechaNacimiento: date('1995-08-15'),
    fechaDeCreacion: date(),
    correoElectronico: 'lucas.gomez@example.com',
    contraseña: 'segura123',
    descripcion: 'Apasionado del fútbol y la tecnología.'
})

MERGE (lucas:Usuario {
    nombreUsuario: 'lucas123',
    nombreReal: 'Lucas Gómez',
    fechaNacimiento: date('1995-08-15'),
    fechaDeCreacion: date(),
    correoElectronico: 'lucas.gomez@example.com',
    contraseña: 'segura123',
    descripcion: 'Apasionado del fútbol y la tecnología.'
})

CREATE (eric:Usuario {
    nombreUsuario: 'eric456',
    nombreReal: 'Eric Martínez',
    fechaNacimiento: date('1993-04-12'),
    fechaDeCreacion: date(),
    correoElectronico: 'eric.martinez@example.com',
    contraseña: 'password456',
    descripcion: 'Amante del running y la fotografía.'
}),
(facundo:Usuario {
    nombreUsuario: 'facundo789',
    nombreReal: 'Facundo Pérez',
    fechaNacimiento: date('1990-10-22'),
    fechaDeCreacion: date(),
    correoElectronico: 'facundo.perez@example.com',
    contraseña: 'clave789',
    descripcion: 'Jugador de tenis y fan de la música clásica.'
}),
(alan:Usuario {
    nombreUsuario: 'alan321',
    nombreReal: 'Alan Rodríguez',
    fechaNacimiento: date('1998-01-30'),
    fechaDeCreacion: date(),
    correoElectronico: 'alan.rodriguez@example.com',
    contraseña: 'contra321',
    descripcion: 'Aficionado a los videojuegos y las películas de acción.'
}),
(maia:Usuario {
    nombreUsuario: 'maia654',
    nombreReal: 'Maia López',
    fechaNacimiento: date('1997-09-05'),
    fechaDeCreacion: date(),
    correoElectronico: 'maia.lopez@example.com',
    contraseña: 'secreta654',
    descripcion: 'Apasionada del yoga y la cocina saludable.'
}),
(melisa:Usuario {
    nombreUsuario: 'melisa987',
    nombreReal: 'Melisa Fernández',
    fechaNacimiento: date('1994-06-18'),
    fechaDeCreacion: date(),
    correoElectronico: 'melisa.fernandez@example.com',
    contraseña: 'clave987',
    descripcion: 'Fan del ciclismo y el senderismo.'
})

CREATE (ramiro:Usuario {
    nombreUsuario: 'ramiro123',
    nombreReal: 'Ramiro González',
    fechaNacimiento: date('1992-02-25'),
    fechaDeCreacion: date(),
    correoElectronico: 'ramiro.gonzalez@example.com',
    contraseña: 'ramiroclave',
    descripcion: 'Ciclista aficionado y amante del café.'
}),
(matias:Usuario {
    nombreUsuario: 'matias456',
    nombreReal: 'Matías López',
    fechaNacimiento: date('1995-07-15'),
    fechaDeCreacion: date(),
    correoElectronico: 'matias.lopez@example.com',
    contraseña: 'matiasclave',
    descripcion: 'Apasionado del rugby y los autos.'
}),
(agustin:Usuario {
    nombreUsuario: 'agustin789',
    nombreReal: 'Agustín Ramírez',
    fechaNacimiento: date('1994-05-22'),
    fechaDeCreacion: date(),
    correoElectronico: 'agustin.ramirez@example.com',
    contraseña: 'agustinclave',
    descripcion: 'Fan del baloncesto y las aventuras al aire libre.'
}),
(juarito:Usuario {
    nombreUsuario: 'juarito654',
    nombreReal: 'Juarito Sánchez',
    fechaNacimiento: date('1996-11-11'),
    fechaDeCreacion: date(),
    correoElectronico: 'juarito.sanchez@example.com',
    contraseña: 'juaritoclave',
    descripcion: 'Amante del voleibol y la programación.'
}),
(evelyn:Usuario {
    nombreUsuario: 'evelyn987',
    nombreReal: 'Evelyn Martínez',
    fechaNacimiento: date('1993-12-30'),
    fechaDeCreacion: date(),
    correoElectronico: 'evelyn.martinez@example.com',
    contraseña: 'evelynclave',
    descripcion: 'Yoga y música son sus pasiones.'
}),
(pepe:Usuario {
    nombreUsuario: 'pepe987',
    nombreReal: 'Pepe Martínez',
    fechaNacimiento: date('1993-12-30'),
    fechaDeCreacion: date(),
    correoElectronico: 'pepe.martinez@example.com',
    contraseña: 'pepeclave',
    descripcion: 'Futbol y música son sus pasiones.'
}),
(pedrito:Usuario {
    nombreUsuario: 'pedrito987',
    nombreReal: 'Pedro Martínez',
    fechaNacimiento: date('1993-12-30'),
    fechaDeCreacion: date(),
    correoElectronico: 'pedro.martinez@example.com',
    contraseña: 'pedroclave',
    descripcion: 'Basquet y música son sus pasiones.'
}),
(juanchon:Usuario {
    nombreUsuario: 'juanchon987',
    nombreReal: 'Juanchon Martínez',
    fechaNacimiento: date('1993-12-30'),
    fechaDeCreacion: date(),
    correoElectronico: 'juanchon.martinez@example.com',
    contraseña: 'juanchonclave',
    descripcion: 'Cricket y música son sus pasiones.'
}),
(ignacio:Usuario {
    nombreUsuario: 'ignacio987',
    nombreReal: 'Ignacio Martínez',
    fechaNacimiento: date('1993-12-30'),
    fechaDeCreacion: date(),
    correoElectronico: 'ignacio.martinez@example.com',
    contraseña: 'ignacioclave',
    descripcion: 'Tenis y música son sus pasiones.'
})

// MERGE (lucas)-[:ES_AMIGO_DE]->(eric)
// MERGE (lucas)<-[:ES_AMIGO_DE]-(eric)
// MERGE (lucas)-[:ES_AMIGO_DE]->(facundo)
// MERGE (lucas)<-[:ES_AMIGO_DE]-(facundo)
// MERGE (lucas)-[:ES_AMIGO_DE]->(alan)
// MERGE (lucas)<-[:ES_AMIGO_DE]-(alan)
// MERGE (lucas)-[:ES_AMIGO_DE]->(maia)
// MERGE (lucas)<-[:ES_AMIGO_DE]-(maia)
// MERGE (lucas)-[:ES_AMIGO_DE]->(melisa)
// MERGE (lucas)<-[:ES_AMIGO_DE]-(melisa)

MERGE (ramiro)-[:ES_AMIGO_DE]->(facundo)
MERGE (ramiro)<-[:ES_AMIGO_DE]-(facundo)
MERGE (ramiro)-[:ES_AMIGO_DE]->(eric)
MERGE (ramiro)<-[:ES_AMIGO_DE]-(eric)
MERGE (ramiro)-[:ES_AMIGO_DE]->(alan)
MERGE (ramiro)<-[:ES_AMIGO_DE]-(alan)

MERGE (matias)-[:ES_AMIGO_DE]->(melisa)
MERGE (matias)<-[:ES_AMIGO_DE]-(melisa)
MERGE (matias)-[:ES_AMIGO_DE]->(alan)
MERGE (matias)<-[:ES_AMIGO_DE]-(alan)

MERGE (agustin)-[:ES_AMIGO_DE]->(alan)
MERGE (agustin)<-[:ES_AMIGO_DE]-(alan)
MERGE (agustin)-[:ES_AMIGO_DE]->(facundo)
MERGE (agustin)<-[:ES_AMIGO_DE]-(facundo)

// MERGE (juarito)-[:ES_AMIGO_DE]->(facundo)
// MERGE (juarito)<-[:ES_AMIGO_DE]-(facundo)
// MERGE (juarito)-[:ES_AMIGO_DE]->(maia)
// MERGE (juarito)<-[:ES_AMIGO_DE]-(maia)
// MERGE (juarito)-[:ES_AMIGO_DE]->(melisa)
// MERGE (juarito)<-[:ES_AMIGO_DE]-(melisa)

MERGE (evelyn)-[:ES_AMIGO_DE]->(alan)
MERGE (evelyn)<-[:ES_AMIGO_DE]-(alan)

MERGE (pepe)-[:ES_AMIGO_DE]->(evelyn)
MERGE (pepe)<-[:ES_AMIGO_DE]-(evelyn)
MERGE (pepe)-[:ES_AMIGO_DE]->(agustin)
MERGE (pepe)<-[:ES_AMIGO_DE]-(agustin)

MERGE (pedrito)-[:ES_AMIGO_DE]->(evelyn)
MERGE (pedrito)<-[:ES_AMIGO_DE]-(evelyn)
MERGE (pedrito)-[:ES_AMIGO_DE]->(agustin)
MERGE (pedrito)<-[:ES_AMIGO_DE]-(agustin)

MERGE (juanchon)-[:ES_AMIGO_DE]->(evelyn)
MERGE (juanchon)<-[:ES_AMIGO_DE]-(evelyn)
MERGE (juanchon)-[:ES_AMIGO_DE]->(agustin)
MERGE (juanchon)<-[:ES_AMIGO_DE]-(agustin)

MERGE (ignacio)-[:ES_AMIGO_DE]->(pedrito)
MERGE (ignacio)<-[:ES_AMIGO_DE]-(pedrito)
MERGE (ignacio)-[:ES_AMIGO_DE]->(juanchon)
MERGE (ignacio)<-[:ES_AMIGO_DE]-(juanchon)

MERGE (ignacio)-[:ES_AMIGO_DE]->(pepe)
MERGE (ignacio)<-[:ES_AMIGO_DE]-(pepe)

MERGE (juanchon)-[:ES_AMIGO_DE]->(matias)
MERGE (juanchon)<-[:ES_AMIGO_DE]-(matias)