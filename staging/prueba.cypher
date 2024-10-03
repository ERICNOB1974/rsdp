// Crear usuarios con ubicaciones (latitud y longitud como propiedades separadas)
CREATE (u1:Usuario {
    nombreUsuario: "usuario1",
    nombreReal: "Juan Pérez",
    fechaNacimiento: date("1990-01-01"),
    fechaDeCreacion: date("2023-01-01"),
    correoElectronico: "lucassanmartin76@gmail.com",
    contrasena: "password123",
    descripcion: "Usuario 1 activo",
    latitud: -43.250,
    longitud: -65.308
})

CREATE (u2:Usuario {
    nombreUsuario: "usuario2",
    nombreReal: "María López",
    fechaNacimiento: date("1992-02-15"),
    fechaDeCreacion: date("2023-02-01"),
    correoElectronico: "facuespaniol@gmail.com",
    contrasena: "password456",
    descripcion: "Usuario 2 activo",
    latitud: -43.320,
    longitud: -65.040
})

CREATE (u3:Usuario {
    nombreUsuario: "usuario3 en belgrano",
    nombreReal: "Carlos Gómez",
    fechaNacimiento: date("1995-05-10"),
    fechaDeCreacion: date("2023-03-01"),
    correoElectronico: "ericnob1974@gmail.com",
    contrasena: "password789",
    descripcion: "Usuario 3 activo",
    latitud: -42.767682,
    longitud: -65.0388059
})

// Crear eventos con ubicaciones (latitud y longitud como propiedades separadas)
CREATE (e1:Evento {
    nombre: "Carrera en la plaza",
    fechaDeCreacion: date("2023-07-01"),
    fechaHora: datetime("2024-10-03T10:00:00"),
    descripcion: "Carrera en la costa",
    cantidadMaximaParticipantes: 50,
    esPrivadoParaLaComunidad: false,
    latitud: -42.767241,
    longitud: -65.0392029
})

CREATE (e2:Evento {
    nombre: "Entrenamiento de natación en aluar",
    fechaDeCreacion: date("2023-08-10"),
    fechaHora: datetime("2024-10-03T12:00:00"),
    descripcion: "Entrenamiento en la piscina municipal",
    cantidadMaximaParticipantes: 30,
    esPrivadoParaLaComunidad: false,
    latitud: -42.73796,
    longitud: -65.0436769
})

CREATE (e3:Evento {
    nombre: "Caminata en el parque",
    fechaDeCreacion: date("2023-08-10"),
    fechaHora: datetime("2024-10-03T14:00:00"),
    descripcion: "Caminata tranquila en el parque",
    cantidadMaximaParticipantes: 20,
    esPrivadoParaLaComunidad: false,
    latitud: -43.252,
    longitud: -65.309
})

CREATE (e4:Evento {
    nombre: "Aerobico en monumento a islas malvinas",
    fechaDeCreacion: date("2023-08-10"),
    fechaHora: datetime("2024-10-02T16:00:00"),
    descripcion: "Aerobico en islas malvinas",
    cantidadMaximaParticipantes: 20,
    esPrivadoParaLaComunidad: false,
    latitud: -42.75927,
    longitud: -65.0390789
})

// Crear etiquetas
CREATE (et1:Etiqueta {nombre: "Deportes"})
CREATE (et2:Etiqueta {nombre: "Aire libre"})
CREATE (et3:Etiqueta {nombre: "Fisico"})

// Etiquetar eventos
CREATE (e1)-[:ETIQUETADO_CON]->(et2)
CREATE (e1)-[:ETIQUETADO_CON]->(et3)
CREATE (e2)-[:ETIQUETADO_CON]->(et1)
CREATE (e2)-[:ETIQUETADO_CON]->(et2)
CREATE (e2)-[:ETIQUETADO_CON]->(et3)
CREATE (e3)-[:ETIQUETADO_CON]->(et1)
CREATE (e3)-[:ETIQUETADO_CON]->(et2)
CREATE (e3)-[:ETIQUETADO_CON]->(et3)
CREATE (e4)-[:ETIQUETADO_CON]->(et2)

// Relacionar usuarios con eventos
CREATE (u1)-[:PARTICIPA_EN]->(e1)
CREATE (u2)-[:PARTICIPA_EN]->(e2)
CREATE (u3)-[:PARTICIPA_EN]->(e3)

