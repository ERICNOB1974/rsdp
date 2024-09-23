//Usuarios realizan rutinas
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
          WITH u, rutina, date('2022-01-01') + duration({ days: toInteger(rand() * totalDias) }) AS fechaDeComienzo, totalDias
// Generar aleatoriamente si la fecha de fin será null
          WITH u, rutina, fechaDeComienzo,
          
          
CASE
           WHEN rand() < 0.5 THEN fechaDeComienzo + duration({ days: toInteger(rand() * (totalDias - duration.between(fechaDeComienzo, date()).days)) })
          ELSE null
          END AS fechaDeFin
          CREATE (u)-[:REALIZA_RUTINA {
            fechaDeComienzo: fechaDeComienzo,
            fechaDeFin: fechaDeFin
            }]->(rutina);