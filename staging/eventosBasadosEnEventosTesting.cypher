//RecomendacionesEventosBasadosEnEventos
MATCH (n) DETACH DELETE n;

// Crear usuarios
CREATE (lucas:Usuario {nombreUsuario: 'lucas123', nombreReal: 'Lucas Lopez', correoElectronico: 'lucas@example.com'}),
       (facundo:Usuario {nombreUsuario: 'facundo789', nombreReal: 'Facundo Sanchez', correoElectronico: 'facundo@example.com'});

// Crear eventos
CREATE (evento1:Evento {id: 2001, nombre: 'Entrenamiento funcional en el parque', fechaHora: datetime('2024-09-29T10:00:00'), descripcion: 'Entrenamiento funcional intensivo.', esPrivadoParaLaComunidad: false}),
       (evento2:Evento {id: 2002, nombre: 'Yoga al aire libre', fechaHora: datetime('2024-09-22T08:00:00'), descripcion: 'Clase de yoga al aire libre.', esPrivadoParaLaComunidad: false}),
       (evento3:Evento {id: 2003, nombre: 'Maratón de la ciudad', fechaHora: datetime('2024-10-15T09:00:00'), descripcion: 'Maratón para corredores de todos los niveles.', esPrivadoParaLaComunidad: false}),
       (evento4:Evento {id: 2004, nombre: 'Entrenamiento de fuerza avanzada', fechaHora: datetime('2024-09-25T07:00:00'), descripcion: 'Entrenamiento intensivo de fuerza avanzada.', esPrivadoParaLaComunidad: false}),
       (evento5:Evento {id: 2005, nombre: 'Cardio en la playa', fechaHora: datetime('2024-09-30T10:00:00'), descripcion: 'Sesión de cardio en la playa.', esPrivadoParaLaComunidad: false}),
       (evento6:Evento {id: 2006, nombre: 'Yoga para principiantes', fechaHora: datetime('2024-09-24T08:00:00'), descripcion: 'Clase de yoga para principiantes.', esPrivadoParaLaComunidad: false}),
       (evento7:Evento {id: 2007, nombre: 'Torneo de fuerza', fechaHora: datetime('2024-10-01T09:00:00'), descripcion: 'Competencia de fuerza en el gimnasio.', esPrivadoParaLaComunidad: false}),
       (evento8:Evento {id: 2008, nombre: 'Carrera de obstáculos', fechaHora: datetime('2024-10-10T09:00:00'), descripcion: 'Carrera de obstáculos para todos los niveles.', esPrivadoParaLaComunidad: false}),
       (evento9:Evento {id: 2009, nombre: 'Zumba en el parque', fechaHora: datetime('2024-09-28T11:00:00'), descripcion: 'Clase de Zumba al aire libre.', esPrivadoParaLaComunidad: false}),
       (evento10:Evento {id: 2010, nombre: 'Entrenamiento de circuito', fechaHora: datetime('2024-10-05T10:00:00'), descripcion: 'Entrenamiento de circuito en el gimnasio.', esPrivadoParaLaComunidad: false});

// Crear etiquetas
CREATE (etiquetaCardio:Etiqueta {nombre: 'Cardio'}),
       (etiquetaYoga:Etiqueta {nombre: 'Yoga'}),
       (etiquetaFuerza:Etiqueta {nombre: 'Fuerza'}),
       (etiquetaFuncional:Etiqueta {nombre: 'Funcional'}),
       (etiquetaAvanzada:Etiqueta {nombre: 'Avanzada'}),
       (etiquetaZumba:Etiqueta {nombre: 'Zumba'});
       
// Establecer relaciones entre eventos y etiquetas
MATCH (evento1:Evento {id: 2001}), (evento2:Evento {id: 2002}), (evento3:Evento {id: 2003}), (evento4:Evento {id: 2004}),
      (evento5:Evento {id: 2005}), (evento6:Evento {id: 2006}), (evento7:Evento {id: 2007}), (evento8:Evento {id: 2008}),
      (evento9:Evento {id: 2009}), (evento10:Evento {id: 2010}),
      (etiquetaCardio:Etiqueta {nombre: 'Cardio'}), (etiquetaYoga:Etiqueta {nombre: 'Yoga'}),
      (etiquetaFuerza:Etiqueta {nombre: 'Fuerza'}), (etiquetaFuncional:Etiqueta {nombre: 'Funcional'}),
      (etiquetaAvanzada:Etiqueta {nombre: 'Avanzada'}), (etiquetaZumba:Etiqueta {nombre: 'Zumba'})
CREATE (evento1)-[:ETIQUETADO_CON]->(etiquetaFuncional),
       (evento2)-[:ETIQUETADO_CON]->(etiquetaYoga),
       (evento2)-[:ETIQUETADO_CON]->(etiquetaZumba),
       (evento3)-[:ETIQUETADO_CON]->(etiquetaCardio),
       (evento4)-[:ETIQUETADO_CON]->(etiquetaFuerza),
       (evento4)-[:ETIQUETADO_CON]->(etiquetaAvanzada),
       (evento5)-[:ETIQUETADO_CON]->(etiquetaCardio),
       (evento5)-[:ETIQUETADO_CON]->(etiquetaFuncional),
       (evento6)-[:ETIQUETADO_CON]->(etiquetaYoga),
       (evento6)-[:ETIQUETADO_CON]->(etiquetaZumba),
       (evento7)-[:ETIQUETADO_CON]->(etiquetaFuerza),
       (evento7)-[:ETIQUETADO_CON]->(etiquetaAvanzada),
       (evento8)-[:ETIQUETADO_CON]->(etiquetaCardio),
       (evento9)-[:ETIQUETADO_CON]->(etiquetaZumba),
       (evento10)-[:ETIQUETADO_CON]->(etiquetaFuerza);

// Establecer relaciones entre usuarios y eventos
MATCH (lucas:Usuario {nombreUsuario: 'lucas123'}), 
      (facundo:Usuario {nombreUsuario: 'facundo789'}),
      (evento1:Evento {id: 2001}), (evento2:Evento {id: 2002}), (evento3:Evento {id: 2003}),
      (evento4:Evento {id: 2004}), (evento5:Evento {id: 2005}), (evento6:Evento {id: 2006}),
      (evento7:Evento {id: 2007}), (evento8:Evento {id: 2008}), (evento9:Evento {id: 2009}),
      (evento10:Evento {id: 2010})
CREATE (lucas)-[:PARTICIPA_EN]->(evento2),  // Lucas participa en Yoga
       (lucas)-[:PARTICIPA_EN]->(evento1),  // Lucas participa en Entrenamiento funcional
       (lucas)-[:PARTICIPA_EN]->(evento5),  // Lucas participa en Cardio en la playa
       (facundo)-[:PARTICIPA_EN]->(evento1), // Facundo participa en Entrenamiento funcional
       (facundo)-[:PARTICIPA_EN]->(evento4), // Facundo participa en Entrenamiento de fuerza avanzada
       (facundo)-[:PARTICIPA_EN]->(evento6); // Facundo participa en Yoga para principiantes
   