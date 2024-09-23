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
