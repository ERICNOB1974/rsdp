// Relaciones PARTICIPA_EN, excluyendo a los creadores de sus propios eventos

// Usuarios y eventos
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

MATCH (e1:Evento {id: 1}),
      (e2:Evento {id: 2}),
      (e3:Evento {id: 3}),
      (e4:Evento {id: 4}),
      (e5:Evento {id: 5}),
      (e6:Evento {id: 6}),
      (e7:Evento {id: 7}),
      (e8:Evento {id: 8}),
      (e9:Evento {id: 9}),
      (e10:Evento {id: 10}),
      (e11:Evento {id: 11}),
      (e12:Evento {id: 12}),
      (e13:Evento {id: 13}),
      (e14:Evento {id: 14}),
      (e15:Evento {id: 15}),
      (e16:Evento {id: 16}),
      (e17:Evento {id: 17}),
      (e18:Evento {id: 18}),
      (e19:Evento {id: 19}),
      (e20:Evento {id: 20})

// Relaciones PARTICIPA_EN
MERGE (u1)-[:PARTICIPA_EN]->(e19) // lucas123
MERGE (u1)-[:PARTICIPA_EN]->(e3) // lucas123
MERGE (u1)-[:PARTICIPA_EN]->(e10) // lucas123
MERGE (u1)-[:PARTICIPA_EN]->(e11) // lucas123
MERGE (u1)-[:PARTICIPA_EN]->(e16) // lucas123

MERGE (u2)-[:PARTICIPA_EN]->(e1) // maia_rocks
MERGE (u2)-[:PARTICIPA_EN]->(e2) // maia_rocks
MERGE (u2)-[:PARTICIPA_EN]->(e3) // maia_rocks
MERGE (u2)-[:PARTICIPA_EN]->(e4) // maia_rocks
MERGE (u2)-[:PARTICIPA_EN]->(e5) // maia_rocks

MERGE (u3)-[:PARTICIPA_EN]->(e2) // eric99
//MERGE (u3)-[:PARTICIPA_EN]->(e3) // eric99
//MERGE (u3)-[:PARTICIPA_EN]->(e4) // eric99
//MERGE (u3)-[:PARTICIPA_EN]->(e5) // eric99

MERGE (u4)-[:PARTICIPA_EN]->(e1) // ramiro85
//MERGE (u4)-[:PARTICIPA_EN]->(e2) // ramiro85
MERGE (u4)-[:PARTICIPA_EN]->(e3) // ramiro85
MERGE (u4)-[:PARTICIPA_EN]->(e5) // ramiro85

MERGE (u5)-[:PARTICIPA_EN]->(e1) // alan_prog
//MERGE (u5)-[:PARTICIPA_EN]->(e2) // alan_prog
MERGE (u5)-[:PARTICIPA_EN]->(e3) // alan_prog
MERGE (u5)-[:PARTICIPA_EN]->(e4) // alan_prog
MERGE (u5)-[:PARTICIPA_EN]->(e8) // alan_prog
MERGE (u5)-[:PARTICIPA_EN]->(e10) // alan_prog
MERGE (u5)-[:PARTICIPA_EN]->(e11) // alan_prog



MERGE (u6)-[:PARTICIPA_EN]->(e1) // melisa_fit
//MERGE (u6)-[:PARTICIPA_EN]->(e2) // melisa_fit
MERGE (u6)-[:PARTICIPA_EN]->(e3) // melisa_fit
MERGE (u6)-[:PARTICIPA_EN]->(e4) // melisa_fit
MERGE (u6)-[:PARTICIPA_EN]->(e5) // melisa_fit

MERGE (u7)-[:PARTICIPA_EN]->(e1) // juarito22
//MERGE (u7)-[:PARTICIPA_EN]->(e2) // juarito22
MERGE (u7)-[:PARTICIPA_EN]->(e3) // juarito22
MERGE (u7)-[:PARTICIPA_EN]->(e4) // juarito22
MERGE (u7)-[:PARTICIPA_EN]->(e5) // juarito22

MERGE (u8)-[:PARTICIPA_EN]->(e1) // agustin_mtb
//MERGE (u8)-[:PARTICIPA_EN]->(e2) // agustin_mtb
MERGE (u8)-[:PARTICIPA_EN]->(e3) // agustin_mtb
MERGE (u8)-[:PARTICIPA_EN]->(e4) // agustin_mtb
MERGE (u8)-[:PARTICIPA_EN]->(e5) // agustin_mtb

MERGE (u9)-[:PARTICIPA_EN]->(e1) // matias_trek
MERGE (u9)-[:PARTICIPA_EN]->(e3) // matias_trek
MERGE (u9)-[:PARTICIPA_EN]->(e4) // matias_trek
MERGE (u9)-[:PARTICIPA_EN]->(e5) // matias_trek
MERGE (u9)-[:PARTICIPA_EN]->(e8) // matias_trek
MERGE (u9)-[:PARTICIPA_EN]->(e10) // matias_trek



