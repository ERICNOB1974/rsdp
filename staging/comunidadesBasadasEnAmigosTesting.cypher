// Borrar todo lo existente para un staging limpio
MATCH (n) DETACH DELETE n;

// Caso 1 - Sin recomendaciones para lucas123
CREATE (usuario1:Usuario {nombreUsuario: 'lucas123', nombreReal: 'Lucas', fechaNacimiento: date('1990-01-01'), fechaDeCreacion: date('2024-01-01'), correoElectronico: 'usuario1@example.com', contrasena: 'pass1', descripcion: 'Sin amigos en comunidades'}) 
CREATE (amigoDe1:Usuario {nombreUsuario: 'pedro12', nombreReal: 'Pedro', fechaNacimiento: date('1990-01-01'), fechaDeCreacion: date('2024-01-01'), correoElectronico: 'usuario1@example.com', contrasena: 'pass1', descripcion: 'Sin amigos en comunidades'}) 

CREATE (usuario1)-[:ES_AMIGO_DE]->(amigoDe1) 

CREATE (comunidad:Comunidad {nombre: 'Futbol en la playa', fechaDeCreacion: date('2022-04-01'), descripcion: '', cantidadMaximaMiembros: 50}) 

CREATE (usuario1)-[:MIEMBRO {fechaDeIngreso: date('2023-05-01')}]->(comunidad) 

// Caso 2 - Una recomendación para maia_rocks
CREATE (usuario2:Usuario {nombreUsuario: 'maia_rocks', nombreReal: 'Maia', fechaNacimiento: date('1990-02-02'), fechaDeCreacion: date('2024-02-02'), correoElectronico: 'usuario2@example.com', contrasena: 'pass2', descripcion: 'Un amigo en una comunidad'}) 

CREATE (amigo2:Usuario {nombreUsuario: 'juanchon9', nombreReal: 'Juan', fechaNacimiento: date('1990-03-03'), fechaDeCreacion: date('2024-03-03'), correoElectronico: 'amigo2@example.com', contrasena: 'pass3', descripcion: 'Amigo de usuario2'}) 

CREATE (comunidad1:Comunidad {nombre: 'Voley en la playa', fechaDeCreacion: date('2022-04-01'), descripcion: '', cantidadMaximaMiembros: 50}) 

// Relaciones para caso 2
CREATE (usuario2)-[:ES_AMIGO_DE]->(amigo2) 
CREATE (amigo2)-[:MIEMBRO {fechaDeIngreso: date('2023-05-01')}]->(comunidad1) 

// Caso 3 - Dos recomendaciones para eric99
CREATE (usuario3:Usuario {nombreUsuario: 'eric99', nombreReal: 'Eric', fechaNacimiento: date('1990-03-03'), fechaDeCreacion: date('2024-03-03'), correoElectronico: 'usuario3@example.com', contrasena: 'pass3', descripcion: 'Dos amigos en dos comunidades'}) 

CREATE (amigo3_1:Usuario {nombreUsuario: 'pedro8', nombreReal: 'Pedro', fechaNacimiento: date('1990-04-04'), fechaDeCreacion: date('2024-04-04'), correoElectronico: 'amigo3_1@example.com', contrasena: 'pass4', descripcion: 'Amigo 1 de usuario3'}) 
CREATE (amigo3_2:Usuario {nombreUsuario: 'olga19', nombreReal: 'Olga', fechaNacimiento: date('1990-05-05'), fechaDeCreacion: date('2024-05-05'), correoElectronico: 'amigo3_2@example.com', contrasena: 'pass5', descripcion: 'Amigo 2 de usuario3'}) 

CREATE (comunidad2:Comunidad {nombre: 'Running', fechaDeCreacion: date('2022-05-01'), descripcion: '', cantidadMaximaMiembros: 50}) 
CREATE (comunidad3:Comunidad {nombre: 'Estiramientos', fechaDeCreacion: date('2022-06-01'), descripcion: '', cantidadMaximaMiembros: 50}) 

