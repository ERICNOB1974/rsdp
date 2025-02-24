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

// Crear las relaciones de CREACIÓN entre los usuarios y las comunidades con la fecha de creación tomada de la comunidad
CREATE
  (c1)-[:CREADO_POR]->(u3),
  (c2)-[:CREADO_POR]->(u2),
  (c3)-[:CREADO_POR]->(u3),
  (c4)-[:CREADO_POR]->(u9),
  (c5)-[:CREADO_POR]->(u5),
  (c6)-[:CREADO_POR]->(u6),
  (c7)-[:CREADO_POR]->(u7),
  (c8)-[:CREADO_POR]->(u3),
  (c9)-[:CREADO_POR]->(u9),
  (c10)-[:CREADO_POR]->(u18),
  (c11)-[:CREADO_POR]->(u17),
  (c12)-[:CREADO_POR]->(u17),
  (c13)-[:CREADO_POR]->(u3),
  (c14)-[:CREADO_POR]->(u6),
  (c15)-[:CREADO_POR]->(u7),
  (c16)-[:CREADO_POR]->(u16),
  (c17)-[:CREADO_POR]->(u3),
  (c18)-[:CREADO_POR]->(u18),
  (c19)-[:CREADO_POR]->(u19),
  (c20)-[:CREADO_POR]->(u20);