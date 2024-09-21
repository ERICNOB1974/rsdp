MATCH 
(lucas:Usuario {nombreUsuario: 'lucas123'}),
(maia:Usuario {nombreUsuario: 'maia_rocks'}),
(eric:Usuario {
    nombreUsuario: 'eric99'
}),
(ramiro:Usuario {
    nombreUsuario: 'ramiro85'
}),
(alan:Usuario {
    nombreUsuario: 'alan_prog'
}),
(melisa:Usuario {
    nombreUsuario: 'melisa_fit'
}),
(juarito:Usuario {
    nombreUsuario: 'juarito22'
}),
(agustin:Usuario {
    nombreUsuario: 'agustin_mtb'
}),
(matias:Usuario {
    nombreUsuario: 'matias_trek'
}),
(facundo:Usuario {
    nombreUsuario: 'facu_games'
}),
(evelyn:Usuario {
    nombreUsuario: 'evelyn_yoga'
}),
(nicolas:Usuario {
    nombreUsuario: 'nicolas_swim'
}),
(sofia:Usuario {
    nombreUsuario: 'sofia_runner'
}),
(martin:Usuario {
    nombreUsuario: 'martin_lifter'
}),
(luis:Usuario {
    nombreUsuario: 'luis_cyclist'
}),
(andrea:Usuario {
    nombreUsuario: 'andrea_tennis'
}),
(carlos:Usuario {
    nombreUsuario: 'carlos_fit'
}),
(ana:Usuario {
    nombreUsuario: 'ana_climb'
}),
(julian:Usuario {
    nombreUsuario: 'julian_marathon'
}),
(laura:Usuario {
    nombreUsuario: 'laura_gym'
})

MERGE (lucas)-[:ES_AMIGO_DE]->(eric)
MERGE (lucas)<-[:ES_AMIGO_DE]-(eric)
MERGE (lucas)-[:ES_AMIGO_DE]->(facundo)
MERGE (lucas)<-[:ES_AMIGO_DE]-(facundo)
MERGE (lucas)-[:ES_AMIGO_DE]->(alan)
MERGE (lucas)<-[:ES_AMIGO_DE]-(alan)
MERGE (lucas)-[:ES_AMIGO_DE]->(maia)
MERGE (lucas)<-[:ES_AMIGO_DE]-(maia)
MERGE (lucas)-[:ES_AMIGO_DE]->(melisa)
MERGE (lucas)<-[:ES_AMIGO_DE]-(melisa)

MERGE (ramiro)-[:ES_AMIGO_DE]->(facundo)
MERGE (ramiro)<-[:ES_AMIGO_DE]-(facundo)
MERGE (ramiro)-[:ES_AMIGO_DE]->(eric)
MERGE (ramiro)<-[:ES_AMIGO_DE]-(eric)
MERGE (ramiro)-[:ES_AMIGO_DE]->(alan)
MERGE (ramiro)<-[:ES_AMIGO_DE]-(alan)

MERGE (matias)-[:ES_AMIGO_DE]->(melisa)
MERGE (matias)<-[:ES_AMIGO_DE]-(melisa)
MERGE (matias)-[:ES_AMIGO_DE]->(alan)
MERGE (matias)<-[:ES_AMIGO_DE]-(alan)

MERGE (agustin)-[:ES_AMIGO_DE]->(alan)
MERGE (agustin)<-[:ES_AMIGO_DE]-(alan)
MERGE (agustin)-[:ES_AMIGO_DE]->(facundo)
MERGE (agustin)<-[:ES_AMIGO_DE]-(facundo)

MERGE (juarito)-[:ES_AMIGO_DE]->(facundo)
MERGE (juarito)<-[:ES_AMIGO_DE]-(facundo)
MERGE (juarito)-[:ES_AMIGO_DE]->(maia)
MERGE (juarito)<-[:ES_AMIGO_DE]-(maia)
MERGE (juarito)-[:ES_AMIGO_DE]->(melisa)
MERGE (juarito)<-[:ES_AMIGO_DE]-(melisa)

MERGE (evelyn)-[:ES_AMIGO_DE]->(alan)
MERGE (evelyn)<-[:ES_AMIGO_DE]-(alan)

MERGE (nicolas)-[:ES_AMIGO_DE]->(evelyn)
MERGE (nicolas)<-[:ES_AMIGO_DE]-(evelyn)
MERGE (nicolas)-[:ES_AMIGO_DE]->(agustin)
MERGE (nicolas)<-[:ES_AMIGO_DE]-(agustin)

MERGE (carlos)-[:ES_AMIGO_DE]->(evelyn)
MERGE (carlos)<-[:ES_AMIGO_DE]-(evelyn)
MERGE (carlos)-[:ES_AMIGO_DE]->(agustin)
MERGE (carlos)<-[:ES_AMIGO_DE]-(agustin)

MERGE (sofia)-[:ES_AMIGO_DE]->(evelyn)
MERGE (sofia)<-[:ES_AMIGO_DE]-(evelyn)
MERGE (sofia)-[:ES_AMIGO_DE]->(agustin)
MERGE (sofia)<-[:ES_AMIGO_DE]-(agustin)

MERGE (martin)-[:ES_AMIGO_DE]->(nicolas)
MERGE (martin)<-[:ES_AMIGO_DE]-(nicolas)
MERGE (martin)-[:ES_AMIGO_DE]->(carlos)
MERGE (martin)<-[:ES_AMIGO_DE]-(carlos)

MERGE (andrea)-[:ES_AMIGO_DE]->(luis)
MERGE (andrea)<-[:ES_AMIGO_DE]-(luis)

MERGE (ana)-[:ES_AMIGO_DE]->(matias)
MERGE (ana)<-[:ES_AMIGO_DE]-(matias)

