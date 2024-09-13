// Relacionar usuarios con eventos como participantes
MATCH (u1:Usuario {nombreUsuario: 'jdoe'}),
      (u2:Usuario {nombreUsuario: 'asmith'}),
      (u3:Usuario {nombreUsuario: 'mbrown'}),
      (u4:Usuario {nombreUsuario: 'lmiller'}),
      (u5:Usuario {nombreUsuario: 'cwilson'}),
      (e1:Evento {nombre: 'Fútbol 5'}),
      (e2:Evento {nombre: 'Carrera 10K'}),
      (e3:Evento {nombre: 'Clase de Yoga'}),
      (e4:Evento {nombre: 'Torneo de Tenis'}),
      (e5:Evento {nombre: 'Maratón'})

// Crear relaciones de PARTICIPA_EN
CREATE
    (u1)-[:PARTICIPA_EN]->(e1),
    (u2)-[:PARTICIPA_EN]->(e1),
    (u3)-[:PARTICIPA_EN]->(e1),
    (u4)-[:PARTICIPA_EN]->(e2),
    (u5)-[:PARTICIPA_EN]->(e2),
    (u1)-[:PARTICIPA_EN]->(e3),
    (u3)-[:PARTICIPA_EN]->(e3),
    (u4)-[:PARTICIPA_EN]->(e4),
    (u5)-[:PARTICIPA_EN]->(e4),
    (u2)-[:PARTICIPA_EN]->(e5),
    (u3)-[:PARTICIPA_EN]->(e5),
    (u4)-[:PARTICIPA_EN]->(e5),
    (u5)-[:PARTICIPA_EN]->(e5);
