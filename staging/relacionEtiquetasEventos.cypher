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
      (et2:Etiqueta {nombre: 'Running'}),
      (et3:Etiqueta {nombre: 'Tenis'}),
      (et4:Etiqueta {nombre: 'Voleibol'}),
      (et5:Etiqueta {nombre: 'Montaña'}),
      (et6:Etiqueta {nombre: 'Yoga'}),
      (et7:Etiqueta {nombre: 'Ciclismo'}),
      (et8:Etiqueta {nombre: 'Natación'}),
      (et9:Etiqueta {nombre: 'Zumba'}),
      (et10:Etiqueta {nombre: 'Ajedrez'}),
      (et11:Etiqueta {nombre: 'Ciudad'}), 
      (et12:Etiqueta {nombre: 'Ping Pong'}),
      (et13:Etiqueta {nombre: 'Básquetbol'}),
      (et14:Etiqueta {nombre: 'Bádminton'}),
      (et15:Etiqueta {nombre: 'Escalada'}),
      (et16:Etiqueta {nombre: 'Hockey'}),
      (et17:Etiqueta {nombre: 'Esgrima'}),
      (et18:Etiqueta {nombre: 'Maratón'}),
      (et19:Etiqueta {nombre: 'Playa'}),
      (et20:Etiqueta {nombre: 'Pádel'}),
      (et21:Etiqueta {nombre: 'Carrera'}),
      (et22:Etiqueta {nombre: 'Caminata'}),
      (et23:Etiqueta {nombre: 'Stretching'}),
      (et24:Etiqueta {nombre: 'Baile'}),
      (et25:Etiqueta {nombre: 'Ciclismo de Montaña'}),
      (et26:Etiqueta {nombre: 'Estrategia'}),
      (et27:Etiqueta {nombre: 'Patinaje'}),
      (et28:Etiqueta {nombre: 'Escalada en Montaña'}),
      (et29:Etiqueta {nombre: 'Combate'}),
      (et30:Etiqueta {nombre: 'Squash'})


// Asignación de etiquetas a los eventos
MERGE (e1)-[:ETIQUETADO_CON]->(et1) // Fútbol

MERGE (e2)-[:ETIQUETADO_CON]->(et2) // Running
MERGE (e2)-[:ETIQUETADO_CON]->(et18) // Maratón

MERGE (e3)-[:ETIQUETADO_CON]->(et3) // Tenis
MERGE (e3)-[:ETIQUETADO_CON]->(et20) // Pádel

MERGE (e4)-[:ETIQUETADO_CON]->(et5) // Montaña 
MERGE (e4)-[:ETIQUETADO_CON]->(et22) // Caminata

MERGE (e5)-[:ETIQUETADO_CON]->(et6) // Yoga
MERGE (e5)-[:ETIQUETADO_CON]->(et23) // Stretching

MERGE (e6)-[:ETIQUETADO_CON]->(et4) // Voleibol
MERGE (e6)-[:ETIQUETADO_CON]->(et19) // Playa

MERGE (e7)-[:ETIQUETADO_CON]->(et7) // Ciclismo
MERGE (e7)-[:ETIQUETADO_CON]->(et5) // Montaña
MERGE (e7)-[:ETIQUETADO_CON]->(et25) // Ciclismo de Montaña


MERGE (e8)-[:ETIQUETADO_CON]->(et3) // Tenis
MERGE (e8)-[:ETIQUETADO_CON]->(et20) // Padel
MERGE (e8)-[:ETIQUETADO_CON]->(et30) // Squash

MERGE (e9)-[:ETIQUETADO_CON]->(et8) // Natación
MERGE (e9)-[:ETIQUETADO_CON]->(et18) // Maratón

MERGE (e10)-[:ETIQUETADO_CON]->(et9) // Zumba
MERGE (e10)-[:ETIQUETADO_CON]->(et24) // Baile

MERGE (e11)-[:ETIQUETADO_CON]->(et10) // Ajedrez
MERGE (e11)-[:ETIQUETADO_CON]->(et26) // Estrategia

MERGE (e12)-[:ETIQUETADO_CON]->(et11) // Ciudad
MERGE (e12)-[:ETIQUETADO_CON]->(et22) // Caminata

MERGE (e13)-[:ETIQUETADO_CON]->(et12) // Ping Pong
MERGE (e13)-[:ETIQUETADO_CON]->(et3) // Tenis

MERGE (e14)-[:ETIQUETADO_CON]->(et13) // Básquetbol

MERGE (e15)-[:ETIQUETADO_CON]->(et14) // Bádminton
MERGE (e15)-[:ETIQUETADO_CON]->(et4) // Voleibol

MERGE (e16)-[:ETIQUETADO_CON]->(et7) // Ciclismo
MERGE (e16)-[:ETIQUETADO_CON]->(et21) // Carrera
MERGE (e16)-[:ETIQUETADO_CON]->(et25) // Ciclismo de montaña


MERGE (e17)-[:ETIQUETADO_CON]->(et6) // Yoga
MERGE (e17)-[:ETIQUETADO_CON]->(et23) // Stretching

MERGE (e18)-[:ETIQUETADO_CON]->(et15) // Escalada
MERGE (e18)-[:ETIQUETADO_CON]->(et28) // Escalada en montaña

MERGE (e19)-[:ETIQUETADO_CON]->(et16) // Hockey
MERGE (e19)-[:ETIQUETADO_CON]->(et27) // PATINAJE

MERGE (e20)-[:ETIQUETADO_CON]->(et17) // Esgrima
MERGE (e20)-[:ETIQUETADO_CON]->(et29) // Combate

