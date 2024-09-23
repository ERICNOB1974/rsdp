//rutinas etiquetas random
//seleccionar todas las rutinas
MATCH (r:Rutina)
WITH r

//obtener todas las etiquetas
MATCH (e:Etiqueta)
WITH r, e, rand() AS randomValue
 ORDER BY randomValue

WITH r, COLLECT(e) AS etiquetaRandom

WITH r, etiquetaRandom, size(etiquetaRandom) AS totalEtiquetas
WITH r, etiquetaRandom[..toInteger((rand() * 2)+1)] AS etiquetasSeleccionadas

UNWIND etiquetasSeleccionadas AS etiqueta
CREATE (r)-[:ETIQUETADA_CON]->(etiqueta);

MATCH (u:Usuario), (e:Evento)
WHERE rand() < 0.1
CREATE (u)-[p:PARTICIPA_EN {
  fechaDeInscripcion: date()
  }]->(e);
