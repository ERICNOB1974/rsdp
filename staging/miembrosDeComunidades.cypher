// MATCH de los usuarios
MATCH 
  (u1:Usuario {nombreUsuario: 'lucas123'}),
  (u2:Usuario {nombreUsuario: 'maia_rocks'}),
  (u3:Usuario {nombreUsuario: 'eric99'}),
  (u4:Usuario {nombreUsuario: 'ramiro85'}),
  (u5:Usuario {nombreUsuario: 'alan_prog'}),
  (u6:Usuario {nombreUsuario: 'melisa_fit'}),
  (u7:Usuario {nombreUsuario: 'juarito22'}),
  (u8:Usuario {nombreUsuario: 'agustin_mtb'}),
  (u9:Usuario {nombreUsuario: 'matias_trek'}),
  (u10:Usuario {nombreUsuario: 'facu_games'}),
  (u11:Usuario {nombreUsuario: 'evelyn_yoga'}),
  (u12:Usuario {nombreUsuario: 'nicolas_swim'}),
  (u13:Usuario {nombreUsuario: 'sofia_runner'}),
  (u14:Usuario {nombreUsuario: 'martin_lifter'}),
  (u15:Usuario {nombreUsuario: 'luis_cyclist'}),
  (u16:Usuario {nombreUsuario: 'andrea_tennis'}),
  (u17:Usuario {nombreUsuario: 'carlos_fit'}),
  (u18:Usuario {nombreUsuario: 'ana_climb'}),
  (u19:Usuario {nombreUsuario: 'julian_marathon'}),
  (u20:Usuario {nombreUsuario: 'laura_gym'}),

// MATCH de las comunidades
  (c1:Comunidad {nombre: 'Amantes del Running'}),
  (c2:Comunidad {nombre: 'Ciclistas Urbanos'}),
  (c3:Comunidad {nombre: 'Escaladores Expertos'}),
  (c4:Comunidad {nombre: 'Futboleros Unidos'}),
  (c5:Comunidad {nombre: 'Caminatas y Senderismo'}),
  (c6:Comunidad {nombre: 'Entrenamiento Funcional'}),
  (c7:Comunidad {nombre: 'Aficionados al Tenis'}),
  (c8:Comunidad {nombre: 'Triatlón Challenge'}),
  (c9:Comunidad {nombre: 'Yoga y Meditación'}),
  (c10:Comunidad {nombre: 'Ciclistas de Montaña'}),
  (c11:Comunidad {nombre: 'Crossfit Warriors'}),
  (c12:Comunidad {nombre: 'Atletas del Parque'}),
  (c13:Comunidad {nombre: 'Fútbol Femenino'}),
  (c14:Comunidad {nombre: 'Natación de Alto Rendimiento'}),
  (c15:Comunidad {nombre: 'Amantes del Paddle'}),
  (c16:Comunidad {nombre: 'Escalada y Aventura'}),
  (c17:Comunidad {nombre: 'Senderismo en Familia'}),
  (c18:Comunidad {nombre: 'Maratones del Mundo'}),
  (c19:Comunidad {nombre: 'Básquet 3x3'}),
  (c20:Comunidad {nombre: 'Surf y Deportes Acuáticos'})

// Crear las relaciones de MIEMBRO entre los usuarios y las comunidades
CREATE
  (u1)-[:MIEMBRO]->(c1),
  (u1)-[:MIEMBRO]->(c2),
  (u1)-[:MIEMBRO]->(c6),
  (u1)-[:MIEMBRO]->(c10),

  (u2)-[:MIEMBRO]->(c3),
  (u2)-[:MIEMBRO]->(c4),
  (u2)-[:MIEMBRO]->(c11),

  
  (u3)-[:MIEMBRO]->(c5),
  (u3)-[:MIEMBRO]->(c6),
  (u3)-[:MIEMBRO]->(c19),
  (u3)-[:MIEMBRO]->(c14),

  
  (u4)-[:MIEMBRO]->(c7),
  (u4)-[:MIEMBRO]->(c8),
  (u4)-[:MIEMBRO]->(c1),

  
  (u5)-[:MIEMBRO]->(c9),
  (u5)-[:MIEMBRO]->(c10),
  (u5)-[:MIEMBRO]->(c17),

  
  (u6)-[:MIEMBRO]->(c11),
  (u6)-[:MIEMBRO]->(c12),
  (u6)-[:MIEMBRO]->(c2),

  
  (u7)-[:MIEMBRO]->(c13),
  (u7)-[:MIEMBRO]->(c14),
  (u7)-[:MIEMBRO]->(c11),

  
  (u8)-[:MIEMBRO]->(c15),
  (u8)-[:MIEMBRO]->(c16),
  
  (u9)-[:MIEMBRO]->(c17),
  (u9)-[:MIEMBRO]->(c18),
  
  (u10)-[:MIEMBRO]->(c19),
  (u10)-[:MIEMBRO]->(c20),
  
  (u11)-[:MIEMBRO]->(c1),
  (u11)-[:MIEMBRO]->(c10),
  (u11)-[:MIEMBRO]->(c3),
  
  (u12)-[:MIEMBRO]->(c2),
  (u12)-[:MIEMBRO]->(c4),
  (u12)-[:MIEMBRO]->(c16),

  
  (u13)-[:MIEMBRO]->(c5),
  (u13)-[:MIEMBRO]->(c6),
  
  (u14)-[:MIEMBRO]->(c7),
  (u14)-[:MIEMBRO]->(c8),
  (u14)-[:MIEMBRO]->(c16),

  
  (u15)-[:MIEMBRO]->(c9),
  (u15)-[:MIEMBRO]->(c10),
  
  (u16)-[:MIEMBRO]->(c11),
  (u16)-[:MIEMBRO]->(c12),
  
  (u17)-[:MIEMBRO]->(c13),
  (u17)-[:MIEMBRO]->(c14),
  
  (u18)-[:MIEMBRO]->(c15),
  (u18)-[:MIEMBRO]->(c16),
  
  (u19)-[:MIEMBRO]->(c17),
  (u19)-[:MIEMBRO]->(c18),
  
  (u20)-[:MIEMBRO]->(c19),
  (u20)-[:MIEMBRO]->(c20);
