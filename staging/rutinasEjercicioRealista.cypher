// Asignar ejercicios a las rutinas
MATCH (r1:Rutina {nombre: 'Rutina Fuerza Básica'}), (e:Ejercicio)
WHERE e.nombre IN ['Flexiones', 'Sentadillas', 'Dominadas', 'Burpees', 'Plancha', 'Press de banca', 'Remo con mancuerna', 'Peso muerto']
CREATE (r1)-[:TIENE]->(e);

MATCH (r2:Rutina {nombre: 'Rutina Cardio Intensa'}), (e:Ejercicio)
WHERE e.nombre IN ['Burpees', 'Tijeras', 'Plancha lateral', 'Zancadas', 'Plancha con levantamiento de pierna', 'Sentadillas con salto', 'Remo invertido', 'Flexiones con aplauso']
CREATE (r2)-[:TIENE]->(e);

MATCH (r3:Rutina {nombre: 'Rutina Resistencia Total'}), (e:Ejercicio)
WHERE e.nombre IN ['Sentadillas con barra', 'Remo con barra', 'Peso muerto', 'Curl de bíceps', 'Extensión de tríceps', 'Elevación de talones', 'Press militar', 'Fondos']
CREATE (r3)-[:TIENE]->(e);

MATCH (r4:Rutina {nombre: 'Rutina Flexibilidad Básica'}), (e:Ejercicio)
WHERE e.nombre IN ['Plancha', 'Elevación de piernas', 'Tijeras verticales', 'Crunches', 'Abdominales', 'Zancadas laterales', 'Plancha con elevación de pierna']
CREATE (r4)-[:TIENE]->(e);

MATCH (r5:Rutina {nombre: 'Rutina Piernas de Acero'}), (e:Ejercicio)
WHERE e.nombre IN ['Sentadillas con barra', 'Prensa de piernas', 'Zancadas con peso', 'Extensión de pierna', 'Curl de pierna', 'Sentadillas con salto', 'Elevación de talones']
CREATE (r5)-[:TIENE]->(e);

MATCH (r6:Rutina {nombre: 'Rutina Core y Abdomen'}), (e:Ejercicio)
WHERE e.nombre IN ['Plancha', 'Elevación de piernas', 'Crunches', 'Flexiones con levantamiento de pierna', 'Burpees', 'Abdominales con giro', 'Plancha lateral']
CREATE (r6)-[:TIENE]->(e);

MATCH (r7:Rutina {nombre: 'Rutina de Movilidad Articular'}), (e:Ejercicio)
WHERE e.nombre IN ['Sentadillas con kettlebell', 'Plancha con levantamiento de pierna', 'Abdominales con giro', 'Flexiones de rodillas', 'Zancadas laterales', 'Estiramientos activos', 'Tijeras', 'Plancha']
CREATE (r7)-[:TIENE]->(e);

MATCH (r8:Rutina {nombre: 'Rutina de Agilidad y Coordinación'}), (e:Ejercicio)
WHERE e.nombre IN ['Tijeras', 'Remo con mancuerna', 'Sentadillas con salto', 'Plancha dinámica', 'Flexiones con aplauso', 'Burpees', 'Zancadas con salto', 'Elevación de talones']
CREATE (r8)-[:TIENE]->(e);

MATCH (r9:Rutina {nombre: 'Rutina de Hipertrofia Muscular'}), (e:Ejercicio)
WHERE e.nombre IN ['Press de banca', 'Sentadillas con barra', 'Curl de bíceps', 'Remo con barra', 'Peso muerto', 'Extensión de tríceps', 'Fondos', 'Remo con mancuerna', 'Press militar']
CREATE (r9)-[:TIENE]->(e);

MATCH (r10:Rutina {nombre: 'Rutina Funcional Básica'}), (e:Ejercicio)
WHERE e.nombre IN ['Plancha', 'Elevación de talones', 'Sentadillas', 'Flexiones', 'Abdominales', 'Tijeras', 'Zancadas']
CREATE (r10)-[:TIENE]->(e);

