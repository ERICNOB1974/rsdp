MATCH (e1:Evento {nombre: 'Torneo de Fútbol 5'}),
      (e2:Evento {nombre: 'Carrera de 10K'}),
      (e3:Evento {nombre: 'Torneo de Tenis'}),
      (e4:Evento {nombre: 'Caminata por la Montaña'}),
      (e5:Evento {nombre: 'Clase de Yoga al Aire Libre'}),
      (e6:Evento {nombre: 'Torneo de Voleibol de Playa'}),
      (e7:Evento {nombre: 'Ciclismo de Montaña'}),
      (e8:Evento {nombre: 'Torneo de Padel'}),
      (e9:Evento {nombre: 'Maratón de Natación'}),
      (e10:Evento {nombre: 'Clase de Zumba'}),
      (e11:Evento {nombre: 'Torneo de Ajedrez'}),
      (e12:Evento {nombre: 'Caminata por la Ciudad'}),
      (e13:Evento {nombre: 'Torneo de Ping Pong'}),
      (e14:Evento {nombre: 'Partido de Básquetbol'}),
      (e15:Evento {nombre: 'Torneo de Bádminton'}),
      (e16:Evento {nombre: 'Carrera de Bicicletas'}),
      (e17:Evento {nombre: 'Yoga al Amanecer'}),
      (e18:Evento {nombre: 'Maratón de Escalada'}),
      (e19:Evento {nombre: 'Torneo de Hockey'}),
      (e20:Evento {nombre: 'Competencia de Esgrima'})

MATCH (et1:Etiqueta {nombre: 'Fútbol'}),
      (et2:Etiqueta {nombre: 'Correr'}),
      (et3:Etiqueta {nombre: 'Resistencia'}),
      (et4:Etiqueta {nombre: 'Tenis'}),
      (et5:Etiqueta {nombre: 'Competencia'}),
      (et6:Etiqueta {nombre: 'Caminata'}),
      (et7:Etiqueta {nombre: 'Aventura'}),
      (et8:Etiqueta {nombre: 'Yoga'}),
      (et9:Etiqueta {nombre: 'Relajación'}),
      (et10:Etiqueta {nombre: 'Natación'}),
      (et11:Etiqueta {nombre: 'Acuático'}),
      (et12:Etiqueta {nombre: 'Crossfit'}),
      (et13:Etiqueta {nombre: 'Fuerza'}),
      (et14:Etiqueta {nombre: 'Ciclismo'}),
      (et15:Etiqueta {nombre: 'Montaña'}),
      (et16:Etiqueta {nombre: 'Maratón'}),
      (et17:Etiqueta {nombre: 'Distancia'}),
      (et18:Etiqueta {nombre: 'Spinning'}),
      (et19:Etiqueta {nombre: 'Aeróbico'}),
      (et20:Etiqueta {nombre: 'Básquetbol'}),
      (et21:Etiqueta {nombre: 'Voleibol'}),
      (et22:Etiqueta {nombre: 'Boxeo'}),
      (et23:Etiqueta {nombre: 'Combate'}),
      (et24:Etiqueta {nombre: 'Rugby'}),
      (et25:Etiqueta {nombre: 'Esfuerzo'}),
      (et26:Etiqueta {nombre: 'Urbano'}),
      (et27:Etiqueta {nombre: 'Bicicleta'}),
      (et28:Etiqueta {nombre: 'Esgrima'}),
      (et29:Etiqueta {nombre: 'Precisión'}),
      (et30:Etiqueta {nombre: 'Triatlón'}),
      (et31:Etiqueta {nombre: 'Endurance'}),
      (et32:Etiqueta {nombre: 'Pesas'}),
      (et33:Etiqueta {nombre: 'Potencia'}),
      (et34:Etiqueta {nombre: 'Clásico'}),
      (et35:Etiqueta {nombre: 'Karate'}),
      (et36:Etiqueta {nombre: 'Disciplina'})

// Asignación de etiquetas a los eventos
MERGE (e1)-[:ETIQUETADO_CON]->(et1)
MERGE (e1)-[:ETIQUETADO_CON]->(et5)

MERGE (e2)-[:ETIQUETADO_CON]->(et2)
MERGE (e2)-[:ETIQUETADO_CON]->(et16)

MERGE (e3)-[:ETIQUETADO_CON]->(et4)
MERGE (e3)-[:ETIQUETADO_CON]->(et5)

MERGE (e4)-[:ETIQUETADO_CON]->(et6)
MERGE (e4)-[:ETIQUETADO_CON]->(et7)

MERGE (e5)-[:ETIQUETADO_CON]->(et8)
MERGE (e5)-[:ETIQUETADO_CON]->(et9)

MERGE (e6)-[:ETIQUETADO_CON]->(et21)
MERGE (e6)-[:ETIQUETADO_CON]->(et5)

MERGE (e7)-[:ETIQUETADO_CON]->(et14)
MERGE (e7)-[:ETIQUETADO_CON]->(et15)

MERGE (e8)-[:ETIQUETADO_CON]->(et4)
MERGE (e8)-[:ETIQUETADO_CON]->(et5)

MERGE (e9)-[:ETIQUETADO_CON]->(et10)
MERGE (e9)-[:ETIQUETADO_CON]->(et16)

MERGE (e10)-[:ETIQUETADO_CON]->(et19)
MERGE (e10)-[:ETIQUETADO_CON]->(et9)

MERGE (e11)-[:ETIQUETADO_CON]->(et5)
MERGE (e11)-[:ETIQUETADO_CON]->(et29)

MERGE (e12)-[:ETIQUETADO_CON]->(et6)
MERGE (e12)-[:ETIQUETADO_CON]->(et7)

MERGE (e13)-[:ETIQUETADO_CON]->(et5)
MERGE (e13)-[:ETIQUETADO_CON]->(et29)

MERGE (e14)-[:ETIQUETADO_CON]->(et20)
MERGE (e14)-[:ETIQUETADO_CON]->(et5)

MERGE (e15)-[:ETIQUETADO_CON]->(et5)
MERGE (e15)-[:ETIQUETADO_CON]->(et25)

MERGE (e16)-[:ETIQUETADO_CON]->(et14)
MERGE (e16)-[:ETIQUETADO_CON]->(et27)

MERGE (e17)-[:ETIQUETADO_CON]->(et8)
MERGE (e17)-[:ETIQUETADO_CON]->(et9)

MERGE (e18)-[:ETIQUETADO_CON]->(et13)
MERGE (e18)-[:ETIQUETADO_CON]->(et15)

MERGE (e19)-[:ETIQUETADO_CON]->(et5)
MERGE (e19)-[:ETIQUETADO_CON]->(et25)

MERGE (e20)-[:ETIQUETADO_CON]->(et28)
MERGE (e20)-[:ETIQUETADO_CON]->(et29)
