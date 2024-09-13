// Obtener todos los usuarios
MATCH (u:Usuario)
WITH u
// Obtener todas las rutinas y seleccionarlas aleatoriamente por usuario
MATCH (r:Rutina)
WITH u, r, rand() AS randomValue
ORDER BY randomValue
WITH u, COLLECT(r)[..3] AS rutinasAleatorias // Seleccionar 3 rutinas aleatorias
// Calcular el rango de días desde el 1 de enero de 2022 hasta hoy
WITH u, rutinasAleatorias, duration.between(date('2022-01-01'), date()).days AS totalDias
// Desenrollar las rutinas aleatorias y crear las relaciones
UNWIND rutinasAleatorias AS rutina
CREATE (u)-[:REALIZA {
    fechaDeComienzo: date('2022-01-01') + duration({days: toInteger(rand() * totalDias)})
}]->(rutina);
