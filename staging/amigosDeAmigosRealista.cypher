
MATCH (u1:Usuario {nombreUsuario: 'lucas123'}),
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
      (u20:Usuario {nombreUsuario: 'laura_gym'})


CREATE (u1)-[:ES_AMIGO_DE]->(u2),
       (u2)-[:ES_AMIGO_DE]->(u1),
       (u1)-[:ES_AMIGO_DE]->(u3),
       (u3)-[:ES_AMIGO_DE]->(u1),
       (u2)-[:ES_AMIGO_DE]->(u4),
       (u4)-[:ES_AMIGO_DE]->(u2),
       (u3)-[:ES_AMIGO_DE]->(u5),
       (u5)-[:ES_AMIGO_DE]->(u3),
       (u4)-[:ES_AMIGO_DE]->(u6),
       (u6)-[:ES_AMIGO_DE]->(u4),
       (u5)-[:ES_AMIGO_DE]->(u7),
       (u7)-[:ES_AMIGO_DE]->(u5),
       (u6)-[:ES_AMIGO_DE]->(u8),
       (u8)-[:ES_AMIGO_DE]->(u6),
       (u7)-[:ES_AMIGO_DE]->(u9),
       (u9)-[:ES_AMIGO_DE]->(u7),
       (u8)-[:ES_AMIGO_DE]->(u10),
       (u10)-[:ES_AMIGO_DE]->(u8),
       (u9)-[:ES_AMIGO_DE]->(u11),
       (u11)-[:ES_AMIGO_DE]->(u9),
       (u10)-[:ES_AMIGO_DE]->(u12),
       (u12)-[:ES_AMIGO_DE]->(u10),
       (u11)-[:ES_AMIGO_DE]->(u13),
       (u13)-[:ES_AMIGO_DE]->(u11),
       (u12)-[:ES_AMIGO_DE]->(u14),
       (u14)-[:ES_AMIGO_DE]->(u12),
       (u13)-[:ES_AMIGO_DE]->(u15),
       (u15)-[:ES_AMIGO_DE]->(u13),
       (u14)-[:ES_AMIGO_DE]->(u16),
       (u16)-[:ES_AMIGO_DE]->(u14),
       (u15)-[:ES_AMIGO_DE]->(u17),
       (u17)-[:ES_AMIGO_DE]->(u15),
       (u16)-[:ES_AMIGO_DE]->(u18),
       (u18)-[:ES_AMIGO_DE]->(u16),
       (u17)-[:ES_AMIGO_DE]->(u19),
       (u19)-[:ES_AMIGO_DE]->(u17),
       (u18)-[:ES_AMIGO_DE]->(u20),
       (u20)-[:ES_AMIGO_DE]->(u18),
       (u1)-[:ES_AMIGO_DE]->(u6),
       (u6)-[:ES_AMIGO_DE]->(u1),
       (u2)-[:ES_AMIGO_DE]->(u7),
       (u7)-[:ES_AMIGO_DE]->(u2),
       (u3)-[:ES_AMIGO_DE]->(u8),
       (u8)-[:ES_AMIGO_DE]->(u3),
       (u4)-[:ES_AMIGO_DE]->(u9),
       (u9)-[:ES_AMIGO_DE]->(u4),
       (u5)-[:ES_AMIGO_DE]->(u10),
       (u10)-[:ES_AMIGO_DE]->(u5),
       (u7)-[:ES_AMIGO_DE]->(u11),
       (u11)-[:ES_AMIGO_DE]->(u7),
       (u8)-[:ES_AMIGO_DE]->(u12),
       (u12)-[:ES_AMIGO_DE]->(u8),
       (u9)-[:ES_AMIGO_DE]->(u13),
       (u13)-[:ES_AMIGO_DE]->(u9),
       (u10)-[:ES_AMIGO_DE]->(u14),
       (u14)-[:ES_AMIGO_DE]->(u10),
       (u11)-[:ES_AMIGO_DE]->(u15),
       (u15)-[:ES_AMIGO_DE]->(u11),
       (u12)-[:ES_AMIGO_DE]->(u16),
       (u16)-[:ES_AMIGO_DE]->(u12),
       (u13)-[:ES_AMIGO_DE]->(u17),
       (u17)-[:ES_AMIGO_DE]->(u13),
       (u14)-[:ES_AMIGO_DE]->(u18),
       (u18)-[:ES_AMIGO_DE]->(u14),
       (u15)-[:ES_AMIGO_DE]->(u19),
       (u19)-[:ES_AMIGO_DE]->(u15),
       (u16)-[:ES_AMIGO_DE]->(u20),
       (u20)-[:ES_AMIGO_DE]->(u16),
       (u1)-[:ES_AMIGO_DE]->(u4),
       (u4)-[:ES_AMIGO_DE]->(u1),
       (u2)-[:ES_AMIGO_DE]->(u9),
       (u9)-[:ES_AMIGO_DE]->(u2),
       (u3)-[:ES_AMIGO_DE]->(u15),
       (u15)-[:ES_AMIGO_DE]->(u3),
       (u6)-[:ES_AMIGO_DE]->(u13),
       (u13)-[:ES_AMIGO_DE]->(u6),
       (u8)-[:ES_AMIGO_DE]->(u14),
       (u14)-[:ES_AMIGO_DE]->(u8);
