MATCH 
(u1:Usuario {nombreUsuario: 'lucas123'}),
(u2:Usuario {nombreUsuario: 'maia_rocks'}),
(u3:Usuario {
    nombreUsuario: 'eric99'
}),
(u4:Usuario {
    nombreUsuario: 'ramiro85'
}),
(u5:Usuario {
    nombreUsuario: 'alan_prog'
}),
(u6:Usuario {
    nombreUsuario: 'melisa_fit'
}),
(u7:Usuario {
    nombreUsuario: 'juarito22'
}),
(u8:Usuario {
    nombreUsuario: 'agustin_mtb'
}),
(u9:Usuario {
    nombreUsuario: 'matias_trek'
}),
(u10:Usuario {
    nombreUsuario: 'facu_games'
}),
(u11:Usuario {
    nombreUsuario: 'evelyn_yoga'
}),
(u12:Usuario {
    nombreUsuario: 'nicolas_swim'
}),
(u13:Usuario {
    nombreUsuario: 'sofia_runner'
}),
(u14:Usuario {
    nombreUsuario: 'martin_lifter'
}),
(u15:Usuario {
    nombreUsuario: 'luis_cyclist'
}),
(u16:Usuario {
    nombreUsuario: 'andrea_tennis'
}),
(u17:Usuario {
    nombreUsuario: 'carlos_fit'
}),
(u18:Usuario {
    nombreUsuario: 'ana_climb'
}),
(u19:Usuario {
    nombreUsuario: 'julian_marathon'
}),
(u20:Usuario {
    nombreUsuario: 'laura_gym'
})

MERGE (u1)-[:ES_AMIGO_DE]-(u2)
MERGE (u1)-[:ES_AMIGO_DE]-(u3)
MERGE (u4)-[:ES_AMIGO_DE]-(u5)
MERGE (u6)-[:ES_AMIGO_DE]-(u7)
MERGE (u8)-[:ES_AMIGO_DE]-(u9)
MERGE (u10)-[:ES_AMIGO_DE]-(u11)
MERGE (u12)-[:ES_AMIGO_DE]-(u13)
MERGE (u14)-[:ES_AMIGO_DE]-(u15)
MERGE (u16)-[:ES_AMIGO_DE]-(u17)
MERGE (u18)-[:ES_AMIGO_DE]-(u19)
MERGE (u20)-[:ES_AMIGO_DE]-(u1)

