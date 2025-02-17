//RecomendacionesEventosBasadosEnEventos
MATCH (n) DETACH DELETE n;
// Crear usuarios con ubicaciones (latitud y longitud como propiedades separadas)
CREATE (u1:Usuario {
    nombreUsuario: "lucasMadryn",
    nombreReal: "Lucas San Martin",
    fechaNacimiento: date("1990-01-01"),
    fechaDeCreacion: date("2023-01-01"),
    correoElectronico: "lucassanmartin76@gmail.com",
    contrasena: "password123",
    descripcion: "Usuario 1 activo",
    latitud: -42.762555975850084,
    longitud: -65.04467329781565
})

CREATE (u2:Usuario {
    nombreUsuario: "facuMadryn",
    nombreReal: "Facundo Español",
    fechaNacimiento: date("1992-02-15"),
    fechaDeCreacion: date("2023-02-01"),
    correoElectronico: "facuespaniol@gmail.com",
    contrasena: "password456",
    descripcion: "Usuario 2 activo",
    latitud: -42.762555975850084,
    longitud: -65.04467329781565
})

// Crear eventos con ubicaciones (latitud y longitud como propiedades separadas)
CREATE (e1:Evento {
    nombre: "Carrera en la plaza de Puerto Madryn",
    fechaDeCreacion: date("2023-07-01"),
    fechaHora: datetime("2025-10-03T10:00:00"),
    descripcion: "Carrera en la costa",
    cantidadMaximaParticipantes: 50,
    esPrivadoParaLaComunidad: false,
    latitud: -42.762555975850084,
    longitud: -65.04467329781565
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
    fechaHora: datetime("2025-10-02T16:00:00"),
    descripcion: "Estiramiento en Comodoro",
    cantidadMaximaParticipantes: 1,
    esPrivadoParaLaComunidad: false,
    latitud: -45.8666676301876,
    longitud: -67.52256636176106
})

CREATE (et1:Etiqueta {nombre: "Deportes"})
CREATE (et2:Etiqueta {nombre: "Aire libre"})
CREATE (et3:Etiqueta {nombre: "Resistencia"})
CREATE (et4:Etiqueta {nombre: "Recreativo"})
CREATE (et5:Etiqueta {nombre: "Fisico"})
CREATE (et6:Etiqueta {nombre: "Cuerpo completo"})
CREATE (et7:Etiqueta {nombre: "Motricidad"})
CREATE (et8:Etiqueta {nombre: "Torso superior"})
CREATE (et9:Etiqueta {nombre: "Torso inferior"})
CREATE (et10:Etiqueta {nombre: "Para toda la familia"})


// Madryn
//10
CREATE (e1)-[:ETIQUETADO_CON]->(et1)
CREATE (e1)-[:ETIQUETADO_CON]->(et2)
CREATE (e1)-[:ETIQUETADO_CON]->(et3)
CREATE (e1)-[:ETIQUETADO_CON]->(et4)
CREATE (e1)-[:ETIQUETADO_CON]->(et5)
CREATE (e1)-[:ETIQUETADO_CON]->(et6)
CREATE (e1)-[:ETIQUETADO_CON]->(et7)
CREATE (e1)-[:ETIQUETADO_CON]->(et8)
CREATE (e1)-[:ETIQUETADO_CON]->(et9)
CREATE (e1)-[:ETIQUETADO_CON]->(et10)

//Posadas
//10
CREATE (e2)-[:ETIQUETADO_CON]->(et1)
CREATE (e2)-[:ETIQUETADO_CON]->(et2)
CREATE (e2)-[:ETIQUETADO_CON]->(et3)
CREATE (e2)-[:ETIQUETADO_CON]->(et4)
CREATE (e2)-[:ETIQUETADO_CON]->(et5)
CREATE (e2)-[:ETIQUETADO_CON]->(et6)
CREATE (e2)-[:ETIQUETADO_CON]->(et7)
CREATE (e2)-[:ETIQUETADO_CON]->(et8)
CREATE (e2)-[:ETIQUETADO_CON]->(et9)
CREATE (e2)-[:ETIQUETADO_CON]->(et10)

//Bahia Blanca
//6
CREATE (e3)-[:ETIQUETADO_CON]->(et4)
CREATE (e3)-[:ETIQUETADO_CON]->(et5)
CREATE (e3)-[:ETIQUETADO_CON]->(et6)
CREATE (e3)-[:ETIQUETADO_CON]->(et7)
CREATE (e3)-[:ETIQUETADO_CON]->(et8)
CREATE (e3)-[:ETIQUETADO_CON]->(et9)

//Comodoro
//6
CREATE (e4)-[:ETIQUETADO_CON]->(et1)
CREATE (e4)-[:ETIQUETADO_CON]->(et2)
CREATE (e4)-[:ETIQUETADO_CON]->(et3)
CREATE (e4)-[:ETIQUETADO_CON]->(et4)
CREATE (e4)-[:ETIQUETADO_CON]->(et5)
CREATE (e4)-[:ETIQUETADO_CON]->(et6)

//Comodoro
//Todas
//No lo recomienda ya q esta lleno
CREATE (e5)-[:ETIQUETADO_CON]->(et1)
CREATE (e5)-[:ETIQUETADO_CON]->(et2)
CREATE (e5)-[:ETIQUETADO_CON]->(et3)
CREATE (e5)-[:ETIQUETADO_CON]->(et4)
CREATE (e5)-[:ETIQUETADO_CON]->(et5)
CREATE (e5)-[:ETIQUETADO_CON]->(et6)
CREATE (e5)-[:ETIQUETADO_CON]->(et7)
CREATE (e5)-[:ETIQUETADO_CON]->(et8)
CREATE (e5)-[:ETIQUETADO_CON]->(et9)
CREATE (e5)-[:ETIQUETADO_CON]->(et10)

// Relacionar usuarios con eventos
CREATE (u1)-[:PARTICIPA_EN]->(e1)
CREATE (u2)-[:PARTICIPA_EN]->(e5)