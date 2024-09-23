// RecomendacionesRutinasBasadasEnAmigos
MATCH (n) DETACH DELETE n;

// Crear usuarios
CREATE (lucas:Usuario {nombreUsuario: 'lucas123', nombreReal: 'lucas López', correoElectronico: 'lucas@example.com'}),
       (eric:Usuario {nombreUsuario: 'eric456', nombreReal: 'eric Gómez', correoElectronico: 'eric@example.com'}),
       (facundo:Usuario {nombreUsuario: 'facundo789', nombreReal: 'facundo Díaz', correoElectronico: 'facundo@example.com'}),
       (amigo1:Usuario {nombreUsuario: 'amigo1', nombreReal: 'Amigo Uno', correoElectronico: 'amigo1@example.com'}),
       (amigo2:Usuario {nombreUsuario: 'amigo2', nombreReal: 'Amigo Dos', correoElectronico: 'amigo2@example.com'}),
       (amigo3:Usuario {nombreUsuario: 'amigo3', nombreReal: 'Amigo Tres', correoElectronico: 'amigo3@example.com'}),
       (amigo4:Usuario {nombreUsuario: 'amigo4', nombreReal: 'Amigo Cuatro', correoElectronico: 'amigo4@example.com'}),
       (amigo5:Usuario {nombreUsuario: 'amigo5', nombreReal: 'Amigo Cinco', correoElectronico: 'amigo5@example.com'}),
       (amigo6:Usuario {nombreUsuario: 'amigo6', nombreReal: 'Amigo Seis', correoElectronico: 'amigo6@example.com'}),
       (amigo7:Usuario {nombreUsuario: 'amigo7', nombreReal: 'Amigo Siete', correoElectronico: 'amigo7@example.com'})

// Establecer relaciones de amistad para Lucas

CREATE (lucas)-[:ES_AMIGO_DE]->(amigo1),
       (lucas)-[:ES_AMIGO_DE]->(amigo2),
       (amigo1)-[:ES_AMIGO_DE]->(lucas),
       (amigo2)-[:ES_AMIGO_DE]->(lucas)

// Establecer relaciones de amistad para Eric

CREATE (eric)-[:ES_AMIGO_DE]->(amigo3),
       (eric)-[:ES_AMIGO_DE]->(amigo4),
       (amigo3)-[:ES_AMIGO_DE]->(eric),
       (amigo4)-[:ES_AMIGO_DE]->(eric)

// Establecer relaciones de amistad para Facundo
CREATE (facundo)-[:ES_AMIGO_DE]->(amigo5),
       (facundo)-[:ES_AMIGO_DE]->(amigo6),
       (facundo)-[:ES_AMIGO_DE]->(amigo7),
       (amigo5)-[:ES_AMIGO_DE]->(facundo),
       (amigo6)-[:ES_AMIGO_DE]->(facundo),
       (amigo7)-[:ES_AMIGO_DE]->(facundo)

// Crear rutinas
CREATE (rutina1:Rutina {id: 2711, nombre: 'Cardio para principiantes', descripcion: 'Rutina enfocada en ejercicios cardiovasculares para principiantes.', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE'}),
       (rutina2:Rutina {id: 2712, nombre: 'Fuerza y resistencia', descripcion: 'Mejora la fuerza y resistencia muscular con esta rutina.', duracionMinutosPorDia: 50, dificultad: 'INTERMEDIO'}),
       (rutina3:Rutina {id: 2713, nombre: 'Entrenamiento funcional', descripcion: 'Rutina de ejercicios funcionales para todo el cuerpo.', duracionMinutosPorDia: 45, dificultad: 'AVANZADO'}),
       (rutina4:Rutina {id: 2714, nombre: 'Yoga y meditación', descripcion: 'Rutina de estiramientos y meditación para relajarse.', duracionMinutosPorDia: 30, dificultad: 'PRINCIPIANTE'}),
       (rutina5:Rutina {id: 2715, nombre: 'HIIT avanzado', descripcion: 'Entrenamiento de alta intensidad con intervalos.', duracionMinutosPorDia: 35, dificultad: 'AVANZADO'})

// Amigos de lucas realizan rutinas
CREATE (amigo1)-[:REALIZA_RUTINA]->(rutina1),
       (amigo2)-[:REALIZA_RUTINA]->(rutina2)

// Amigos de eric realizan rutinas
CREATE (amigo3)-[:REALIZA_RUTINA]->(rutina2),
       (amigo4)-[:REALIZA_RUTINA]->(rutina3)

// eric ya realiza una rutina, la excluiremos en las sugerencias
CREATE (eric)-[:REALIZA_RUTINA]->(rutina2)

// Amigos de facundo realizan rutinas, con mayor prioridad para "Yoga y meditación"
CREATE (amigo5)-[:REALIZA_RUTINA]->(rutina4),
       (amigo6)-[:REALIZA_RUTINA]->(rutina4), // Yoga la realizan más amigos
       (amigo7)-[:REALIZA_RUTINA]->(rutina5);