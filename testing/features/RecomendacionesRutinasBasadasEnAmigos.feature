# language: es
Característica: Recomendación de rutinas de tus amigos

  Escenario: Recomendar rutinas realizadas por amigos
    Dado que se ingresan los datos de un usuario existente "lucas123"
    Y los amigos de "lucas123" realizan varias rutinas
    Cuando se obtienen las sugerencias de rutinas basadas en amigos
    Entonces se espera que las rutinas sugeridas sean 
    """
      {
        "data": 
          [
            {
              "nombre": "Cardio para principiantes",
              "descripcion": "Rutina enfocada en ejercicios cardiovasculares para principiantes.",
              "duracionMinutosPorDia": 40,
              "dificultad": "PRINCIPIANTE"
            },
            {

              "nombre": "Fuerza y resistencia",
              "descripcion": "Mejora la fuerza y resistencia muscular con esta rutina.",
              "duracionMinutosPorDia": 50,
              "dificultad": "INTERMEDIO"
            }
          ]
      }
    """

  Escenario: No recomendar rutinas que el usuario ya realiza
    Dado que se ingresan los datos de un usuario existente "eric456"
    Y los amigos de "eric456" realizan varias rutinas
    Y el usuario "eric456" ya realiza la rutina "Fuerza y resistencia"
    Cuando se obtienen las sugerencias de rutinas basadas en amigos
    Entonces se espera que las rutinas sugeridas sean 
    """
      {
        "data": 
          [
            {
              "nombre": "Entrenamiento funcional",
              "descripcion": "Rutina de ejercicios funcionales para todo el cuerpo.",
              "duracionMinutosPorDia": 45,
              "dificultad": "AVANZADO"
            }
          ]
      }
    """

  Escenario: Priorizar rutinas realizadas por más amigos
    Dado que se ingresan los datos de un usuario existente "facundo789"
    Y los amigos de "facundo789" realizan varias rutinas
    Y una de las rutinas es realizada por más amigos
    Cuando se obtienen las sugerencias de rutinas basadas en amigos
    Entonces se espera que las rutinas sugeridas sean 
    """
      {
        "data": 
          [
            {
              "nombre": "Yoga y meditación",
              "descripcion": "Rutina de estiramientos y meditación para relajarse.",
              "duracionMinutosPorDia": 30,
              "dificultad": "PRINCIPIANTE"
            },
            {
              "nombre": "HIIT avanzado",
              "descripcion": "Entrenamiento de alta intensidad con intervalos.",
              "duracionMinutosPorDia": 35,
              "dificultad": "AVANZADO"
            }
          ]
      }
    """