//Carga de 50 comunidades
  UNWIND range(1, 50) AS i
  MATCH (creador:Usuario { nombreUsuario: "usuario" + i })
  CREATE (c:Comunidad {
    nombre:
    
    
CASE
     WHEN i % 2 = 0 THEN ["Comunidad de Running", "Corredores de Montaña", "Amantes del Trail Running", "Novatos en Maratón", "Fanáticos del 10K"][(i % 5)]
    ELSE ["Comunidad de Ciclismo", "Ciclistas de Montaña", "Aficionados al Spinning", "Amantes de las Rutas Largas", "Competidores de Ciclismo"][(i % 5)]
    END,
    fechaDeCreacion: date("2021-01-01") + duration('P' + (i % 365) + 'D'),
    descripcion:
    
    
CASE
     WHEN i % 2 = 0 THEN ["Grupo de corredores experimentados", "Comunidad para entrenar trail", "Plan de entrenamiento de 10K", "Carreras para novatos", "Corredores intermedios"][(i % 5)]
    ELSE ["Grupo de ciclismo de montaña", "Rutas largas para ciclistas", "Plan de entrenamiento de ciclismo", "Carreras ciclistas para aficionados", "Competencias de ciclismo"][(i % 5)]
    END,
    ubicacion: ["Puerto Madryn", "Córdoba", "Rosario", "Mendoza", "Tucumán",
    "Salta", "Santa Fe", "Neuquén", "Mar del Plata", "Bahía Blanca",
    "Posadas", "La Plata", "San Juan", "San Luis", "Jujuy",
    "Río Gallegos", "Bariloche", "Paraná", "San Fernando del Valle de Catamarca", "Rafaela"][(i % 20)],
    cantidadMaximaMiembros: 50 + i
    })
    CREATE (creador)<-[:CREADO_POR]-(c)
    WITH c, i // Incluímos la variable i aquí
// Asignar un administrador
    MATCH (admin:Usuario)
    WHERE admin.nombreUsuario = "usuario" + ((i % 50) + 1)
    CREATE (admin)<-[:ADMINISTRADO_POR]-(c)
    WITH c, i // Incluímos la variable i aquí también
// Asignar 10 miembros por comunidad
    UNWIND range(1, 10) AS j
    MATCH (miembro:Usuario)
    WHERE miembro.nombreUsuario = "usuario" + ((i + j) % 50 + 1)
    CREATE (miembro)-[:MIEMBRO]->(c);
