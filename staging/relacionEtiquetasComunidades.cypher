// Relacionar comunidades con dos etiquetas representativas

MATCH 
  (c1:Comunidad {nombre: 'Amantes del Running'}),
  (c2:Comunidad {nombre: 'Ciclistas Urbanos'}),
  (c3:Comunidad {nombre: 'Escaladores Expertos'}),
  (c4:Comunidad {nombre: 'Futboleros Unidos'}),
  (c5:Comunidad {nombre: 'Caminatas y Senderismo'}),
  (c6:Comunidad {nombre: 'Entrenamiento Funcional'}),
  (c7:Comunidad {nombre: 'Aficionados al Tenis'}),
  (c8:Comunidad {nombre: 'Triatlón Challenge'}),
  (c9:Comunidad {nombre: 'Yoga y Meditación'}),
  (c10:Comunidad {nombre: 'Ciclistas de Montaña'}),
  (c11:Comunidad {nombre: 'Crossfit Warriors'}),
  (c12:Comunidad {nombre: 'Atletas del Parque'}),
  (c13:Comunidad {nombre: 'Fútbol Femenino'}),
  (c14:Comunidad {nombre: 'Natación de Alto Rendimiento'}),
  (c15:Comunidad {nombre: 'Amantes del Paddle'}),
  (c16:Comunidad {nombre: 'Escalada y Aventura'}),
  (c17:Comunidad {nombre: 'Senderismo en Familia'}),
  (c18:Comunidad {nombre: 'Maratones del Mundo'}),
  (c19:Comunidad {nombre: 'Básquet 3x3'}),
  (c20:Comunidad {nombre: 'Surf y Deportes Acuáticos'}),

  // MATCH de las etiquetas
  (e1:Etiqueta {nombre: 'Running'}),
  (e2:Etiqueta {nombre: 'Maratón'}),
  (e3:Etiqueta {nombre: 'Ciclismo'}),
  (e4:Etiqueta {nombre: 'Ciclismo de Montaña'}),
  (e5:Etiqueta {nombre: 'Escalada'}),
  (e6:Etiqueta {nombre: 'Escalada en Roca'}),
  (e7:Etiqueta {nombre: 'Fútbol'}),
  (e9:Etiqueta {nombre: 'Senderismo'}),
  (e10:Etiqueta {nombre: 'Trail Running'}),
  (e11:Etiqueta {nombre: 'Crossfit'}),
  (e12:Etiqueta {nombre: 'Funcional'}),
  (e13:Etiqueta {nombre: 'Tenis'}),
  (e14:Etiqueta {nombre: 'Triatlón'}),
  (e15:Etiqueta {nombre: 'Yoga'}),
  (e16:Etiqueta {nombre: 'Stretching'}),
  (e17:Etiqueta {nombre: 'Pádel'}),
  (e18:Etiqueta {nombre: 'Surf'}),
  (e19:Etiqueta {nombre: 'Básquetbol'}),
  (e20:Etiqueta {nombre: 'Deportes Acuáticos'}),
  (e21:Etiqueta {nombre: 'Atletismo'}),
  (e22:Etiqueta {nombre: 'Montaña'}),
  (e23:Etiqueta {nombre: 'Caminata'}),
  (e25:Etiqueta {nombre: 'Duatlón'}),
  (e26:Etiqueta {nombre: 'Carrera'}),
  (e27:Etiqueta {nombre: 'Squash'})


// MERGE para evitar duplicados y crear las relaciones solo si no existen
MERGE (c1)-[:ETIQUETADA_CON]->(e1) // Amantes del Running - Running
MERGE (c1)-[:ETIQUETADA_CON]->(e2) // Amantes del Running - Maratón
MERGE (c1)-[:ETIQUETADA_CON]->(e10) // Amantes del Running - Trail Running
MERGE (c1)-[:ETIQUETADA_CON]->(e21) // Amantes del Running - Atletismo


MERGE (c2)-[:ETIQUETADA_CON]->(e3) // Ciclistas Urbanos - Ciclismo
MERGE (c2)-[:ETIQUETADA_CON]->(e4) // Ciclistas Urbanos - Ciclismo de Montaña

MERGE (c3)-[:ETIQUETADA_CON]->(e5) // Escaladores Expertos - Escalada
MERGE (c3)-[:ETIQUETADA_CON]->(e6) // Escaladores Expertos - Escalada en Roca
MERGE (c3)-[:ETIQUETADA_CON]->(e22) // Escaladores Expertos - Montaña


MERGE (c4)-[:ETIQUETADA_CON]->(e7) // Futboleros Unidos - Fútbol


MERGE (c5)-[:ETIQUETADA_CON]->(e9) // Caminatas y Senderismo - Senderismo
MERGE (c5)-[:ETIQUETADA_CON]->(e23) // Caminatas y Senderismo - Caminata


