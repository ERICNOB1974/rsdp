MATCH (n)
DETACH DELETE n;
// Crear 10 usuarios
CREATE (lucas:Usuario {nombreUsuario: 'Lucas'}),
       (facundo:Usuario {nombreUsuario: 'Facundo'}),
       (eric:Usuario {nombreUsuario: 'Eric'}),
       (maia:Usuario {nombreUsuario: 'Maia'}),
       (melisa:Usuario {nombreUsuario: 'Melisa'}),
       (alan:Usuario {nombreUsuario: 'Alan'}),
       (agustin:Usuario {nombreUsuario: 'Agustin'}),
       (juarito:Usuario {nombreUsuario: 'Juarito'}),
       (ramiro:Usuario {nombreUsuario: 'Ramiro'}),
       (matias:Usuario {nombreUsuario: 'Matias'});

// Crear relaciones de amistad
MATCH (lucas:Usuario {nombreUsuario: 'Lucas'}),
      (facundo:Usuario {nombreUsuario: 'Facundo'}),
      (eric:Usuario {nombreUsuario: 'Eric'})
CREATE (lucas)-[:ES_AMIGO_DE {fechaAmigos: datetime('2023-10-06T12:00:00')}]->(eric),
       (lucas)-[:ES_AMIGO_DE {fechaAmigos: datetime('2023-10-06T12:00:00')}]->(facundo),
       (facundo)-[:ES_AMIGO_DE {fechaAmigos: datetime('2023-10-06T12:00:00')}]->(eric),
       (facundo)-[:ES_AMIGO_DE {fechaAmigos: datetime('2023-10-06T12:00:00')}]->(lucas),
       (eric)-[:ES_AMIGO_DE {fechaAmigos: datetime('2023-10-06T12:00:00')}]->(facundo),
       (eric)-[:ES_AMIGO_DE {fechaAmigos: datetime('2023-10-06T12:00:00')}]->(lucas);