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
CREATE (lucas)-[:ES_AMIGO_DE {fechaAmigos: date('2024-01-01')}]->(eric),
       (lucas)-[:ES_AMIGO_DE {fechaAmigos: date('2024-01-01')}]->(facundo),
       (facundo)-[:ES_AMIGO_DE {fechaAmigos: date('2024-01-01')}]->(eric),
       (facundo)-[:ES_AMIGO_DE {fechaAmigos: date('2024-01-01')}]->(lucas),
       (eric)-[:ES_AMIGO_DE {fechaAmigos: date('2024-01-01')}]->(facundo),
       (eric)-[:ES_AMIGO_DE {fechaAmigos: date('2024-01-01')}]->(lucas);

// Crear 5 comunidades (2 públicas y 3 privadas)
CREATE (comunidad1:Comunidad {
        nombre: 'Comunidad Deportiva 1',
        fechaDeCreacion: date('2023-01-01'),
        descripcion: 'Comunidad para amantes del deporte.',
        cantidadMaximaMiembros: 100,
        esPrivada: false
    }),
    (comunidad2:Comunidad {
        nombre: 'Comunidad Deportiva 2',
        fechaDeCreacion: date('2023-02-01'),
        descripcion: 'Comunidad para compartir eventos deportivos.',
        cantidadMaximaMiembros: 50,
        esPrivada: false
    }),
    (comunidad3:Comunidad {
        nombre: 'Comunidad Privada 1',
        fechaDeCreacion: date('2023-03-01'),
        descripcion: 'Comunidad privada de entrenamiento avanzado.',
        cantidadMaximaMiembros: 20,
        esPrivada: true
    }),
    (comunidad4:Comunidad {
        nombre: 'Comunidad Privada 2',
        fechaDeCreacion: date('2023-04-01'),
        descripcion: 'Comunidad para estrategias deportivas.',
        cantidadMaximaMiembros: 15,
        esPrivada: true
    }),
    (comunidad5:Comunidad {
        nombre: 'Comunidad Privada 3',
        fechaDeCreacion: date('2023-05-01'),
        descripcion: 'Comunidad de coaching y entrenamiento personal.',
        cantidadMaximaMiembros: 10,
        esPrivada: true
    });

// Hacer que Alan sea miembro de una comunidad pública (Comunidad Deportiva 1)
MATCH (alan:Usuario {nombreUsuario: 'Alan'}), (comunidad1:Comunidad {nombre: 'Comunidad Deportiva 1'})
CREATE (alan)-[:MIEMBRO_DE {fechaIngreso: datetime('2023-10-06T12:00:00')}]->(comunidad1);

// Crear una solicitud de ingreso para Alan a una comunidad privada (Comunidad Privada 1)
MATCH (alan:Usuario {nombreUsuario: 'Alan'}), (comunidad3:Comunidad {nombre: 'Comunidad Privada 1'})
CREATE (alan)-[:SOLICITUD_INGRESO {estado: 'pendiente', fechaSolicitud: datetime('2023-10-06T12:00:00')}]->(comunidad3);
