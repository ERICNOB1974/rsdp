MATCH (n) DETACH DELETE n;

// Crear etiquetas
CREATE (e1:Etiqueta {nombre: 'Cardio'})
CREATE (e2:Etiqueta {nombre: 'Fuerza'})
CREATE (e3:Etiqueta {nombre: 'Resistencia'})
CREATE (e4:Etiqueta {nombre: 'Flexibilidad'})
CREATE (e5:Etiqueta {nombre: 'HIIT'})
CREATE (e6:Etiqueta {nombre: 'Torso Superior'})

// Crear rutinas con etiquetas
CREATE (r1:Rutina {nombre: 'Rutina Cardio', descripcion: 'Mejora tu cardio', duracionMinutosPorDia: 30})
CREATE (r2:Rutina {nombre: 'Rutina Fuerza', descripcion: 'Entrenamiento de fuerza', duracionMinutosPorDia: 45})
CREATE (r3:Rutina {nombre: 'Rutina Resistencia', descripcion: 'Mejora tu resistencia', duracionMinutosPorDia: 40})
CREATE (r5:Rutina {nombre: 'Rutina Flexibilidad', descripcion: 'Mejora tu flexibilidad', duracionMinutosPorDia: 35})
CREATE (r9:Rutina {nombre: 'Rutina Torso Superior', descripcion: 'Tonificar Torso Superior', duracionMinutosPorDia: 45})

// Asociar etiquetas a rutinas
CREATE (r1)-[:ETIQUETADA_CON]->(e1)
CREATE (r2)-[:ETIQUETADA_CON]->(e2)
CREATE (r3)-[:ETIQUETADA_CON]->(e3)
CREATE (r5)-[:ETIQUETADA_CON]->(e4)
CREATE (r9)-[:ETIQUETADA_CON]->(e6)

//Caso sin sugerencias y caso tres sugerencias
CREATE (u1:Usuario {nombreUsuario: 'lucas123', nombreReal: 'Usuario Sin Rutinas', correoElectronico: 'sin.rutinas@example.com', contrasena: 'pass123'})
CREATE (u1)-[:REALIZA_RUTINA {fechaDeComienzo: date('2024-03-01'), fechaDeFin: date('2024-03-10')}]->(r5)  

CREATE (u4:Usuario {nombreUsuario: 'eric99', nombreReal: 'Usuario 3 Rutinas', correoElectronico: '3.rutinas@example.com', contrasena: 'pass123'})
CREATE (u4)-[:REALIZA_RUTINA {fechaDeComienzo: date('2024-01-01'), fechaDeFin: date('2024-01-10')}]->(r1)  
CREATE (u4)-[:REALIZA_RUTINA {fechaDeComienzo: date('2024-02-01'), fechaDeFin: date('2024-02-10')}]->(r2) 
CREATE (u4)-[:REALIZA_RUTINA {fechaDeComienzo: date('2024-03-01'), fechaDeFin: date('2024-03-10')}]->(r3)  
CREATE (u4)-[:REALIZA_RUTINA {fechaDeComienzo: date('2024-03-01'), fechaDeFin: date('2024-03-10')}]->(r9) 

// Crear nuevas rutinas para recomendaciones
CREATE (r6:Rutina {nombre: 'Rutina de Resistencia Avanzada', descripcion: 'Resistencia avanzada', duracionMinutosPorDia: 50})
CREATE (r7:Rutina {nombre: 'Rutina HIIT Extrema', descripcion: 'Entrenamiento extremo', duracionMinutosPorDia: 25})
CREATE (r8:Rutina {nombre: 'Rutina Cardio Pro', descripcion: 'Cardio para expertos', duracionMinutosPorDia: 35})

// Asociar etiquetas a nuevas rutinas
CREATE (r6)-[:ETIQUETADA_CON]->(e3)  // Resistencia
CREATE (r7)-[:ETIQUETADA_CON]->(e5)  // HIIT
CREATE (r7)-[:ETIQUETADA_CON]->(e1)  // Cardio
CREATE (r8)-[:ETIQUETADA_CON]->(e1)  // Cardio
CREATE (r8)-[:ETIQUETADA_CON]->(e2)  // Fuerza
CREATE (r8)-[:ETIQUETADA_CON]->(e6) 
CREATE (r6)-[:ETIQUETADA_CON]->(e6) 



//Caso una sugerencia
CREATE (u10:Usuario {nombreUsuario: 'facu_games', nombreReal: 'Facundo', correoElectronico: 'facundo@example.com', contrasena: 'pass123'})
CREATE (r10:Rutina {nombre: 'Rutina para tonificar abdomen', descripcion: 'Tonificar abdomen', duracionMinutosPorDia: 50})
CREATE (u10)-[:REALIZA_RUTINA {fechaDeComienzo: date('2024-01-01'), fechaDeFin: date('2024-01-10')}]->(r10)  

CREATE (e10:Etiqueta {nombre: 'Abdomen'})
CREATE (r10)-[:ETIQUETADA_CON]->(e10) 

CREATE (r11:Rutina {nombre: 'Rutina para perder grasa', descripcion: 'Grasa', duracionMinutosPorDia: 50})
CREATE (r11)-[:ETIQUETADA_CON]->(e10)

//Caso dos sugerencias

CREATE (u12:Usuario {nombreUsuario: 'evelyn_yoga', nombreReal: 'Evelyn', correoElectronico: 'evelyn@example.com', contrasena: 'pass123'})
CREATE (r12:Rutina {nombre: 'Rutina para tonificar cuadriceps', descripcion: 'Tonificar cuadriceps', duracionMinutosPorDia: 50})
CREATE (u12)-[:REALIZA_RUTINA {fechaDeComienzo: date('2024-01-01'), fechaDeFin: date('2024-01-10')}]->(r12)  

CREATE (e11:Etiqueta {nombre: 'Pierna'})
CREATE (r12)-[:ETIQUETADA_CON]->(e11) 
CREATE (e12:Etiqueta {nombre: 'Tonificacion'})
CREATE (r12)-[:ETIQUETADA_CON]->(e12)

CREATE (r13:Rutina {nombre: 'Rutina para tonificar gemelos', descripcion: 'Tonificar gemelos', duracionMinutosPorDia: 50})
CREATE (r13)-[:ETIQUETADA_CON]->(e11)
CREATE (r13)-[:ETIQUETADA_CON]->(e12)  

CREATE (r14:Rutina {nombre: 'Rutina para prevenir lesiones en los isquiotibiales', descripcion: 'Prevenir lesiones', duracionMinutosPorDia: 50})
CREATE (r14)-[:ETIQUETADA_CON]->(e11)
