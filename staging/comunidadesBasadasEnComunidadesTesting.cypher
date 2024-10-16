MATCH (n)
DETACH DELETE n;

CREATE
(lucas:Usuario { nombreUsuario: 'lucas', nombreReal: 'Lucas', latitud: -42.762555975850084,
longitud: -65.04467329781565 }),
(juan:Usuario { nombreUsuario: 'juan', nombreReal: 'Juan', latitud: -42.762555975850084,
longitud: -65.04467329781565 })

CREATE (c1:Comunidad { nombre: "Ciclistas de Montaña de Madryn", fechaDeCreacion: date("2021-01-02"), descripcion: "Rutas largas para ciclistas", cantidadMaximaMiembros: 51, esPrivada: false , latitud: -42.76442823854689, longitud: -65.03365087594793 }),
(c2:Comunidad { nombre: "Corredores de Ruta de Comodoro", fechaDeCreacion: date("2020-05-15"), descripcion: "Grupo para aficionados al running", cantidadMaximaMiembros: 100, esPrivada: false , latitud: -45.8397063939941, longitud: -67.47694735091086 }),
(c3:Comunidad { nombre: "Nadadores Urbanos de Bahia Blanca", fechaDeCreacion: date("2019-08-20"), descripcion: "Entrenamientos en piscinas y ríos", cantidadMaximaMiembros: 30, esPrivada: true , latitud: -38.71450381606208, longitud: -62.265303322668416 }),
(c4:Comunidad { nombre: "Escaladores de Montaña de Jujuy", fechaDeCreacion: date("2021-03-10"), descripcion: "Aventuras en escalada", cantidadMaximaMiembros: 25, esPrivada: false , latitud: -22.108040819161882, longitud: -65.59842140253284 }),
(c5:Comunidad { nombre: "Basquet en Comodoro", fechaDeCreacion: date("2020-05-15"), descripcion: "Basquet", cantidadMaximaMiembros: 1, esPrivada: false , latitud: -45.8397063939941, longitud: -67.47694735091086 })

MERGE (lucas)-[:MIEMBRO]->(c1)
MERGE (juan)-[:MIEMBRO]->(c5)

CREATE (et1:Etiqueta {nombre: "Deportes"})
CREATE (et2:Etiqueta {nombre: "Aire libre"})
CREATE (et3:Etiqueta {nombre: "Resistencia"})
CREATE (et4:Etiqueta {nombre: "Recreativo"})
CREATE (et5:Etiqueta {nombre: "Fisico"})
CREATE (et6:Etiqueta {nombre: "Cuerpo completo"})
CREATE (et7:Etiqueta {nombre: "Motricidad"})

CREATE (c1)-[:ETIQUETADA_CON]->(et1)
CREATE (c1)-[:ETIQUETADA_CON]->(et2)
CREATE (c1)-[:ETIQUETADA_CON]->(et3)
CREATE (c1)-[:ETIQUETADA_CON]->(et4)
CREATE (c1)-[:ETIQUETADA_CON]->(et5)
CREATE (c1)-[:ETIQUETADA_CON]->(et6)
CREATE (c1)-[:ETIQUETADA_CON]->(et7)

CREATE (c2)-[:ETIQUETADA_CON]->(et1)
CREATE (c2)-[:ETIQUETADA_CON]->(et2)
CREATE (c2)-[:ETIQUETADA_CON]->(et3)
CREATE (c2)-[:ETIQUETADA_CON]->(et4)
CREATE (c2)-[:ETIQUETADA_CON]->(et5)
CREATE (c2)-[:ETIQUETADA_CON]->(et6)

CREATE (c3)-[:ETIQUETADA_CON]->(et1)
CREATE (c3)-[:ETIQUETADA_CON]->(et2)
CREATE (c3)-[:ETIQUETADA_CON]->(et3)
CREATE (c3)-[:ETIQUETADA_CON]->(et4)
CREATE (c3)-[:ETIQUETADA_CON]->(et5)
CREATE (c3)-[:ETIQUETADA_CON]->(et6)

CREATE (c4)-[:ETIQUETADA_CON]->(et1)
CREATE (c4)-[:ETIQUETADA_CON]->(et2)
CREATE (c4)-[:ETIQUETADA_CON]->(et3)
CREATE (c4)-[:ETIQUETADA_CON]->(et4)
CREATE (c4)-[:ETIQUETADA_CON]->(et5)
CREATE (c4)-[:ETIQUETADA_CON]->(et6)
CREATE (c4)-[:ETIQUETADA_CON]->(et7)

CREATE (c5)-[:ETIQUETADA_CON]->(et1)
CREATE (c5)-[:ETIQUETADA_CON]->(et2)
CREATE (c5)-[:ETIQUETADA_CON]->(et3)
CREATE (c5)-[:ETIQUETADA_CON]->(et4)
CREATE (c5)-[:ETIQUETADA_CON]->(et5)
CREATE (c5)-[:ETIQUETADA_CON]->(et6)
CREATE (c5)-[:ETIQUETADA_CON]->(et7)
