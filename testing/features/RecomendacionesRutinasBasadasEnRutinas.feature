# language: es
Característica: Sugerencia de rutinas basadas en las rutinas que ya realiza el usuario

  Escenario: Obtener sugerencias de rutinas basadas en rutinas 
    Dado que se ingresan los datos de un usuario existente "lucas123", en rutinas por rutinas
    Cuando se obtienen las sugerencias de rutinas basadas en rutinas
    Entonces se espera que las sugerencias de rutinas basadas en rutinas sean 
    """
    {
      "data": []
    }
    """

  Escenario: Obtener sugerencias de rutinas basadas en rutinas donde se recomienda tres rutinas con prioridad marcada
    Dado que se ingresan los datos de un usuario existente "eric99", en rutinas por rutinas
    Cuando se obtienen las sugerencias de rutinas basadas en rutinas
    Entonces se espera que las sugerencias de rutinas basadas en rutinas sean 
    """
    {
        "data": 
            [
                {
                    "nombre": "Rutina Cardio Pro",
                    "descripcion": "Cardio para expertos",
                    "duracionMinutosPorDia": 35
                },
                {
                    "nombre": "Rutina de Resistencia Avanzada",
                    "descripcion": "Resistencia avanzada",
                    "duracionMinutosPorDia": 50
                },
                {
                    "nombre": "Rutina HIIT Extrema",
                    "descripcion": "Entrenamiento extremo",
                    "duracionMinutosPorDia": 25
                }
            ]
    }
    """