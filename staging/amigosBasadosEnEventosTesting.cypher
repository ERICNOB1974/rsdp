// Borrar todos los nodos previos
MATCH (n) DETACH DELETE n;

//Caso vacio y de tres sugerencias

// Crear usuarios
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

//Caso una sugerencia

CREATE (u6:Usuario {nombreUsuario: 'alan_prog', nombreReal: 'Alan', correoElectronico: 'alan@example.com', contrasena: 'pass123'}) 
CREATE (u7:Usuario {nombreUsuario: 'melisa_fit', nombreReal: 'Melisa', correoElectronico: 'melisa@example.com', contrasena: 'pass123'}) 

CREATE (evento6:Evento {nombre: 'Stretching en la playa', descripcion: 'Sexto evento', fechaDeCreacion: date('2024-09-01'), cantidadMaximaParticipantes: 10}) 
CREATE (evento7:Evento {nombre: 'Yoga en la playa', descripcion: 'Septimo evento', fechaDeCreacion: date('2024-09-02'), cantidadMaximaParticipantes: 10}) 

CREATE (u6)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento6) 
CREATE (u6)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento7) 
CREATE (u7)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento6) 
CREATE (u7)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento7)

//Caso dos sugerencias

CREATE (u8:Usuario {nombreUsuario: 'juarito22', nombreReal: 'Juarito', correoElectronico: 'juarito@example.com', contrasena: 'pass123'}) 
CREATE (u9:Usuario {nombreUsuario: 'agustin_mtb', nombreReal: 'Agustin', correoElectronico: 'agustin@example.com', contrasena: 'pass123'}) 
CREATE (u10:Usuario {nombreUsuario: 'matias_trek', nombreReal: 'Matias', correoElectronico: 'matias@example.com', contrasena: 'pass123'}) 

CREATE (evento8:Evento {nombre: 'Kayak en la playa', descripcion: 'Octavo evento', fechaDeCreacion: date('2024-09-01'), cantidadMaximaParticipantes: 10}) 
CREATE (evento9:Evento {nombre: 'Snorkel en la playa', descripcion: 'Noveno evento', fechaDeCreacion: date('2024-09-02'), cantidadMaximaParticipantes: 10})
CREATE (evento10:Evento {nombre: 'Kitesurf en la playa', descripcion: 'Decimo evento', fechaDeCreacion: date('2024-09-02'), cantidadMaximaParticipantes: 10}) 

CREATE (u8)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento8) 
CREATE (u8)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento9) 
CREATE (u8)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento10) 
CREATE (u9)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento8) 
CREATE (u9)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento9) 
CREATE (u9)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento10)
CREATE (u10)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento8) 
CREATE (u10)-[:PARTICIPA_EN {fechaDeInscripcion: date('2024-09-03')}]->(evento9)  
