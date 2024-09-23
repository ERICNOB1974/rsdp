UNWIND range(1, 50) AS i
CREATE (u:Usuario {
  nombreUsuario: "usuario" + i,
  nombreReal:
  
  
CASE
   WHEN i % 2 = 0 THEN ["Juan Pérez", "Carlos Sánchez", "Roberto Fernández", "Pedro Gómez", "Andrés López"][(i % 5)]
  ELSE ["María González", "Lucía Ramírez", "Ana Torres", "Laura García", "Sofía Martínez"][(i % 5)]
  END,
  fechaNacimiento:
  
  
CASE
   WHEN i % 2 = 0 THEN date("1990-01-01") + duration('P' + (i % 365) + 'D')
  ELSE date("1985-05-10") + duration('P' + (i % 365) + 'D')
  END,
  fechaDeCreacion: date("2023-01-01") + duration('P' + i + 'D'),
  correoElectronico:
  
  
CASE
   WHEN i % 2 = 0 THEN "usuario" + i + "@runner.com"
  ELSE "usuario" + i + "@cyclist.com"
  END,
  contrasena: "password" + i,
  descripcion:
  
  
CASE
   WHEN i % 2 = 0 THEN ["Aficionado al running", "Corredor experimentado", "Amante del trail running", "Novato en maratones", "Fanático de los 10K"][(i % 5)]
  ELSE ["Apasionada del ciclismo", "Ciclista de montaña", "Aficionada al spinning", "Amante de las rutas largas", "Competidora de ciclismo"][(i % 5)]
  END
  });
  
//A los usuarios los pone de amigos con los siguientes 5
  MATCH (u1:Usuario), (u2:Usuario)
  WHERE u1.nombreUsuario STARTS
  WITH "usuario" AND u2.nombreUsuario STARTS
  WITH "usuario"
   AND toInteger(SUBSTRING(u2.nombreUsuario, 7)) > toInteger(SUBSTRING(u1.nombreUsuario, 7))
   AND toInteger(SUBSTRING(u2.nombreUsuario, 7)) <= toInteger(SUBSTRING(u1.nombreUsuario, 7)) + 5
  CREATE (u1)-[:ES_AMIGO_DE]->(u2),
  (u2)-[:ES_AMIGO_DE]->(u1);