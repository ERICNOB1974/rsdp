MATCH (n) DETACH DELETE n;

// Caso 1: Usuario sin rutinas
CREATE (u1:Usuario {nombreUsuario: 'lucas123', nombreReal: 'Usuario Sin Rutinas'})
CREATE (c1:Comunidad {nombre: 'Futbol en la playa', descripcion: 'Comunidad sin usuarios que realicen rutinas'})
CREATE (u1)-[:MIEMBRO]->(c1)


// Caso 2: Usuario con 1 rutina realizada por otro miembro
CREATE (u2:Usuario {nombreUsuario: 'maia_rocks', nombreReal: 'Usuario 1 Rutina'})
CREATE (m2:Usuario {nombreUsuario: 'pedrito', nombreReal: 'Miembro 1'})
CREATE (r2:Rutina {nombre: 'Ejercicios tren superior', descripcion: 'Rutina de ejemplo 1', duracionMinutosPorDia: 30})
CREATE (m2)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-01-01')}]->(r2)
CREATE (c2:Comunidad {nombre: 'Voley en la playa', descripcion: 'Comunidad con una rutina realizada'})
CREATE (u2)-[:MIEMBRO]->(c2)
CREATE (m2)-[:MIEMBRO]->(c2)


// Caso 3: Usuario con 2 rutinas, donde una es más popular
CREATE (u3:Usuario {nombreUsuario: 'eric99', nombreReal: 'Usuario 2 Rutinas'})
CREATE (m3a:Usuario {nombreUsuario: 'juancito', nombreReal: 'Miembro 2A'})
CREATE (m3b:Usuario {nombreUsuario: 'elena11', nombreReal: 'Miembro 2B'})
CREATE (r3a:Rutina {nombre: 'Rutina HIIT Express', descripcion: 'Rutina popular', duracionMinutosPorDia: 45})
CREATE (r3b:Rutina {nombre: 'Rutina de Acondicionamiento General', descripcion: 'Rutina menos popular', duracionMinutosPorDia: 30})
CREATE (r3c:Rutina {nombre: 'Rutina de Potencia Explosiva', descripcion: 'Rutina invalida', duracionMinutosPorDia: 30})


CREATE (m3a)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-02-01')}]->(r3a)
CREATE (m3b)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-02-01')}]->(r3b)
CREATE (m3b)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-02-01')}]->(r3a) // Miembro 2B también realiza la primera rutina
CREATE (u3)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-02-01')}]->(r3c)
CREATE (m3a)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-02-01')}]->(r3c)
CREATE (m3b)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-02-01')}]->(r3c)


CREATE (c3:Comunidad {nombre: 'Rugby en la playa', descripcion: 'Comunidad con dos rutinas'})
CREATE (u3)-[:MIEMBRO]->(c3)
CREATE (m3a)-[:MIEMBRO]->(c3)
CREATE (m3b)-[:MIEMBRO]->(c3)


// Caso 4: Usuario con 3 rutinas de popularidad diferente
CREATE (u4:Usuario {nombreUsuario: 'ramiro85', nombreReal: 'Usuario 3 Rutinas'})
CREATE (m4a:Usuario {nombreUsuario: 'teodoro9', nombreReal: 'Miembro 3A'})
CREATE (m4b:Usuario {nombreUsuario: 'chancalay8', nombreReal: 'Miembro 3B'})
CREATE (m4c:Usuario {nombreUsuario: 'juanchon88', nombreReal: 'Miembro 3C'})

CREATE (r4a:Rutina {nombre: 'Rutina Funcional Intermedia', descripcion: 'Rutina muy popular', duracionMinutosPorDia: 60})
CREATE (r4b:Rutina {nombre: 'Rutina de Estiramientos Activos', descripcion: 'Rutina moderadamente popular', duracionMinutosPorDia: 45})
CREATE (r4c:Rutina {nombre: 'Rutina de Core Avanzado', descripcion: 'Rutina poco popular', duracionMinutosPorDia: 30})

CREATE (m4a)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-03-01')}]->(r4a)
CREATE (m4b)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-03-01')}]->(r4a)
CREATE (m4a)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-03-15')}]->(r4b)
CREATE (m4c)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-03-30')}]->(r4c)
CREATE (m4c)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-03-30')}]->(r4a)
CREATE (m4b)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-03-30')}]->(r4b)

CREATE (c4:Comunidad {nombre: 'Running en la playa', descripcion: 'Comunidad con tres rutinas'})
CREATE (u4)-[:MIEMBRO]->(c4)
CREATE (m4a)-[:MIEMBRO]->(c4)
CREATE (m4b)-[:MIEMBRO]->(c4)
CREATE (m4c)-[:MIEMBRO]->(c4)
