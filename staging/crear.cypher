//Carga de 50 usuarios
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
  
//Carga de 20 comunidades
  UNWIND range(1, 20) AS i
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
    
// Carga de 20 eventos
    UNWIND range(1, 20) AS i
    MATCH (creador:Usuario { nombreUsuario: "usuario" + i })
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
      cantidadMaximaParticipantes: 100 + i
      })
      CREATE (creador)<-[:CREADO_POR]-(e)
      WITH e, i // Incluímos la variable i aquí
// Asignar 10 miembros por comunidad
      UNWIND range(1, 10) AS j
      MATCH (miembro:Usuario)
      WHERE miembro.nombreUsuario = "usuario" + ((i + j) % 50 + 1)
      CREATE (miembro)-[:PARTICIPA]->(e);
      

      
// Crear 50 etiquetas
      UNWIND [
      "Running", "Ciclismo", "Natación", "Crossfit", "Yoga", "Trail Running", "Spinning", "Maratón",
      "Ciclismo de Montaña", "Atletismo", "Fútbol", "Básquetbol", "Voleibol", "Tenis", "Rugby",
      "Senderismo", "Esquí", "Snowboard", "Patinaje", "Remo", "Piragüismo", "Escalada",
      "Surf", "Windsurf", "Kitesurf", "Golf", "Boxeo", "Kickboxing", "Karate", "Judo",
      "Taekwondo", "Muay Thai", "Esgrima", "Tiro con Arco", "Gimnasia", "Triatlón", "Duatlón",
      "Paddle", "Squash", "Bádminton", "Parkour", "Escalada en Roca", "Motocross", "Automovilismo",
      "Enduro", "Levantamiento de Pesas", "Powerlifting", "Halcones", "Pádel", "Equitación", "Pesca Deportiva"
      ] AS deporte
      CREATE (:Etiqueta { nombre: deporte });
      
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
      
//Crea 100 ejercicios realistas
      UNWIND range(1, 100) AS i
      CREATE (e:Ejercicio {
        nombre:
CASE
         WHEN i <= 10 THEN ["Flexiones", "Sentadillas", "Dominadas", "Burpees", "Plancha", "Zancadas", "Abdominales", "Fondos", "Elevación de talones", "Puente de glúteos"][i - 1]
         WHEN i <= 20 THEN ["Press de banca", "Remo con barra", "Peso muerto", "Curl de bíceps", "Extensión de tríceps", "Sentadillas con barra", "Press militar", "Dominadas con peso", "Tijeras", "Plancha lateral"][i - 11]
         WHEN i <= 30 THEN ["Crunches", "Flexiones con rodillas", "Sentadillas sumo", "Zancadas laterales", "Kettlebell swings", "Tijeras verticales", "Elevación de piernas", "Plancha con levantamiento de pierna", "Burpees con salto", "Flexiones de tríceps"][i - 21]
         WHEN i <= 40 THEN ["Remo con mancuerna", "Sentadillas con kettlebell", "Push press", "Abdominales con giro", "Flexiones con aplauso", "Zancadas con salto", "Remo invertido", "Curl de pierna", "Extensión de cadera", "Prensa de piernas"][i - 31]
         WHEN i <= 50 THEN ["Plancha con rodillas", "Flexiones de pike", "Flexiones de antebrazo", "Elevaciones de talón en máquina", "Crunches inversos", "Sentadillas búlgaras", "Push-ups en TRX", "Plancha con toque de hombro", "Sentadillas con salto", "Flexiones con agarre cerrado"][i - 41]
         WHEN i <= 60 THEN ["Remo con banda elástica", "Curl de bíceps en banco inclinado", "Estocadas hacia adelante", "Flexiones de codo en paralelas", "Crunches con balón medicinal", "Sentadillas con mancuernas", "Plancha con elevación de brazo", "Tijeras con peso", "Extensión de tríceps con cuerda", "Flexiones con pies elevados"][i - 51]
         WHEN i <= 70 THEN ["Elevaciones de piernas colgado", "Flexiones con agarre ancho", "Zancadas con mancuernas", "Abdominales en máquina", "Remo con banda", "Prensa de hombros", "Sentadillas en caja", "Plancha con levantamiento de cadera", "Flexiones con apoyo de rodillas", "Crunches con banda"][i - 61]
         WHEN i <= 80 THEN ["Flexiones de pectoral", "Curl de piernas en máquina", "Elevación de caderas en banco", "Plancha con desplazamiento", "Sentadillas con barra frontal", "Remo con kettlebell", "Crunches en fitball", "Extensión de piernas en máquina", "Flexiones con peso", "Elevaciones de pantorrillas"][i - 71]
         WHEN i <= 90 THEN ["Plancha con levantamiento de pierna alterno", "Sentadillas en máquina", "Flexiones en anillas", "Crunches en banco inclinado", "Zancadas en máquina", "Remo con barra T", "Plancha con toque de pie", "Flexiones de pecho en TRX", "Extensiones de tríceps en máquina", "Elevación de talones en prensa"][i - 81]
        ELSE ["Sentadillas con banda", "Flexiones de tríceps en banco", "Crunches con elevación de piernas", "Zancadas con barra", "Plancha con giro", "Flexiones con rodillas en fitball", "Sentadillas con kettlebell a una pierna", "Curl de bíceps con cuerda", "Elevación de cadera en fitball", "Flexiones de hombros con mancuernas"][i - 91]
        END,
        descripcion:
CASE
         WHEN i % 10 = 0 THEN "Ejercicio avanzado para fuerza y resistencia"
        ELSE "Ejercicio básico para entrenamiento funcional"
        END,
        cantidadRepeticiones:
CASE
         WHEN i % 2 = 0 THEN "10-12"
        ELSE "15-20"
        END,
        cantidadTiempo:
CASE
         WHEN i % 3 = 0 THEN 60
        ELSE 45
        END,
        esPorTiempo:
CASE
         WHEN i % 4 = 0 THEN true
        ELSE false
        END
        });
        
