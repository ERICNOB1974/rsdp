// Crear Usuarios
CREATE (user1:Usuario {id: 1, nombreUsuario: "user1", nombreReal: "Usuario Uno", fechaNacimiento: null, fechaDeCreacion: null, correoElectronico: "user1@ejemplo.com", contrasena: "password1", descripcion: "Usuario activo"})
CREATE (user2:Usuario {id: 2, nombreUsuario: "user2", nombreReal: "Usuario Dos", fechaNacimiento: null, fechaDeCreacion: null, correoElectronico: "user2@ejemplo.com", contrasena: "password2", descripcion: "Deportista profesional"})

// Crear Eventos
CREATE (event1:Evento {id: 1, nombre: "Futbol 5", fechaHora: null, ubicacion: "Cancha 1", descripcion: "Partido amistoso", cantidadMaximaParticipantes: 10})
CREATE (event2:Evento {id: 2, nombre: "Carrera 10K", fechaHora: null, ubicacion: "Parque Central", descripcion: "Carrera anual", cantidadMaximaParticipantes: 50})

// Crear relación PARTICIPA_EN con atributo fechaInscripcion
CREATE (user1)-[:PARTICIPA_EN {fechaInscripcion: null}]->(event1)
CREATE (user2)-[:PARTICIPA_EN {fechaInscripcion: null}]->(event2)

// Crear etiquetas
CREATE (etiqueta1:Etiqueta {nombre: "Deporte"})
CREATE (etiqueta2:Etiqueta {nombre: "Carrera"})

// Relacionar eventos con etiquetas
CREATE (event1)-[:ETIQUETADO_CON]->(etiqueta1)
CREATE (event2)-[:ETIQUETADO_CON]->(etiqueta2)

// Relacionar Evento con su creador
CREATE (event1)-[:CREADO_POR]->(user1)
CREATE (event2)-[:CREADO_POR]->(user2)
