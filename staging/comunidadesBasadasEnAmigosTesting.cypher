//RecomendacionesCommunidadesBasadasEnAmigos
MATCH (n)
DETACH DELETE n;

CREATE (c1:Comunidad { nombre: "Ciclistas de Montaña de Madryn", fechaDeCreacion: date("2021-01-02"), descripcion: "Rutas largas para ciclistas", cantidadMaximaMiembros: 51, esPrivada: false , latitud: -42.76442823854689, longitud: -65.03365087594793 }),
(c2:Comunidad { nombre: "Corredores de Ruta de Comodoro", fechaDeCreacion: date("2020-05-15"), descripcion: "Grupo para aficionados al running", cantidadMaximaMiembros: 100, esPrivada: false , latitud: -45.8397063939941, longitud: -67.47694735091086 }),
(c3:Comunidad { nombre: "Nadadores Urbanos de Bahia Blanca", fechaDeCreacion: date("2019-08-20"), descripcion: "Entrenamientos en piscinas y ríos", cantidadMaximaMiembros: 30, esPrivada: true , latitud: -38.71450381606208, longitud: -62.265303322668416 }),
(c4:Comunidad { nombre: "Escaladores de Montaña de Jujuy", fechaDeCreacion: date("2021-03-10"), descripcion: "Aventuras en escalada", cantidadMaximaMiembros: 25, esPrivada: false , latitud: -22.108040819161882, longitud: -65.59842140253284 })

CREATE
(lucas:Usuario { nombreUsuario: 'lucas', nombreReal: 'Lucas', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(juan:Usuario { nombreUsuario: 'juan', nombreReal: 'Juan', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(marcos:Usuario { nombreUsuario: 'marcos', nombreReal: 'Marcos', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(joaquin:Usuario { nombreUsuario: 'joaquin', nombreReal: 'Joaquin', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(pedro:Usuario { nombreUsuario: 'pedro', nombreReal: 'Pedro', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(patricia:Usuario { nombreUsuario: 'patricia', nombreReal: 'Patricia', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(martin:Usuario { nombreUsuario: 'martin', nombreReal: 'Martín', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(diego:Usuario { nombreUsuario: 'diego', nombreReal: 'Diego', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(ana:Usuario { nombreUsuario: 'ana', nombreReal: 'Ana', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(eric:Usuario { nombreUsuario: 'eric', nombreReal: 'Eric', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(lucia:Usuario { nombreUsuario: 'lucia', nombreReal: 'Lucia', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(hector:Usuario { nombreUsuario: 'hector', nombreReal: 'Hector', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(olga:Usuario { nombreUsuario: 'olga', nombreReal: 'Olga', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(maria:Usuario { nombreUsuario: 'maria', nombreReal: 'Maria', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(marta:Usuario { nombreUsuario: 'marta', nombreReal: 'Marta' , latitud: -42.762555975850084,
longitud: -65.04467329781565})

MERGE (lucas)-[:ES_AMIGO_DE]->(juan)
MERGE (lucas)<-[:ES_AMIGO_DE]-(juan)
MERGE (lucas)-[:ES_AMIGO_DE]->(marcos)
MERGE (lucas)<-[:ES_AMIGO_DE]-(marcos)
MERGE (lucas)-[:ES_AMIGO_DE]->(joaquin)
MERGE (lucas)<-[:ES_AMIGO_DE]-(joaquin)
MERGE (lucas)-[:ES_AMIGO_DE]->(pedro)
MERGE (lucas)<-[:ES_AMIGO_DE]-(pedro)
MERGE (lucas)-[:ES_AMIGO_DE]->(patricia)
MERGE (lucas)<-[:ES_AMIGO_DE]-(patricia)
MERGE (lucas)-[:ES_AMIGO_DE]->(martin)
MERGE (lucas)<-[:ES_AMIGO_DE]-(martin)
MERGE (lucas)-[:ES_AMIGO_DE]->(diego)
MERGE (lucas)<-[:ES_AMIGO_DE]-(diego)
MERGE (lucas)-[:ES_AMIGO_DE]->(ana)
MERGE (lucas)<-[:ES_AMIGO_DE]-(ana)
MERGE (lucas)-[:ES_AMIGO_DE]->(eric)
MERGE (lucas)<-[:ES_AMIGO_DE]-(eric)
MERGE (lucas)-[:ES_AMIGO_DE]->(lucia)
MERGE (lucas)<-[:ES_AMIGO_DE]-(lucia)
MERGE (lucas)-[:ES_AMIGO_DE]->(hector)
MERGE (lucas)<-[:ES_AMIGO_DE]-(hector)
MERGE (lucas)-[:ES_AMIGO_DE]->(olga)
MERGE (lucas)<-[:ES_AMIGO_DE]-(olga)
MERGE (lucas)-[:ES_AMIGO_DE]->(maria)
MERGE (lucas)<-[:ES_AMIGO_DE]-(maria)
MERGE (lucas)-[:ES_AMIGO_DE]->(marta)
MERGE (lucas)<-[:ES_AMIGO_DE]-(marta)

MERGE (juan)-[:MIEMBRO]->(c1)
MERGE (marcos)-[:MIEMBRO]->(c1)
MERGE (joaquin)-[:MIEMBRO]->(c1)
MERGE (pedro)-[:MIEMBRO]->(c1)
MERGE (patricia)-[:MIEMBRO]->(c1)
MERGE (martin)-[:MIEMBRO]->(c1)

MERGE (juan)-[:MIEMBRO]->(c2)
MERGE (marcos)-[:MIEMBRO]->(c2)
MERGE (joaquin)-[:MIEMBRO]->(c2)
MERGE (pedro)-[:MIEMBRO]->(c2)
MERGE (patricia)-[:MIEMBRO]->(c2)
MERGE (martin)-[:MIEMBRO]->(c2)
MERGE (diego)-[:MIEMBRO]->(c2)
MERGE (ana)-[:MIEMBRO]->(c2)
MERGE (eric)-[:MIEMBRO]->(c2)
MERGE (lucia)-[:MIEMBRO]->(c2)

MERGE (juan)-[:MIEMBRO]->(c3)
MERGE (marcos)-[:MIEMBRO]->(c3)
MERGE (joaquin)-[:MIEMBRO]->(c3)
MERGE (pedro)-[:MIEMBRO]->(c3)

MERGE (juan)-[:MIEMBRO]->(c4)
MERGE (marcos)-[:MIEMBRO]->(c4)
MERGE (joaquin)-[:MIEMBRO]->(c4)
MERGE (pedro)-[:MIEMBRO]->(c4)
MERGE (patricia)-[:MIEMBRO]->(c4)
MERGE (martin)-[:MIEMBRO]->(c4)
MERGE (diego)-[:MIEMBRO]->(c4)
MERGE (ana)-[:MIEMBRO]->(c4)
MERGE (eric)-[:MIEMBRO]->(c4)
MERGE (lucia)-[:MIEMBRO]->(c4)
MERGE (hector)-[:MIEMBRO]->(c4)
MERGE (olga)-[:MIEMBRO]->(c4)