MATCH (r11:Rutina {nombre: 'Rutina HIIT Express'}), (e:Ejercicio)
WHERE e.nombre IN ['Burpees', 'Plancha lateral', 'Sentadillas con salto', 'Remo con barra', 'Flexiones con aplauso', 'Plancha dinámica', 'Zancadas con salto']
CREATE (r11)-[:TIENE]->(e);

MATCH (r12:Rutina {nombre: 'Rutina de Acondicionamiento General'}), (e:Ejercicio)
WHERE e.nombre IN ['Flexiones', 'Zancadas', 'Plancha', 'Abdominales', 'Elevación de piernas', 'Sentadillas', 'Tijeras', 'Remo invertido']
CREATE (r12)-[:TIENE]->(e);

MATCH (r13:Rutina {nombre: 'Rutina de Fortalecimiento del Tren Superior'}), (e:Ejercicio)
WHERE e.nombre IN ['Press de banca', 'Remo con mancuerna', 'Curl de bíceps', 'Dominadas', 'Fondos', 'Peso muerto', 'Press militar', 'Plancha con levantamiento de pierna']
CREATE (r13)-[:TIENE]->(e);

MATCH (r14:Rutina {nombre: 'Rutina de Equilibrio y Estabilidad'}), (e:Ejercicio)
WHERE e.nombre IN ['Plancha con levantamiento de pierna', 'Zancadas', 'Sentadillas con kettlebell', 'Remo invertido', 'Elevación de talones', 'Tijeras verticales', 'Abdominales con giro', 'Estiramientos activos']
CREATE (r14)-[:TIENE]->(e);

MATCH (r15:Rutina {nombre: 'Rutina de Potencia Explosiva'}), (e:Ejercicio)
WHERE e.nombre IN ['Burpees', 'Flexiones con aplauso', 'Zancadas con salto', 'Push press', 'Sentadillas con salto', 'Dominadas', 'Press militar']
CREATE (r15)-[:TIENE]->(e);

MATCH (r16:Rutina {nombre: 'Rutina Funcional Intermedia'}), (e:Ejercicio)
WHERE e.nombre IN ['Sentadillas con kettlebell', 'Remo con barra', 'Plancha', 'Tijeras', 'Elevación de talones', 'Abdominales', 'Plancha dinámica', 'Zancadas con peso']
CREATE (r16)-[:TIENE]->(e);

MATCH (r17:Rutina {nombre: 'Rutina de Estiramientos Activos'}), (e:Ejercicio)
WHERE e.nombre IN ['Plancha', 'Tijeras', 'Abdominales', 'Elevación de talones', 'Zancadas laterales', 'Plancha con levantamiento de pierna', 'Estiramientos activos']
CREATE (r17)-[:TIENE]->(e);

MATCH (r18:Rutina {nombre: 'Rutina de Core Avanzado'}), (e:Ejercicio)
WHERE e.nombre IN ['Plancha con elevación de pierna', 'Crunches', 'Elevación de piernas', 'Flexiones', 'Abdominales', 'Plancha lateral', 'Burpees', 'Remo invertido']
CREATE (r18)-[:TIENE]->(e);

MATCH (r19:Rutina {nombre: 'Rutina de Resistencia Cardiovascular'}), (e:Ejercicio)
WHERE e.nombre IN ['Burpees', 'Plancha', 'Tijeras', 'Remo con barra', 'Sentadillas', 'Abdominales', 'Zancadas con peso', 'Remo invertido']
CREATE (r19)-[:TIENE]->(e);

MATCH (r20:Rutina {nombre: 'Rutina de Recuperación Activa'}), (e:Ejercicio)
WHERE e.nombre IN ['Plancha', 'Tijeras', 'Zancadas', 'Abdominales', 'Estiramientos activos', 'Plancha con levantamiento de pierna', 'Crunches', 'Zancadas laterales']
CREATE (r20)-[:TIENE]->(e);
