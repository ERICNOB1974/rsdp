// Relacionar usuarios con eventos como creadores
MATCH (u1:Usuario {nombreUsuario: 'jdoe'}),
      (u2:Usuario {nombreUsuario: 'asmith'}),
      (u4:Usuario {nombreUsuario: 'lmiller'}),
      (u5:Usuario {nombreUsuario: 'cwilson'}),
      (u7:Usuario {nombreUsuario: 'mmartinez'}),
      (e1:Evento {nombre: 'Fútbol 5'}),
      (e2:Evento {nombre: 'Carrera 10K'}),
      (e3:Evento {nombre: 'Clase de Yoga'}),
      (e4:Evento {nombre: 'Torneo de Tenis'}),
      (e5:Evento {nombre: 'Maratón'})

// Crear relaciones de CREADOR_POR
CREATE
    (u1)-[:CREADO_POR]->(e1),
    (u2)-[:CREADO_POR]->(e2),
    (u4)-[:CREADO_POR]->(e3),
    (u5)-[:CREADO_POR]->(e4),
    (u7)-[:CREADO_POR]->(e5);
