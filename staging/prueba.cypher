// Crear usuarios con ubicaciones (latitud y longitud como propiedades separadas)
MATCH (n) DETACH DELETE n;
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

CREATE (u3:Usuario {
    nombreUsuario: "ericMadryn",
    nombreReal: "Eric Anderson",
    fechaNacimiento: date("1995-05-10"),
    fechaDeCreacion: date("2023-03-01"),
    correoElectronico: "ericnob1974@gmail.com",
    contrasena: "password789",
    descripcion: "Usuario 3 activo",
    latitud: -42.762555975850084,
    longitud: -65.04467329781565
})

// Crear eventos con ubicaciones (latitud y longitud como propiedades separadas)
CREATE (e1:Evento {
    nombre: "Carrera en la plaza de Puerto Madryn",
    fechaDeCreacion: date("2023-07-01"),
    fechaHora: datetime("2024-10-03T10:00:00"),
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

CREATE (c1:Comunidad {nombre: "Ciclistas de Montaña de Madryn", fechaDeCreacion: date("2021-01-02"), descripcion: "Rutas largas para ciclistas", cantidadMaximaMiembros: 51, esPrivada: false, latitud: -42.76442823854689, longitud: -65.03365087594793}),
       (c2:Comunidad {nombre: "Corredores de Ruta de Comodoro", fechaDeCreacion: date("2020-05-15"), descripcion: "Grupo para aficionados al running", cantidadMaximaMiembros: 100, esPrivada: false, latitud: -45.8397063939941, longitud: -67.47694735091086}),
       (c3:Comunidad {nombre: "Nadadores Urbanos de Bahia Blanca", fechaDeCreacion: date("2019-08-20"), descripcion: "Entrenamientos en piscinas y ríos", cantidadMaximaMiembros: 30, esPrivada: true, latitud: -38.71450381606208, longitud: -62.265303322668416}),
       (c4:Comunidad {nombre: "Escaladores de Montaña de Jujuy", fechaDeCreacion: date("2021-03-10"), descripcion: "Aventuras en escalada", cantidadMaximaMiembros: 25, esPrivada: false, latitud: -22.108040819161882, longitud: -65.59842140253284})

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