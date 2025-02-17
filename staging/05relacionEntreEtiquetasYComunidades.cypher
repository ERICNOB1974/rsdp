// Vincular 2 etiquetas por cada comunidad (quedan algunas sin comunidad libres)
MATCH (c:Comunidad)
WITH c
// Obtener todas las etiquetas
MATCH (e:Etiqueta)
WITH c, COLLECT(e) AS etiquetas
// Seleccionar 2 etiquetas aleatorias
WITH c, [x IN etiquetas
WHERE rand() < 0.2][0..2] AS etiquetasSeleccionadas
// Crear relaciones
UNWIND etiquetasSeleccionadas AS etiqueta
CREATE (c)-[:ETIQUETADA_CON]->(etiqueta);