// Relaciones para caso 3
CREATE (usuario3)-[:ES_AMIGO_DE]->(amigo3_1) 
CREATE (usuario3)-[:ES_AMIGO_DE]->(amigo3_2) 
CREATE (amigo3_1)-[:MIEMBRO {fechaDeIngreso: date('2023-06-01')}]->(comunidad2) 
CREATE (amigo3_2)-[:MIEMBRO {fechaDeIngreso: date('2023-07-01')}]->(comunidad3) 
CREATE (amigo3_2)-[:MIEMBRO {fechaDeIngreso: date('2023-07-01')}]->(comunidad2) 

// Caso 4 - Tres recomendaciones ordenadas por cantidad de amigos en común
CREATE (usuario4:Usuario {nombreUsuario: 'ramiro85', nombreReal: 'Ramiro', fechaNacimiento: date('1990-04-04'), fechaDeCreacion: date('2024-04-04'), correoElectronico: 'usuario4@example.com', contrasena: 'pass4', descripcion: 'Tres recomendaciones ordenadas'}) 

CREATE (amigo4_1:Usuario {nombreUsuario: 'mirta10', nombreReal: 'Mirta', fechaNacimiento: date('1990-06-06'), fechaDeCreacion: date('2024-06-06'), correoElectronico: 'amigo4_1@example.com', contrasena: 'pass6', descripcion: 'Amigo 1 de usuario4'}) 
CREATE (amigo4_2:Usuario {nombreUsuario: 'susana9', nombreReal: 'Susana', fechaNacimiento: date('1990-07-07'), fechaDeCreacion: date('2024-07-07'), correoElectronico: 'amigo4_2@example.com', contrasena: 'pass7', descripcion: 'Amigo 2 de usuario4'}) 
CREATE (amigo4_3:Usuario {nombreUsuario: 'hector11', nombreReal: 'Hector', fechaNacimiento: date('1990-08-08'), fechaDeCreacion: date('2024-08-08'), correoElectronico: 'amigo4_3@example.com', contrasena: 'pass8', descripcion: 'Amigo 3 de usuario4'}) 

CREATE (comunidad4:Comunidad {nombre: 'Yoga', fechaDeCreacion: date('2022-07-01'), descripcion: '', cantidadMaximaMiembros: 50}) 
CREATE (comunidad5:Comunidad {nombre: 'Stretching', fechaDeCreacion: date('2022-08-01'), descripcion: '', cantidadMaximaMiembros: 50}) 
CREATE (comunidad6:Comunidad {nombre: 'Pilates', fechaDeCreacion: date('2022-09-01'), descripcion: '', cantidadMaximaMiembros: 50}) 

// Relaciones para caso 4
CREATE (usuario4)-[:ES_AMIGO_DE]->(amigo4_1) 
CREATE (usuario4)-[:ES_AMIGO_DE]->(amigo4_2) 
CREATE (usuario4)-[:ES_AMIGO_DE]->(amigo4_3) 

CREATE (amigo4_1)-[:MIEMBRO {fechaDeIngreso: date('2023-08-01')}]->(comunidad4) 
CREATE (amigo4_1)-[:MIEMBRO {fechaDeIngreso: date('2023-09-01')}]->(comunidad5)
CREATE (amigo4_1)-[:MIEMBRO {fechaDeIngreso: date('2023-09-01')}]->(comunidad6) 
CREATE (amigo4_2)-[:MIEMBRO {fechaDeIngreso: date('2023-10-01')}]->(comunidad5) 
CREATE (amigo4_3)-[:MIEMBRO {fechaDeIngreso: date('2023-11-01')}]->(comunidad6) 
CREATE (amigo4_3)-[:MIEMBRO {fechaDeIngreso: date('2023-11-01')}]->(comunidad5) 
