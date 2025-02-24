UNWIND range(1, 50) AS i
MATCH (creador:Usuario { nombreUsuario: "usuario" + i })
WITH creador, i
CALL {
  WITH i
  MATCH (comunidad:Comunidad)
  WITH comunidad ORDER BY rand()
  LIMIT 1
  RETURN comunidad
}
WITH creador, i, comunidad
WHERE comunidad IS NOT null
CREATE (e:Evento {
  nombre:
  
CASE
   WHEN i % 2 = 0 THEN ["Carrera 5K", "Torneo de Fútbol", "Clase de Yoga", "Maratón 10K", "Clínica de Natación"][(i % 5)]
  ELSE ["Torneo de Ciclismo", "Clase de Pilates", "Entrenamiento de CrossFit", "Carrera de Bicicletas", "Campeonato de Basket"][(i % 5)]
  END,
  fechaDeCreacion: date("2021-01-01") + duration('P' + (i % 365) + 'D'),
  fechaHora: date("2021-01-01") + duration('P' + (i % 30) + 'D'),
  ubicacion:
  
CASE
   WHEN i % 2 = 0 THEN ["Parque Central", "Gimnasio Municipal", "Playa Norte", "Estadio Olímpico", "Piscina Comunitaria"][(i % 5)]
  ELSE ["Parque de Bicicletas", "Centro Deportivo", "Sala de Fitness", "Pista de Atletismo", "Cancha de Baloncesto"][(i % 5)]
  END,
  descripcion:
  
CASE
   WHEN i % 2 = 0 THEN ["Evento recreativo para toda la familia", "Torneo competitivo", "Clase para mejorar la flexibilidad", "Carrera de largo aliento", "Entrenamiento avanzado de natación"][(i % 5)]
  ELSE ["Torneo para ciclistas", "Clase para mejorar la postura", "Entrenamiento de alta intensidad", "Competencia de ciclismo", "Campeonato de baloncesto para aficionados"][(i % 5)]
  END,
  cantidadMaximaParticipantes: 100 + i,
  esPrivadoParaLaComunidad:
  
CASE WHEN rand() < 0.15 THEN true ELSE false END
  })
  CREATE (creador)<-[:CREADO_POR]-(e)
  WITH e, comunidad
  WHERE e.esPrivadoParaLaComunidad = true
  CREATE (e)-[:ORGANIZADO_POR]->(comunidad);
