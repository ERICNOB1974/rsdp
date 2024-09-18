// Obtener todos los usuarios
MATCH (u:Usuario)
WITH u
// Obtener todas las rutinas y seleccionarlas aleatoriamente por usuario
MATCH (r:Rutina)
WITH u, r, rand() AS randomValue
 ORDER BY randomValue
WITH u, COLLECT(r) AS rutinasAleatorias
// Seleccionar entre 0 y 3 rutinas aleatorias
WITH u, rutinasAleatorias, size(rutinasAleatorias) AS totalRutinas, duration.between(date('2022-01-01'), date()).days AS totalDias
WITH u, rutinasAleatorias[..toInteger(rand() * 4)] AS rutinasSeleccionadas, totalDias
// Desenrollar las rutinas seleccionadas y crear las relaciones
UNWIND rutinasSeleccionadas AS rutina
CREATE (u)-[:REALIZA {
  fechaDeComienzo: date('2022-01-01') + duration({ days: toInteger(rand() * totalDias) })
  }]->(rutina);
