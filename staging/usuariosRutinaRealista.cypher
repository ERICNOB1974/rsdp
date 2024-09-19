// Usuario 1: Lucas Pérez
MATCH (u1:Usuario {nombreUsuario: 'lucas123'})
MATCH (r1:Rutina {nombre: 'Rutina de fuerza'})
MATCH (r2:Rutina {nombre: 'Entrenamiento HIIT'})
MATCH (r3:Rutina {nombre: 'Entrenamiento funcional'})
WITH u1, r1, r2, r3
CREATE (u1)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-01-01')}]->(r1)
CREATE (u1)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-03-01'), fechaDeFin: date('2023-06-01')}]->(r2)
CREATE (u1)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-07-01')}]->(r3);

// Usuario 2: Maia Rodríguez
MATCH (u2:Usuario {nombreUsuario: 'maia_rocks'})
MATCH (r4:Rutina {nombre: 'Danza aeróbica'})
MATCH (r5:Rutina {nombre: 'Yoga para principiantes'})
MATCH (r6:Rutina {nombre: 'Entrenamiento de flexibilidad'})
WITH u2, r4, r5, r6
CREATE (u2)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-02-01')}]->(r4)
CREATE (u2)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-04-01'), fechaDeFin: date('2023-08-01')}]->(r5)
CREATE (u2)-[:REALIZA_RUTINA {fechaDeComienzo: date('2023-09-01')}]->(r6);
