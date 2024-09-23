//RecomendacionesEventosBasadosEnRutinas
MATCH (n) DETACH DELETE n;

// Crear usuarios
CREATE (lucas:Usuario {nombreUsuario: 'lucas123', nombreReal: 'lucas Lopez', correoElectronico: 'lucas@example.com'}),
       (eric:Usuario {nombreUsuario: 'eric456', nombreReal: 'eric Perez', correoElectronico: 'eric@example.com'}),
       (facundo:Usuario {nombreUsuario: 'facundo789', nombreReal: 'facundo Sanchez', correoElectronico: 'facundo@example.com'});

// Crear rutinas
CREATE (rutina1:Rutina {id: 2711, nombre: 'Cardio para principiantes', descripcion: 'Rutina de cardio para principiantes.', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE'}),
       (rutina2:Rutina {id: 2712, nombre: 'Yoga y meditación', descripcion: 'Rutina de yoga y meditación para relajarse.', duracionMinutosPorDia: 30, dificultad: 'PRINCIPIANTE'}),
       (rutina3:Rutina {id: 2713, nombre: 'Fuerza avanzada', descripcion: 'Rutina avanzada de fuerza y resistencia.', duracionMinutosPorDia: 50, dificultad: 'AVANZADO'}),
       (rutina4:Rutina {id: 2714, nombre: 'Cardio avanzado con fuerza', descripcion: 'Rutina combinada de cardio y fuerza.', duracionMinutosPorDia: 45, dificultad: 'INTERMEDIO'}),
       (rutina5:Rutina {id: 2715, nombre: 'Entrenamiento funcional', descripcion: 'Rutina de entrenamiento funcional.', duracionMinutosPorDia: 35, dificultad: 'INTERMEDIO'}),
       (rutina6:Rutina {id: 2716, nombre: 'Fuerza básica', descripcion: 'Rutina de fuerza para principiantes.', duracionMinutosPorDia: 40, dificultad: 'PRINCIPIANTE'});

// Crear etiquetas
CREATE (etiquetaCardio:Etiqueta {nombre: 'Cardio'}),
       (etiquetaYoga:Etiqueta {nombre: 'Yoga'}),
       (etiquetaFuerza:Etiqueta {nombre: 'Fuerza'}),
       (etiquetaFuncional:Etiqueta {nombre: 'Funcional'}),
       (etiquetaAvanzada:Etiqueta {nombre: 'Avanzada'}); // Nueva etiqueta adicional

// Crear eventos
CREATE (evento1:Evento {id: 2001, nombre: 'Entrenamiento funcional en el parque', fechaHora: datetime('2024-09-29T10:00:00'), descripcion: 'Entrenamiento funcional intensivo.', esPrivadoParaLaComunidad: false}),
       (evento2:Evento {id: 2002, nombre: 'Yoga al aire libre', fechaHora: datetime('2024-09-22T08:00:00'), descripcion: 'Clase de yoga al aire libre.', esPrivadoParaLaComunidad: false}),
       (evento3:Evento {id: 2003, nombre: 'Maratón de la ciudad', fechaHora: datetime('2024-10-15T09:00:00'), descripcion: 'Maratón para corredores de todos los niveles.', esPrivadoParaLaComunidad: false}),
       (evento4:Evento {id: 2004, nombre: 'Entrenamiento de fuerza avanzada', fechaHora: datetime('2024-09-25T07:00:00'), descripcion: 'Entrenamiento intensivo de fuerza avanzada.', esPrivadoParaLaComunidad: false});

// MATCH para crear las relaciones entre rutinas y etiquetas
MATCH (rutina1:Rutina {id: 2711}), (rutina2:Rutina {id: 2712}), (rutina3:Rutina {id: 2713}), (rutina4:Rutina {id: 2714}),
      (rutina5:Rutina {id: 2715}), (rutina6:Rutina {id: 2716}),
      (etiquetaCardio:Etiqueta {nombre: 'Cardio'}), (etiquetaYoga:Etiqueta {nombre: 'Yoga'}),
      (etiquetaFuerza:Etiqueta {nombre: 'Fuerza'}), (etiquetaFuncional:Etiqueta {nombre: 'Funcional'}),
      (etiquetaAvanzada:Etiqueta {nombre: 'Avanzada'}) // Nueva etiqueta
CREATE (rutina1)-[:ETIQUETADA_CON]->(etiquetaCardio),
       (rutina2)-[:ETIQUETADA_CON]->(etiquetaYoga),
       (rutina3)-[:ETIQUETADA_CON]->(etiquetaFuerza),
       (rutina3)-[:ETIQUETADA_CON]->(etiquetaFuncional),
       (rutina4)-[:ETIQUETADA_CON]->(etiquetaCardio),  // Relación con etiqueta Cardio
       (rutina4)-[:ETIQUETADA_CON]->(etiquetaAvanzada),  // Relación con etiqueta adicional
       (rutina5)-[:ETIQUETADA_CON]->(etiquetaFuncional),  // Rutina de Eric que etiquetará al evento funcional
       (rutina6)-[:ETIQUETADA_CON]->(etiquetaFuerza);  // Rutina de Eric que etiquetará al evento de fuerza

// MATCH para crear las relaciones entre usuarios y rutinas
MATCH (lucas:Usuario {nombreUsuario: 'lucas123'}), (eric:Usuario {nombreUsuario: 'eric456'}), (facundo:Usuario {nombreUsuario: 'facundo789'}),
      (rutina1:Rutina {id: 2711}), (rutina2:Rutina {id: 2712}), (rutina3:Rutina {id: 2713}), (rutina4:Rutina {id: 2714}),
      (rutina5:Rutina {id: 2715}), (rutina6:Rutina {id: 2716})
CREATE (lucas)-[:REALIZA_RUTINA]->(rutina1),
       (lucas)-[:REALIZA_RUTINA]->(rutina4), 
       (lucas)-[:REALIZA_RUTINA]->(rutina2), 
       (eric)-[:REALIZA_RUTINA]->(rutina5),  
       (eric)-[:REALIZA_RUTINA]->(rutina6),  
       (eric)-[:REALIZA_RUTINA]->(rutina4), 
       (facundo)-[:REALIZA_RUTINA]->(rutina3),
       (facundo)-[:REALIZA_RUTINA]->(rutina4);

// MATCH para crear las relaciones entre eventos y etiquetas
MATCH (evento1:Evento {id: 2001}), (evento2:Evento {id: 2002}), (evento3:Evento {id: 2003}), (evento4:Evento {id: 2004}),
      (etiquetaCardio:Etiqueta {nombre: 'Cardio'}), (etiquetaYoga:Etiqueta {nombre: 'Yoga'}),
      (etiquetaFuerza:Etiqueta {nombre: 'Fuerza'}), (etiquetaFuncional:Etiqueta {nombre: 'Funcional'}),
      (etiquetaAvanzada:Etiqueta {nombre: 'Avanzada'}) 
CREATE (evento1)-[:ETIQUETADO_CON]->(etiquetaFuncional),
       (evento2)-[:ETIQUETADO_CON]->(etiquetaYoga),
       (evento3)-[:ETIQUETADO_CON]->(etiquetaCardio),
       (evento4)-[:ETIQUETADO_CON]->(etiquetaFuerza),
       (evento4)-[:ETIQUETADO_CON]->(etiquetaAvanzada); 

// MATCH para establecer que Lucas participa en el evento de yoga
MATCH (lucas:Usuario {nombreUsuario: 'lucas123'}), (evento2:Evento {id: 2002})
CREATE (lucas)-[:PARTICIPA_EN]->(evento2);


// MATCH para que Facundo participe en un evento 
MATCH (facundo:Usuario {nombreUsuario: 'facundo789'}),
      (evento1:Evento {id: 2001}),  // Evento relacionado con rutina funcional
      (evento4:Evento {id: 2004}),  // Evento relacionado con fuerza avanzada
      (evento3:Evento {id: 2003})   // Evento relacionado con maratón
CREATE (facundo)<-[:CREADO_POR]-(evento4);  // Facundo creo este evento