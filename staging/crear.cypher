CREATE (u1:Usuario {
    nombreUsuario: "usuario1", 
    nombreReal: "Juan Pérez", 
    fechaNacimiento: date("1990-01-01"), 
    fechaDeCreacion: date("2023-01-01"), 
    correoElectronico: "juan@example.com", 
    contrasena: "password123", 
    descripcion: "Aficionado al running"
}),
(u2:Usuario {
    nombreUsuario: "usuario2", 
    nombreReal: "María González", 
    fechaNacimiento: date("1985-05-10"), 
    fechaDeCreacion: date("2023-03-10"), 
    correoElectronico: "maria@example.com", 
    contrasena: "password456", 
    descripcion: "Apasionada del ciclismo"
});


CREATE (c1:Comunidad {
    nombre: "Comunidad Running", 
    fechaDeCreacion: date("2022-01-01"), 
    descripcion: "Grupo de corredores aficionados", 
    cantidadMaximaMiembros: 100
}),
(c2:Comunidad {
    nombre: "Comunidad Ciclismo", 
    fechaDeCreacion: date("2021-06-15"), 
    descripcion: "Ciclistas de todas las edades", 
    cantidadMaximaMiembros: 50
});


CREATE (p1:Publicacion {
    descripcion: "Gran entrenamiento de hoy!", 
    cantidadLikes: 10
}),
(p2:Publicacion {
    descripcion: "Nueva meta alcanzada!", 
    cantidadLikes: 25
});


CREATE (e1:Ejercicio {
    nombre: "Flexiones", 
    descripcion: "Flexiones de pecho", 
    cantidadRepeticiones: "20", 
    cantidadTiempo: 0, 
    esPorTiempo: false
}),
(e2:Ejercicio {
    nombre: "Planchas", 
    descripcion: "Planchas abdominales", 
    cantidadRepeticiones: "", 
    cantidadTiempo: 60, 
    esPorTiempo: true
});


CREATE (r1:Rutina {
    nombre: "Rutina Básica", 
    descripcion: "Entrenamiento para principiantes", 
    duracionMinutosPorDia: 30, 
    dificultad: "PRINCIPIANTE"
});


CREATE (ev1:Evento {
    nombre: "Carrera 5K", 
    fechaDeCreacion: date("2023-04-01"), 
    fechaHora: date("2023-05-01"), 
    ubicacion: "Parque Central", 
    descripcion: "Carrera de 5 kilómetros", 
    cantidadMaximaParticipantes: 100
});


CREATE (com1:Comentario {
    descripcionComentario: "Gran evento!"
});


CREATE (et1:Etiqueta { nombre: "Running" }),
(et2:Etiqueta { nombre: "Ciclismo" });


MATCH (u1:Usuario {nombreUsuario: "usuario1"}), (r1:Rutina {nombre: "Rutina Básica"})
CREATE (u1)-[:REALIZA {fechaDeComienzo: date("2023-01-15")}]->(r1);

MATCH (u1:Usuario {nombreUsuario: "usuario1"}), (p1:Publicacion {descripcion: "Gran entrenamiento de hoy!"})
CREATE (u1)-[:POSTEA]->(p1);

MATCH (c1:Comunidad {nombre: "Comunidad Running"}), (et1:Etiqueta {nombre: "Running"})
CREATE (c1)-[:ETIQUETADA_CON]->(et1);   

MATCH (u1:Usuario {nombreUsuario: "usuario1"}), (ev1:Evento {nombre: "Carrera 5K"})
CREATE (u1)-[:PARTICIPA {fechaDeInscripcion: date("2023-04-05")}]->(ev1);

MATCH (u1:Usuario {nombreUsuario: "usuario1"}), (u2:Usuario {nombreUsuario: "usuario2"})
CREATE (u1)-[:ES_AMIGO_DE]->(u2);

