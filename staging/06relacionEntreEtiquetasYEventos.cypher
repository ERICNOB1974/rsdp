// Vincular 2 etiquetas por cada evento
MATCH (ev:Evento)
WITH ev
// Obtener todas las etiquetas
MATCH (e:Etiqueta)
WITH ev, COLLECT(e) AS etiquetas
// Seleccionar 2 etiquetas aleatorias
WITH ev, [x IN etiquetas
WHERE rand() < 0.2][0..2] AS etiquetasSeleccionadas
// Crear relaciones
UNWIND etiquetasSeleccionadas AS etiqueta
CREATE (ev)-[:ETIQUETADO_CON]->(etiqueta);