// Asignar etiquetas a las rutinas
MATCH (r1:Rutina {nombre: 'Rutina Fuerza Básica'}), (e1:Etiqueta {nombre: 'Levantamiento de Pesas'})
CREATE (r1)-[:ETIQUETADA_CON]->(e1);

MATCH (r2:Rutina {nombre: 'Rutina Cardio Intensa'}), (e2:Etiqueta {nombre: 'Running'}), (e3:Etiqueta {nombre: 'Crossfit'})
CREATE (r2)-[:ETIQUETADA_CON]->(e2),
       (r2)-[:ETIQUETADA_CON]->(e3);

MATCH (r3:Rutina {nombre: 'Rutina Resistencia Total'}), (e4:Etiqueta {nombre: 'Ciclismo'}), (e5:Etiqueta {nombre: 'Natación'})
CREATE (r3)-[:ETIQUETADA_CON]->(e4),
       (r3)-[:ETIQUETADA_CON]->(e5);

MATCH (r4:Rutina {nombre: 'Rutina Flexibilidad Básica'}), (e6:Etiqueta {nombre: 'Yoga'})
CREATE (r4)-[:ETIQUETADA_CON]->(e6);

MATCH (r5:Rutina {nombre: 'Rutina Piernas de Acero'}), (e7:Etiqueta {nombre: 'Powerlifting'}), (e8:Etiqueta {nombre: 'Ciclismo de Montaña'})
CREATE (r5)-[:ETIQUETADA_CON]->(e7),
       (r5)-[:ETIQUETADA_CON]->(e8);

MATCH (r6:Rutina {nombre: 'Rutina Core y Abdomen'}), (e9:Etiqueta {nombre: 'Crossfit'})
CREATE (r6)-[:ETIQUETADA_CON]->(e9);

MATCH (r7:Rutina {nombre: 'Rutina de Movilidad Articular'}), (e10:Etiqueta {nombre: 'Stretching'})
CREATE (r7)-[:ETIQUETADA_CON]->(e10);

MATCH (r8:Rutina {nombre: 'Rutina de Agilidad y Coordinación'}), (e11:Etiqueta {nombre: 'Parkour'}), (e12:Etiqueta {nombre: 'Baile'})
CREATE (r8)-[:ETIQUETADA_CON]->(e11),
       (r8)-[:ETIQUETADA_CON]->(e12);

MATCH (r9:Rutina {nombre: 'Rutina de Hipertrofia Muscular'}), (e13:Etiqueta {nombre: 'Levantamiento de Pesas'})
CREATE (r9)-[:ETIQUETADA_CON]->(e13);

MATCH (r10:Rutina {nombre: 'Rutina Funcional Básica'}), (e14:Etiqueta {nombre: 'Funcional'})
CREATE (r10)-[:ETIQUETADA_CON]->(e14);

MATCH (r11:Rutina {nombre: 'Rutina HIIT Express'}), (e15:Etiqueta {nombre: 'Crossfit'}), (e16:Etiqueta {nombre: 'Running'})
CREATE (r11)-[:ETIQUETADA_CON]->(e15),
       (r11)-[:ETIQUETADA_CON]->(e16);

MATCH (r12:Rutina {nombre: 'Rutina de Acondicionamiento General'}), (e17:Etiqueta {nombre: 'Funcional'})
CREATE (r12)-[:ETIQUETADA_CON]->(e17);

MATCH (r13:Rutina {nombre: 'Rutina de Fortalecimiento del Tren Superior'}), (e18:Etiqueta {nombre: 'Levantamiento de Pesas'})
CREATE (r13)-[:ETIQUETADA_CON]->(e18);

MATCH (r14:Rutina {nombre: 'Rutina de Equilibrio y Estabilidad'}), (e19:Etiqueta {nombre: 'Yoga'})
CREATE (r14)-[:ETIQUETADA_CON]->(e19);

MATCH (r15:Rutina {nombre: 'Rutina de Potencia Explosiva'}), (e20:Etiqueta {nombre: 'Powerlifting'})
CREATE (r15)-[:ETIQUETADA_CON]->(e20);

MATCH (r16:Rutina {nombre: 'Rutina Funcional Intermedia'}), (e21:Etiqueta {nombre: 'Funcional'})
CREATE (r16)-[:ETIQUETADA_CON]->(e21);

MATCH (r17:Rutina {nombre: 'Rutina de Estiramientos Activos'}), (e22:Etiqueta {nombre: 'Stretching'})
CREATE (r17)-[:ETIQUETADA_CON]->(e22);

MATCH (r18:Rutina {nombre: 'Rutina de Core Avanzado'}), (e23:Etiqueta {nombre: 'Crossfit'})
CREATE (r18)-[:ETIQUETADA_CON]->(e23);

MATCH (r19:Rutina {nombre: 'Rutina de Resistencia Cardiovascular'}), (e24:Etiqueta {nombre: 'Running'})
CREATE (r19)-[:ETIQUETADA_CON]->(e24);

MATCH (r20:Rutina {nombre: 'Rutina de Recuperación Activa'}), (e25:Etiqueta {nombre: 'Stretching'})
CREATE (r20)-[:ETIQUETADA_CON]->(e25);