MERGE (u10)-[:PARTICIPA_EN]->(e1) // facu_games
//MERGE (u10)-[:PARTICIPA_EN]->(e2) // facu_games
MERGE (u10)-[:PARTICIPA_EN]->(e3) // facu_games
MERGE (u10)-[:PARTICIPA_EN]->(e4) // facu_games
MERGE (u10)-[:PARTICIPA_EN]->(e5) // facu_games
MERGE (u10)-[:PARTICIPA_EN]->(e10) // facu_games
MERGE (u10)-[:PARTICIPA_EN]->(e11) // facu_games


MERGE (u11)-[:PARTICIPA_EN]->(e1) // evelyn_yoga
//MERGE (u11)-[:PARTICIPA_EN]->(e2) // evelyn_yoga
MERGE (u11)-[:PARTICIPA_EN]->(e3) // evelyn_yoga
MERGE (u11)-[:PARTICIPA_EN]->(e4) // evelyn_yoga
MERGE (u11)-[:PARTICIPA_EN]->(e5) // evelyn_yoga

MERGE (u12)-[:PARTICIPA_EN]->(e1) // nicolas_swim
//MERGE (u12)-[:PARTICIPA_EN]->(e2) // nicolas_swim
MERGE (u12)-[:PARTICIPA_EN]->(e3) // nicolas_swim
MERGE (u12)-[:PARTICIPA_EN]->(e4) // nicolas_swim
MERGE (u12)-[:PARTICIPA_EN]->(e5) // nicolas_swim

MERGE (u13)-[:PARTICIPA_EN]->(e1) // sofia_runner
//MERGE (u13)-[:PARTICIPA_EN]->(e2) // sofia_runner
MERGE (u13)-[:PARTICIPA_EN]->(e3) // sofia_runner
MERGE (u13)-[:PARTICIPA_EN]->(e4) // sofia_runner
MERGE (u13)-[:PARTICIPA_EN]->(e5) // sofia_runner
MERGE (u13)-[:PARTICIPA_EN]->(e8) // sofia_runner


MERGE (u14)-[:PARTICIPA_EN]->(e1) // martin_lifter
//MERGE (u14)-[:PARTICIPA_EN]->(e2) // martin_lifter
MERGE (u14)-[:PARTICIPA_EN]->(e3) // martin_lifter
MERGE (u14)-[:PARTICIPA_EN]->(e4) // martin_lifter
MERGE (u14)-[:PARTICIPA_EN]->(e5) // martin_lifter

MERGE (u15)-[:PARTICIPA_EN]->(e1) // luis_cyclist
//MERGE (u15)-[:PARTICIPA_EN]->(e2) // luis_cyclist
MERGE (u15)-[:PARTICIPA_EN]->(e3) // luis_cyclist
MERGE (u15)-[:PARTICIPA_EN]->(e4) // luis_cyclist
MERGE (u15)-[:PARTICIPA_EN]->(e5) // luis_cyclist

MERGE (u16)-[:PARTICIPA_EN]->(e1) // andrea_tennis
//MERGE (u16)-[:PARTICIPA_EN]->(e2) // andrea_tennis
MERGE (u16)-[:PARTICIPA_EN]->(e3) // andrea_tennis
MERGE (u16)-[:PARTICIPA_EN]->(e4) // andrea_tennis
MERGE (u16)-[:PARTICIPA_EN]->(e5) // andrea_tennis

MERGE (u17)-[:PARTICIPA_EN]->(e1) // carlos_fit
//MERGE (u17)-[:PARTICIPA_EN]->(e2) // carlos_fit
MERGE (u17)-[:PARTICIPA_EN]->(e3) // carlos_fit
MERGE (u17)-[:PARTICIPA_EN]->(e4) // carlos_fit
MERGE (u17)-[:PARTICIPA_EN]->(e5) // carlos_fit

MERGE (u18)-[:PARTICIPA_EN]->(e1) // ana_climb
//MERGE (u18)-[:PARTICIPA_EN]->(e2) // ana_climb
MERGE (u18)-[:PARTICIPA_EN]->(e3) // ana_climb
MERGE (u18)-[:PARTICIPA_EN]->(e4) // ana_climb
MERGE (u18)-[:PARTICIPA_EN]->(e5) // ana_climb

MERGE (u19)-[:PARTICIPA_EN]->(e1) // julian_marathon
//MERGE (u19)-[:PARTICIPA_EN]->(e2) // julian_marathon
MERGE (u19)-[:PARTICIPA_EN]->(e3) // julian_marathon
MERGE (u19)-[:PARTICIPA_EN]->(e4) // julian_marathon
MERGE (u19)-[:PARTICIPA_EN]->(e5) // julian_marathon

MERGE (u20)-[:PARTICIPA_EN]->(e1) // laura_gym
//MERGE (u20)-[:PARTICIPA_EN]->(e2) // laura_gym
MERGE (u20)-[:PARTICIPA_EN]->(e3) // laura_gym
MERGE (u20)-[:PARTICIPA_EN]->(e4) // laura_gym
MERGE (u20)-[:PARTICIPA_EN]->(e5) // laura_gym