//Crea 50 rutinas que usen 3 o 4 ejercicios
        UNWIND range(1, 50) AS i
        CREATE (r:Rutina {
          nombre:
CASE
           WHEN i % 2 = 0 THEN ["Rutina de Fuerza", "Rutina de Resistencia", "Rutina de Flexibilidad", "Rutina de Alta Intensidad", "Rutina de Cardio"][i % 5]
          ELSE ["Rutina de Musculación", "Rutina de Core", "Rutina de Recuperación", "Rutina de Potencia", "Rutina de Agilidad"][i % 5]
          END,
          descripcion:
CASE
           WHEN i % 2 = 0 THEN ["Enfocada en fuerza muscular", "Para mejorar la resistencia", "Concentrada en flexibilidad", "Entrenamiento de alta intensidad", "Para potenciar el rendimiento cardiovascular"][i % 5]
          ELSE ["Diseñada para aumentar masa muscular", "Para fortalecer el núcleo", "Rutina suave para recuperación", "Entrenamiento para desarrollar potencia", "Mejorar la agilidad y coordinación"][i % 5]
          END,
          duracionMinutosPorDia:
CASE
           WHEN i % 3 = 0 THEN 45
          ELSE 30
          END,
          dificultad:
CASE
           WHEN i % 3 = 0 THEN "PRINCIPIANTE"
           WHEN i % 3 = 1 THEN "INTERMEDIO"
          ELSE "AVANZADO"
          END
          })
          WITH r
// Seleccionar entre 3 y 4 ejercicios aleatorios para cada rutina
          WITH r, [
          "Flexiones", "Sentadillas", "Dominadas", "Burpees", "Plancha",
          "Zancadas", "Abdominales", "Fondos", "Elevación de talones", "Puente de glúteos",
          "Press de banca", "Remo con barra", "Peso muerto", "Curl de bíceps", "Extensión de tríceps",
          "Sentadillas con barra", "Press militar", "Dominadas con peso", "Tijeras", "Plancha lateral",
          "Crunches", "Flexiones con rodillas", "Sentadillas sumo", "Zancadas laterales", "Kettlebell swings",
          "Tijeras verticales", "Elevación de piernas", "Plancha con levantamiento de pierna", "Burpees con salto",
          "Flexiones de tríceps", "Remo con mancuerna", "Sentadillas con kettlebell", "Push press", "Abdominales con giro",
          "Flexiones con aplauso", "Zancadas con salto", "Remo invertido", "Curl de pierna", "Extensión de cadera",
          "Prensa de piernas", "Plancha con rodillas", "Flexiones de pike", "Flexiones de antebrazo", "Elevaciones de talón en máquina",
          "Crunches inversos", "Sentadillas búlgaras", "Push-ups en TRX", "Plancha con toque de hombro", "Sentadillas con salto",
          "Flexiones con agarre cerrado", "Remo con banda elástica", "Curl de bíceps en banco inclinado", "Estocadas hacia adelante",
          "Flexiones de codo en paralelas", "Crunches con balón medicinal", "Sentadillas con mancuernas", "Plancha con elevación de brazo",
          "Tijeras con peso", "Extensión de tríceps con cuerda", "Flexiones con pies elevados", "Elevaciones de piernas colgado",
          "Flexiones con agarre ancho", "Zancadas con mancuernas", "Abdominales en máquina", "Remo con banda", "Prensa de hombros",
          "Sentadillas en caja", "Plancha con levantamiento de cadera", "Flexiones con apoyo de rodillas", "Crunches con banda"
          ] AS ejercicios
          WITH r, ejercicios
// Seleccionar un número aleatorio entre 3 y 4 ejercicios
          WITH r, ejercicios[0..size(ejercicios) - 1] AS posiblesEjercicios
          WITH r, [x IN posiblesEjercicios
WHERE rand() < 0.5] AS ejerciciosSeleccionados
          WITH r, ejerciciosSeleccionados[0..4] AS ejerciciosSeleccionados
          UNWIND ejerciciosSeleccionados AS ejercicio
          MATCH (e:Ejercicio { nombre: ejercicio })
          CREATE (r)-[:TIENE]->(e);
