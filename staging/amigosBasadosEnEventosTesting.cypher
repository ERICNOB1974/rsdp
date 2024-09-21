// Borrar todos los nodos previos
MATCH (n) DETACH DELETE n;

// Crear usuarios para los diferentes casos
CREATE (u1:Usuario {nombreUsuario: 'lucas123', nombreReal: 'Lucas', correoElectronico: 'lucas@example.com', contrasena: 'pass123'}) 
CREATE (u2:Usuario {nombreUsuario: 'maia_rocks', nombreReal: 'Maia', correoElectronico: 'maia@example.com', contrasena: 'pass123'}) 
CREATE (u3:Usuario {nombreUsuario: 'ramiro85', nombreReal: 'Ramiro', correoElectronico: 'ramiro@example.com', contrasena: 'pass123'}) 
CREATE (u4:Usuario {nombreUsuario: 'eric99', nombreReal: 'Eric', correoElectronico: 'eric@example.com', contrasena: 'pass123'}) 
CREATE (u5:Usuario {nombreUsuario: 'evelyn_yoga', nombreReal: 'Evelyn', correoElectronico: 'evelun@example.com', contrasena: 'pass123'}) 

// Crear eventos
CREATE (evento1:Evento {nombre: 'Futbol en la rambla', descripcion: 'Primer evento', fechaDeCreacion: date('2024-09-01'), cantidadMaximaParticipantes: 10}) 
CREATE (evento2:Evento {nombre: 'Rugby en la playa', descripcion: 'Segundo evento', fechaDeCreacion: date('2024-09-02'), cantidadMaximaParticipantes: 10}) 
CREATE (evento3:Evento {nombre: 'Yoga en la playa', descripcion: 'Tercer evento', fechaDeCreacion: date('2024-09-03'), cantidadMaximaParticipantes: 10}) 
CREATE (evento4:Evento {nombre: 'Estiramientos en la playa', descripcion: 'Cuarto evento', fechaDeCreacion: date('2024-09-04'), cantidadMaximaParticipantes: 10}) 
CREATE (evento5:Evento {nombre: 'Caminata por la orilla del mar', descripcion: 'Quinto evento', fechaDeCreacion: date('2024-09-04'), cantidadMaximaParticipantes: 10}) 

CREATE (u1)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-01')}]->(evento1) 
CREATE (u1)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento2) 
CREATE (u1)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento3) 

CREATE (u4)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento3) 
CREATE (u4)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento4) 
CREATE (u4)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento5) 

CREATE (u2)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-01')}]->(evento1) 
CREATE (u2)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-02')}]->(evento2)  
CREATE (u2)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento3) 
CREATE (u2)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento4) 

CREATE (u3)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-01')}]->(evento1) 
CREATE (u3)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-02')}]->(evento2) 
CREATE (u3)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento3) 
CREATE (u3)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento4) 

CREATE (u5)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento5) 
