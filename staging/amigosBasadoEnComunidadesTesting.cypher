//RecomendacionesAmigosBasadosEnComunidades
MATCH (n) DETACH DELETE n;

CREATE (lucas:Usuario {nombreUsuario: 'lucas', nombreReal: 'Lucas'})
CREATE (juan:Usuario {nombreUsuario: 'juan', nombreReal: 'Juan'})
CREATE (marcos:Usuario {nombreUsuario: 'marcos', nombreReal: 'Marcos'})
CREATE (joaquin:Usuario {nombreUsuario: 'joaquin', nombreReal: 'Joaquin'})
CREATE (pedro:Usuario {nombreUsuario: 'pedro', nombreReal: 'Pedro'})

CREATE (comu1:Comunidad {nombre: 'Comunidad 1', descripcion: 'Comunidad1'})
CREATE (comu2:Comunidad {nombre: 'comunidad 2', descripcion: 'Comunidad2'})
CREATE (comu3:Comunidad {nombre: 'comunidad 3', descripcion: 'Comunidad3'})
CREATE (comu4:Comunidad {nombre: 'comunidad 4', descripcion: 'Comunidad4'})


CREATE (lucas)-[:MIEMBRO]->(comu1)
CREATE (lucas)-[:MIEMBRO]->(comu2)
CREATE (lucas)-[:MIEMBRO]->(comu3)
CREATE (lucas)-[:MIEMBRO]->(comu4)

CREATE (juan)-[:MIEMBRO]->(comu1)
CREATE (juan)-[:MIEMBRO]->(comu2)
CREATE (juan)-[:MIEMBRO]->(comu3)
CREATE (juan)-[:MIEMBRO]->(comu4)

CREATE (marcos)-[:MIEMBRO]->(comu2)
CREATE (marcos)-[:MIEMBRO]->(comu3)
CREATE (marcos)-[:MIEMBRO]->(comu4)

CREATE (pedro)-[:MIEMBRO]->(comu1)
CREATE (pedro)-[:MIEMBRO]->(comu2)

CREATE (joaquin)-[:MIEMBRO]->(comu1)