MERGE (c6)-[:ETIQUETADA_CON]->(e11) // Entrenamiento Funcional - Crossfit
MERGE (c6)-[:ETIQUETADA_CON]->(e12) // Entrenamiento Funcional - Entrenamiento Funcional

MERGE (c7)-[:ETIQUETADA_CON]->(e13) // Aficionados al Tenis - Tenis
MERGE (c7)-[:ETIQUETADA_CON]->(e17) // Aficionados al Tenis - Padel

MERGE (c8)-[:ETIQUETADA_CON]->(e14) // Triatlón Challenge - Triatlón
MERGE (c8)-[:ETIQUETADA_CON]->(e25) // Triatlón Challenge - Duatlon
MERGE (c8)-[:ETIQUETADA_CON]->(e2) // Triatlón Challenge - Maraton
MERGE (c8)-[:ETIQUETADA_CON]->(e20) // Triatlón Challenge - Deportes Acuáticos
MERGE (c8)-[:ETIQUETADA_CON]->(e3) // Triatlón Challenge - Ciclismo
MERGE (c8)-[:ETIQUETADA_CON]->(e26) // Triatlón Challenge - Carrera



MERGE (c9)-[:ETIQUETADA_CON]->(e15) // Yoga y Meditación - Yoga
MERGE (c9)-[:ETIQUETADA_CON]->(e16) // Yoga y Meditación - Stretching

MERGE (c10)-[:ETIQUETADA_CON]->(e4) // Ciclistas de Montaña - Ciclismo de Montaña
MERGE (c10)-[:ETIQUETADA_CON]->(e3) // Ciclistas de Montaña - Ciclismo
MERGE (c10)-[:ETIQUETADA_CON]->(e22) // Ciclistas de Montaña - Montaña


MERGE (c11)-[:ETIQUETADA_CON]->(e11) // Crossfit Warriors - Crossfit
MERGE (c11)-[:ETIQUETADA_CON]->(e12) // Crossfit Warriors - Funcional

MERGE (c12)-[:ETIQUETADA_CON]->(e11) // Atletas del Parque - Crossfit
MERGE (c12)-[:ETIQUETADA_CON]->(e9) // Atletas del Parque - Senderismo
MERGE (c12)-[:ETIQUETADA_CON]->(e21) // Atletas del Parque - Atletismo


MERGE (c13)-[:ETIQUETADA_CON]->(e7) // Fútbol Femenino - Fútbol

MERGE (c14)-[:ETIQUETADA_CON]->(e12) // Natación de Alto Rendimiento - Natación
MERGE (c14)-[:ETIQUETADA_CON]->(e20) // Natación de Alto Rendimiento - Deportes Acuáticos

MERGE (c15)-[:ETIQUETADA_CON]->(e17) // Amantes del Paddle - Pádel
MERGE (c15)-[:ETIQUETADA_CON]->(e13) // Amantes del Paddle - Tenis
MERGE (c15)-[:ETIQUETADA_CON]->(e27) // Amantes del Paddle - Squash


MERGE (c16)-[:ETIQUETADA_CON]->(e5) // Escalada y Aventura - Escalada
MERGE (c16)-[:ETIQUETADA_CON]->(e9) // Escalada y Aventura - Senderismo
MERGE (c16)-[:ETIQUETADA_CON]->(e6) // Escalada y Aventura - Escalada en Roca


MERGE (c17)-[:ETIQUETADA_CON]->(e9) // Senderismo en Familia - Senderismo

MERGE (c18)-[:ETIQUETADA_CON]->(e1) // Maratones del Mundo - Running
MERGE (c18)-[:ETIQUETADA_CON]->(e2) // Maratones del Mundo - Maratón
MERGE (c18)-[:ETIQUETADA_CON]->(e14) // Triatlón Challenge - Triatlón
MERGE (c18)-[:ETIQUETADA_CON]->(e25) // Triatlón Challenge - Duatlon
MERGE (c18)-[:ETIQUETADA_CON]->(e24) // Triatlón Challenge - Maraton
MERGE (c18)-[:ETIQUETADA_CON]->(e20) // Triatlón Challenge - Deportes Acuáticos
MERGE (c18)-[:ETIQUETADA_CON]->(e3) // Triatlón Challenge - Ciclismo
MERGE (c18)-[:ETIQUETADA_CON]->(e26) // Triatlón Challenge - Carrera

MERGE (c19)-[:ETIQUETADA_CON]->(e19) // Básquet 3x3 - Básquetbol

MERGE (c20)-[:ETIQUETADA_CON]->(e18) // Surf y Deportes Acuáticos - Surf
MERGE (c20)-[:ETIQUETADA_CON]->(e12) // Surf y Deportes Acuáticos - Natación
MERGE (c20)-[:ETIQUETADA_CON]->(e20) // Surf y Deportes Acuáticos - Deportes Acuáticos
;
